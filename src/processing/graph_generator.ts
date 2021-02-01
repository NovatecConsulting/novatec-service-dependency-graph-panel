import _ from 'lodash';
import { isPresent } from './utils/Utils';
import { PanelController } from '../panel/PanelController';
import {
  GraphDataElement,
  IntGraph,
  IntGraphEdge,
  IntGraphMetrics,
  IntGraphNode,
  EnGraphNodeType,
  GraphDataType,
} from '../types';

class GraphGenerator {
  controller: PanelController;

  constructor(controller: PanelController) {
    this.controller = controller;
  }

  _createNode(dataElements: GraphDataElement[]): IntGraphNode | undefined {
    if (!dataElements || dataElements.length <= 0) {
      return undefined;
    }

    const sumMetrics = !this.controller.getSettings(true).sumTimings;

    var nodeName = dataElements[0].target;
    if (nodeName === '' || nodeName === undefined || nodeName === null) {
      nodeName = 'undefined';
    }

    const internalNode =
      _.some(dataElements, ['type', GraphDataType.INTERNAL]) ||
      _.some(dataElements, ['type', GraphDataType.EXTERNAL_IN]);
    const nodeType = internalNode ? EnGraphNodeType.INTERNAL : EnGraphNodeType.EXTERNAL;

    const metrics: IntGraphMetrics = {};

    const node: IntGraphNode = {
      data: {
        id: nodeName,
        label: nodeName,
        external_type: nodeType,
        type: nodeType,
        metrics,
      },
    };

    const aggregationFunction = sumMetrics ? _.sum : _.mean;

    if (internalNode) {
      metrics.rate = _.sum(_.map(dataElements, element => element.data.rate_in));
      metrics.error_rate = _.sum(_.map(dataElements, element => element.data.error_rate_in));

      const response_timings = _.map(dataElements, element => element.data.response_time_in).filter(isPresent);
      if (response_timings.length > 0) {
        metrics.response_time = aggregationFunction(response_timings);
      }
    } else {
      metrics.rate = _.sum(_.map(dataElements, element => element.data.rate_out));
      metrics.error_rate = _.sum(_.map(dataElements, element => element.data.error_rate_out));

      const response_timings = _.map(dataElements, element => element.data.response_time_out).filter(isPresent);
      if (response_timings.length > 0) {
        metrics.response_time = aggregationFunction(response_timings);
      }

      const externalType = _(dataElements)
        .map(element => element.data.type)
        .uniq()
        .value();

      if (externalType.length === 1) {
        node.data.external_type = externalType[0];
      }
    }

    // metrics which are same for internal and external nodes
    metrics.threshold = _(dataElements)
      .map(element => element.data.threshold)
      .filter()
      .mean();

    if (sumMetrics) {
      const requestCount = _.defaultTo(metrics.rate, 0) + _.defaultTo(metrics.error_rate, 0);
      const response_time = _.defaultTo(metrics.response_time, -1);
      if (requestCount > 0 && response_time >= 0) {
        metrics.response_time = response_time / requestCount;
      }
    }

    const { rate, error_rate } = metrics;
    if (rate + error_rate > 0) {
      metrics.success_rate = (1.0 / (rate + error_rate)) * rate;
    } else {
      metrics.success_rate = 1.0;
    }
    return node;
  }

  _createMissingNodes(data: GraphDataElement[], nodes: IntGraphNode[]): IntGraphNode[] {
    const existingNodeNames = _.map(nodes, node => node.data.id);
    const expectedNodeNames = _.uniq(_.flatMap(data, dataElement => [dataElement.source, dataElement.target])).filter(
      isPresent
    );
    const missingNodeNames = _.difference(expectedNodeNames, existingNodeNames);

    const missingNodes = _.map(missingNodeNames, name => {
      let nodeType: EnGraphNodeType;
      let external_type: string | undefined;

      // derive node type
      let elementSrc = _.find(data, { source: name });
      let elementTrgt = _.find(data, { target: name });
      if (elementSrc && elementSrc.type === GraphDataType.EXTERNAL_IN) {
        nodeType = EnGraphNodeType.EXTERNAL;
        external_type = elementSrc.data.type;
      } else if (elementTrgt && elementTrgt.type === GraphDataType.EXTERNAL_OUT) {
        nodeType = EnGraphNodeType.EXTERNAL;
        external_type = elementTrgt.data.type;
      } else {
        nodeType = EnGraphNodeType.INTERNAL;
      }
      var value: IntGraphNode = {
        data: {
          id: name,
          type: nodeType,
          external_type: external_type,
          metrics: {},
        },
      };

      return value;
    });

    return missingNodes;
  }

  _createNodes(data: GraphDataElement[]): IntGraphNode[] {
    const filteredData = _.filter(
      data,
      dataElement =>
        dataElement.source !== dataElement.target ||
        (_.has(dataElement, 'target') && !_.has(dataElement, 'target')) ||
        (!_.has(dataElement, 'target') && _.has(dataElement, 'target'))
    );

    const targetGroups = _.groupBy(filteredData, 'target');

    const nodes = _.map(targetGroups, group => this._createNode(group)).filter(isPresent);

    // ensure that all nodes exist, even we have no data for them
    const missingNodes = this._createMissingNodes(filteredData, nodes);

    return _.concat(nodes, missingNodes);
  }

  _createEdge(dataElement: GraphDataElement): IntGraphEdge | undefined {
    const { source, target } = dataElement;

    if (source === undefined || target === undefined) {
      console.error('source and target are necessary to create an edge', dataElement);
      return undefined;
    }

    const metrics: IntGraphMetrics = {};

    const edge: IntGraphEdge = {
      source: source,
      target: target,
      data: {
        source,
        target,
        metrics,
      },
    };

    const { rate_out, rate_in, error_rate_out, response_time_out } = dataElement.data;
    if (!_.isUndefined(rate_out)) {
      metrics.rate = rate_out;
    } else if (!_.isUndefined(rate_in)) {
      metrics.rate = rate_in;
    }
    if (!_.isUndefined(error_rate_out)) {
      metrics.error_rate = error_rate_out;
    }
    if (!_.isUndefined(response_time_out)) {
      const { sumTimings } = this.controller.getSettings(true);

      if (!sumTimings && metrics.rate) {
        metrics.response_time = response_time_out / metrics.rate;
      } else {
        metrics.response_time = response_time_out;
      }
    }

    return edge;
  }

  _createEdges(data: GraphDataElement[]): IntGraphEdge[] {
    const filteredData = _(data)
      .filter(e => !!e.source)
      .filter(e => e.source !== e.target)
      .value();

    const edges = _.map(filteredData, element => this._createEdge(element));
    return edges.filter(isPresent);
  }

  _filterData(graph: IntGraph): IntGraph {
    const { filterEmptyConnections: filterData } = this.controller.getSettings(true);

    if (filterData) {
      const filteredGraph: IntGraph = {
        nodes: [],
        edges: [],
      };

      // filter empty connections
      filteredGraph.edges = _.filter(graph.edges, edge => _.size(edge.data.metrics) > 0);

      filteredGraph.nodes = _.filter(graph.nodes, node => {
        const id = node.data.id;

        // don't filter connected elements
        if (_.some(graph.edges, { 'data.source': id }) || _.some(graph.edges, { 'data.target': id })) {
          return true;
        }

        const metrics = node.data.metrics;
        if (!metrics) {
          return false; // no metrics
        }

        // only if rate, error rate or response time is available
        return (
          _.defaultTo(metrics.rate, -1) >= 0 ||
          _.defaultTo(metrics.error_rate, -1) >= 0 ||
          _.defaultTo(metrics.response_time, -1) >= 0
        );
      });

      return filteredGraph;
    } else {
      return graph;
    }
  }

  generateGraph(graphData: GraphDataElement[]): IntGraph {
    const nodes = this._createNodes(graphData);

    const edges = this._createEdges(graphData);

    const graph: IntGraph = {
      nodes,
      edges,
    };

    const filteredGraph = this._filterData(graph);

    return filteredGraph;
  }
}

export default GraphGenerator;
