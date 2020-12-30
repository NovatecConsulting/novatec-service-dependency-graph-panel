import React from 'react';
import  { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { ServiceDependencyGraph } from './serviceDependencyGraph/ServiceDependencyGraph'
import _, { each, has, find, remove, map, isUndefined } from 'lodash';
import {  CyData, IGraphEdge, IGraphNode, PanelSettings, QueryResponse } from '../types';
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

 componentDidUpdate() {
  console.log(this.props.data)
  console.log(this.currentData)
  this.processData();
  console.log(this.currentData)
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

  const index = _.findIndex(variables, function(o: any) { 
    return o.id === 'aggregationType'; 
  });

  if(index >= 0) {
    return variables[index].query
  }

  return -1;
}

hasAggregationVariable() {
  const templateVariable: any = this.getAggregationType();

  return !!templateVariable;
}

processData(){
  this.processQueryData(this.props.data.series)
  const graph: any = this.graphGenerator.generateGraph(this.currentData.graph);
  return graph
 }

_transformEdges(edges: IGraphEdge[]): CyData[] {
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
  
  return cyEdges;
}
   
_transformNodes(nodes: IGraphNode[]): CyData[] {
  const cyNodes = map(nodes, node => {
    console.log(node)
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

getError(): string | null {
  if (!this.hasAggregationVariable()) {
    return "Please provide a 'aggregationType' template variable.";
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
  this.processData()
  const error = this.getError()
  var panel = (<div>{error}</div>);
  if( error === null) {
    panel = (<div>
      <div className="service-dependency-graph-panel" style ={ {height: this.props.height, width: this.props.width}} ref={this.ref} id = "cy">
                <ServiceDependencyGraph data={ this.processData() } zoom = { 1 }  controller = { this } animate = { false } showStatistics = {false}/>
            </div>
         </div>
      );
  } 

  return (panel);
  }
}