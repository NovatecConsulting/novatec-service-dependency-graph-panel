import React from 'react';
import  { PureComponent } from 'react';
import { DataFrameView, PanelProps, toDataFrame } from '@grafana/data';
import { ServiceDependencyGraph } from './serviceDependencyGraph/ServiceDependencyGraph'
import _, { each, has, find, remove, map, isUndefined } from 'lodash';
import {  CyData, IGraph, IGraphEdge, IGraphNode, PanelSettings, QueryResponse } from '../types';
import { getTemplateSrv } from '@grafana/runtime';
import cytoscape, { EdgeSingular, NodeSingular } from 'cytoscape';
import '../css/novatec-service-dependency-graph-panel.css'
import GraphGenerator from 'processing/graph_generator';
import PreProcessor from 'processing/pre_processor';


interface Props extends PanelProps<PanelSettings> {}

interface PanelState {
    id: any, 
    data: any, 
    fieldConfig: any, 
    height:any, 
    width: any, 
    onChangeTimeRange: any, 
    onFieldConfigChange: any, 
    onOptionsChange: any, 
    renderCounter: any, 
    replaceVariables: any, 
    timeRange: any, 
    timeZone: any, 
    title: any, 
    transparent: any
    options: any
  }

export class ServiceDependencyGraphPanelController extends PureComponent<Props, PanelState> {

  cy: cytoscape.Core | undefined
  ref:any
  panel: any;
  validQueryTypes: any
  graphGenerator: any;
  preProcessor: any;
  currentData: any;
  constructor(props: Props){
    super(props);
    this.state = {...props}
    this.ref = React.createRef()
    this.graphGenerator = new GraphGenerator(this)
    this.preProcessor = new PreProcessor(this)
  }

  getSettings(): PanelSettings {
    return this.state.options
 }

 processQueryData(data: any[]) {
  this.validQueryTypes = this.hasOnlyTableQueries(data);
  if (this.hasAggregationVariable()) {
    const graphData = this.preProcessor.processData(data);
    console.groupCollapsed('Processed received data');
    console.log('raw data: ', data);
    console.log('graph data: ', graphData);
    console.groupEnd();

    return this.currentData = graphData;
  } else {
    this.currentData = undefined;
  }
}

hasOnlyTableQueries(inputData: QueryResponse[]) {
  var result: boolean = true;

  each(inputData, dataElement => {
    if (!has(dataElement, 'columns')) {
      result = false;
    }
  });

  return result;
}

getAggregationType() {
  const variables: any[] = getTemplateSrv().getVariables()
  console.log(variables)
  const index = _.findIndex(variables, function(o: any) { 
    console.log(o);
    return o.id === 'aggregationType'; });
  if(index >= 0) {
    return variables[index].query
  }
  console.log(index)
  return -1;
}

hasAggregationVariable() {
  const templateVariable: any = this.getAggregationType();

  return !!templateVariable;
}

processData(){
  console.log(this.props.data)
  this.processQueryData(this.state.data.series)
  console.log(this.currentData)
  const graph: any = this.graphGenerator.generateGraph(this.currentData);
  return graph
 }

_transformEdges(edges: IGraphEdge[]): CyData[] {
  console.log(edges)
  const cyEdges = map(edges, edge => {
    const cyEdge = {
      group: 'edges',
      data: {
        id: edge.source + ":" + edge.target,
        source: edge.source,
        target: edge.target,
        metrics: {
          ...edge.metrics
        }
      }
    };
    return cyEdge;
  });
  
  console.log(cyEdges)
  return cyEdges;
}
   
_transformNodes(nodes: IGraphNode[]): CyData[] {
  console.log(nodes)
  const cyNodes = map(nodes, node => {
    const result: CyData = {
      group: 'nodes',
      data: {
        id: node.name,
        type: node.type,
        external_type: node.external_type,
        metrics: {
          ...node.metrics
        }
      }
    };
    return result;
  });
  console.log(cyNodes)
  return cyNodes;
}
   
_updateOrRemove(dataArray: (NodeSingular | EdgeSingular)[], inputArray: CyData[]) {
  const elements: (NodeSingular | EdgeSingular)[] = [];
  for (let i = 0; i < dataArray.length; i++) {
    const element = dataArray[i];

    const cyNode = find(inputArray, { data: { id: element.id() } });

    if (cyNode) {
      element.data(cyNode.data);
      remove(inputArray, n => n.data.id === cyNode.data.id);
      elements.push(element);
    } else {
      element.remove();
    }
  }
  return elements;
}

_updateGraph(graph: IGraph, cy: any) {
  console.log(graph)
  const cyNodes = this._transformNodes(graph.nodes);
  const cyEdges = this._transformEdges(graph.edges);

  console.groupCollapsed("Updating graph");
  console.log("cytoscape nodes: ", JSON.parse(JSON.stringify(cyNodes)));
  console.log("cytoscape edges: ", JSON.parse(JSON.stringify(cyEdges)));
  console.groupEnd();
  const nodes = cy.nodes().toArray();
  const updatedNodes = this._updateOrRemove(nodes, cyNodes);

  // add new nodes
  cy.add(cyNodes);

  const edges = cy.edges().toArray();
  this._updateOrRemove(edges, cyEdges);

  // add new edges
  cy.add(cyEdges);

  if (cyNodes.length > 0) {
    each(updatedNodes, node => {
      node.lock();
    });
    //this.runLayout(true);
  }
  
}

getError(): string | null {
  if (!this.hasAggregationVariable()) {
    return "Please provide a 'aggregationType' template variable.";
  }
  if (!this.validQueryTypes) {
    // TODO: make validQueryTypes work! return "Invalid query types - only use queries which return table data.";
  }
  if (!this.isDataAvailable()) {
    return "No data to show - the query returned no data.";
  }
  return null;
}

isDataAvailable() {
  const dataExist = !isUndefined(this.currentData) && !isUndefined(this.currentData.graph) &&  this.currentData.graph.length > 0;
  return dataExist;
}

render(){
  console.log(this.state.data.series)
  const frame = toDataFrame(this.state.data.series)
  console.log(frame)
  const view = new DataFrameView(frame);
  console.log(view)
  this.currentData = this.processData()
  var panel = (<div>{this.getError()}</div>)
  if(this.getError() === null) {
    panel = (<div></div>)
  }
  console.log(this.props)
  
  return (
    <div>
      <div className="service-dependency-graph-panel" style ={ {height: this.props.height, width: this.props.width}} ref={this.ref} id = "cy">
                <ServiceDependencyGraph data={ this.processData() } zoom = { 1 }  controller = { this } animate = { false } showStatistics = {false}/>
            </div>
    </div>
      );
    }
  }