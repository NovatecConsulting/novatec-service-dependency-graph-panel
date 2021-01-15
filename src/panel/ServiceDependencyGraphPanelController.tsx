import React, { LegacyRef } from 'react';
import { PureComponent } from 'react';
import {
  AbsoluteTimeRange,
  DataFrame,
  FieldConfigSource,
  InterpolateFunction,
  PanelProps,
  TimeRange,
} from '@grafana/data';
import { ServiceDependencyGraph } from './serviceDependencyGraph/ServiceDependencyGraph';
import _ from 'lodash';
import { CurrentData, CyData, IntGraph, IntGraphEdge, IntGraphNode, PanelSettings } from '../types';
import { getTemplateSrv } from '@grafana/runtime';
import cytoscape, { EdgeSingular, NodeSingular } from 'cytoscape';
import '../css/novatec-service-dependency-graph-panel.css';
import GraphGenerator from 'processing/graph_generator';
import PreProcessor from 'processing/pre_processor';
import data from '../dummy_data_frame';

interface Props extends PanelProps<PanelSettings> {}

interface PanelState {
  id: string | number;
  fieldConfig: FieldConfigSource<any>;
  height: number;
  width: number;
  onChangeTimeRange: (timeRange: AbsoluteTimeRange) => void;
  onFieldConfigChange: (config: FieldConfigSource<any>) => void;
  onOptionsChange: (options: PanelSettings) => void;
  renderCounter: number;
  replaceVariables: InterpolateFunction;
  timeRange: TimeRange;
  timeZone: string;
  title: string;
  transparent: boolean;
  options: PanelSettings;
}

export class ServiceDependencyGraphPanelController extends PureComponent<Props, PanelState> {
  cy: cytoscape.Core | undefined;

  ref: LegacyRef<HTMLDivElement>;

  validQueryTypes: boolean;

  graphGenerator: GraphGenerator;

  preProcessor: PreProcessor;

  currentData: CurrentData;

  constructor(props: Props) {
    super(props);
    this.state = { ...props };
    this.ref = React.createRef();
    this.graphGenerator = new GraphGenerator(this);
    this.preProcessor = new PreProcessor(this);
  }

  getSettings(): PanelSettings {
    return this.props.options;
  }

  componentDidUpdate() {
    this.processData();
  }

  processQueryData(data: DataFrame[]) {
    this.validQueryTypes = this.hasOnlyTableQueries(data);
    if (this.hasAggregationVariable()) {
      const graphData = this.preProcessor.processData(data);

      this.currentData = graphData;
    } else {
      this.currentData = undefined;
    }
  }

  hasOnlyTableQueries(inputData: DataFrame[]) {
    var result = true;

    _.each(inputData, dataElement => {
      if (!_.has(dataElement, 'columns')) {
        result = false;
      }
    });

    return result;
  }

  getAggregationType() {
    const variables: any[] = getTemplateSrv().getVariables();

    const index = _.findIndex(variables, function(o: any) {
      return o.id === 'aggregationType';
    });

    if (index >= 0) {
      return variables[index].query;
    }

    return -1;
  }

  hasAggregationVariable() {
    const templateVariable: string = this.getAggregationType();

    return !!templateVariable;
  }

  processData() {
    var inputData: DataFrame[] = this.props.data.series;
    if (this.getSettings().dataMapping.showDummyData) {
      inputData = data;
    }
    this.processQueryData(inputData);
    const graph: IntGraph = this.graphGenerator.generateGraph(this.currentData.graph);
    return graph;
  }

  _transformEdges(edges: IntGraphEdge[]): CyData[] {
    const cyEdges = _.map(edges, edge => {
      const cyEdge = {
        group: 'edges',
        data: {
          id: edge.source + ':' + edge.target,
          source: edge.source,
          target: edge.target,
          metrics: {
            ...edge.metrics,
          },
        },
      };
      return cyEdge;
    });

    return cyEdges;
  }

  _transformNodes(nodes: IntGraphNode[]): CyData[] {
    const cyNodes = _.map(nodes, node => {
      const result: CyData = {
        group: 'nodes',
        data: {
          id: node.data.id,
          type: node.data.type,
          external_type: node.data.external_type,
          metrics: {
            ...node.data.metrics,
          },
        },
      };
      return result;
    });

    return cyNodes;
  }

  _updateOrRemove(dataArray: Array<NodeSingular | EdgeSingular>, inputArray: CyData[]) {
    const elements: Array<NodeSingular | EdgeSingular> = [];
    for (let i = 0; i < dataArray.length; i++) {
      const element = dataArray[i];

      const cyNode = _.find(inputArray, { data: { id: element.id() } });

      if (cyNode) {
        element.data(cyNode.data);
        _.remove(inputArray, n => n.data.id === cyNode.data.id);
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
      return 'No data to show - the query returned no data.';
    }
    return null;
  }

  isDataAvailable() {
    const dataExist =
      !_.isUndefined(this.currentData) && !_.isUndefined(this.currentData.graph) && this.currentData.graph.length > 0;
    return dataExist;
  }

  render() {
    const data = this.processData();
    const error = this.getError();
    if (error === null) {
      return (
        <div>
          <div
            className="service-dependency-graph-panel"
            style={{ height: this.props.height, width: this.props.width }}
            ref={this.ref}
            id="cy"
          >
            <ServiceDependencyGraph
              data={data}
              zoom={1}
              controller={this}
              animate={false}
              showStatistics={false}
              settings={this.props.options}
            />
          </div>
        </div>
      );
    }
    return <div>{error}</div>;
  }
}
