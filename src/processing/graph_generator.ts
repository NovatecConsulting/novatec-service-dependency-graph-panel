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
import NodeTree from './node_tree';
import NodeSubstitutor from './node_substitutor';

class GraphGenerator {
  controller: PanelController;
  nodeSubstitutor: NodeSubstitutor;

  constructor(controller: PanelController) {
    this.controller = controller;
    this.nodeSubstitutor = new NodeSubstitutor();
  }

  _createNode(dataElements: GraphDataElement[], nodeTree: NodeTree): IntGraphNode | undefined {
    if (!dataElements || dataElements.length <= 0) {
      return undefined;
    }

    const sumMetrics = this.controller.getSettings(true).sumTimings;

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
        layer: 0,
        metrics,
        namespace: [],
      },
    };

    //get first element where namespace is defined.
    const namespaceElement = dataElements.find((el) => el.namespace !== undefined);
    if (namespaceElement) {
      const namespace = namespaceElement.namespace;
      node.data.namespace = namespace;
      node.data.layer = namespace.length;
      node.data.parent = namespace[namespace.length - 1];
      this._updateMaxLayer(node.data.layer);
    }

    const aggregationFunction = sumMetrics ? _.sum : _.mean;

    if (internalNode) {
      metrics.rate = _.sum(_.map(dataElements, (element) => element.data.rate_in));
      metrics.error_rate = _.sum(_.map(dataElements, (element) => element.data.error_rate_in));

      const response_timings = _.map(dataElements, (element) => element.data.response_time_in).filter(isPresent);
      if (response_timings.length > 0) {
        metrics.response_time = aggregationFunction(response_timings);
      }
    } else {
      metrics.rate = _.sum(_.map(dataElements, (element) => element.data.rate_out));
      metrics.error_rate = _.sum(_.map(dataElements, (element) => element.data.error_rate_out));

      const response_timings = _.map(dataElements, (element) => element.data.response_time_out).filter(isPresent);
      if (response_timings.length > 0) {
        metrics.response_time = aggregationFunction(response_timings);
      }

      const externalType = _(dataElements)
        .map((element) => element.data.type)
        .uniq()
        .value();

      if (externalType.length === 1) {
        node.data.external_type = externalType[0];
      }
    }

    // metrics which are same for internal and external nodes
    metrics.threshold = _(dataElements)
      .map((element) => element.data.threshold)
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

    nodeTree.addNode(node);
    this.nodeSubstitutor.add(node);
    return node;
  }

  _createMissingNodes(data: GraphDataElement[], nodes: IntGraphNode[]): IntGraphNode[] {
    const existingNodeNames = _.map(nodes, (node) => node.data.id);
    const expectedNodeNames = _.uniq(_.flatMap(data, (dataElement) => [dataElement.source, dataElement.target])).filter(
      isPresent
    );
    const missingNodeNames = _.difference(expectedNodeNames, existingNodeNames);
    const missingNodes = _.map(missingNodeNames, (name) => {
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
          layer: 0,
        },
      };
      this.nodeSubstitutor.add(value);
      return value;
    });
    return missingNodes;
  }

  _createNodes(data: GraphDataElement[]): IntGraphNode[] {
    var tree = new NodeTree();
    const filteredData = _.filter(
      data,
      (dataElement) =>
        dataElement.source !== dataElement.target ||
        (_.has(dataElement, 'target') && !_.has(dataElement, 'target')) ||
        (!_.has(dataElement, 'target') && _.has(dataElement, 'target'))
    );

    const targetGroups = _.groupBy(filteredData, 'target');

    const explicitlyNamedNodes = _.map(targetGroups, (group) => this._createNode(group, tree)).filter(isPresent);

    // ensure that all nodes exist, even we have no data for them
    const missingNodes = this._createMissingNodes(filteredData, explicitlyNamedNodes);
    missingNodes.forEach((node) => tree.addNode(node));
    const allNodes = tree.getNodesFromLayer(this.controller.state.currentLayer);
    return allNodes;
  }

  _resolveSubstitute(name: string): string {
    return this.nodeSubstitutor.substituteUntilLayer(
      name,
      this.controller.state.currentLayer,
      this.controller.maxLayer
    );
  }

  _createEdge(dataElement: GraphDataElement): IntGraphEdge | undefined {
    var { source, target } = dataElement;
    if (source === undefined || target === undefined) {
      console.error('source and target are necessary to create an edge', dataElement);
      return undefined;
    }

    const metrics: IntGraphMetrics = {};

    source = this._resolveSubstitute(source);
    target = this._resolveSubstitute(target);
    if (source === target) {
      return undefined;
    }

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

      if (sumTimings && metrics.rate) {
        metrics.response_time = response_time_out / metrics.rate;
      } else {
        metrics.response_time = response_time_out;
      }
    }

    return edge;
  }

  _resolveEdgeMap(edges: IntGraphEdge[]) {
    var edgeMap: Map<string, IntGraphEdge[]> = new Map();
    edges.forEach((edge) => {
      if (edgeMap.get(edge.source + '-' + edge.target)) {
        edgeMap.get(edge.source + '-' + edge.target).push(edge);
      } else {
        edgeMap.set(edge.source + '-' + edge.target, [edge]);
      }
    });
    return edgeMap;
  }

  _mergeArrayOfEdges(edges: IntGraphEdge[]) {
    var errorRateCounter = 0;
    var rateCounter = 0;
    var responseTimeCounter = 0;
    var successRateCounter = 0;
    var thresholdCounter = 0;

    const mergedEdge: IntGraphEdge = {
      target: '',
      source: '',
      data: {
        source: '',
        target: '',
        metrics: {},
      },
    };
    edges.forEach((edge) => {
      if (mergedEdge.source === '') {
        mergedEdge.source = edge.source;
        mergedEdge.data.source = edge.data.source;
      }
      if (mergedEdge.target === '') {
        mergedEdge.target = edge.target;
        mergedEdge.data.target = edge.data.target;
      }
      if (edge.data.metrics.error_rate) {
        mergedEdge.data.metrics.error_rate = mergedEdge.data.metrics.error_rate
          ? mergedEdge.data.metrics.error_rate + edge.data.metrics.error_rate
          : (mergedEdge.data.metrics.error_rate = edge.data.metrics.error_rate);
        errorRateCounter++;
      }
      if (edge.data.metrics.rate) {
        mergedEdge.data.metrics.rate = mergedEdge.data.metrics.rate
          ? mergedEdge.data.metrics.rate + edge.data.metrics.rate
          : (mergedEdge.data.metrics.rate = edge.data.metrics.rate);
        rateCounter++;
      }
      if (edge.data.metrics.response_time) {
        mergedEdge.data.metrics.response_time = mergedEdge.data.metrics.response_time
          ? mergedEdge.data.metrics.response_time + edge.data.metrics.response_time
          : (mergedEdge.data.metrics.response_time = edge.data.metrics.response_time);
        responseTimeCounter++;
      }
      if (edge.data.metrics.success_rate) {
        mergedEdge.data.metrics.success_rate = mergedEdge.data.metrics.success_rate
          ? mergedEdge.data.metrics.success_rate + edge.data.metrics.success_rate
          : (mergedEdge.data.metrics.success_rate = edge.data.metrics.success_rate);
        successRateCounter++;
      }
      if (edge.data.metrics.threshold) {
        mergedEdge.data.metrics.threshold = mergedEdge.data.metrics.threshold
          ? mergedEdge.data.metrics.threshold + edge.data.metrics.threshold
          : (mergedEdge.data.metrics.threshold = edge.data.metrics.threshold);
        thresholdCounter++;
      }
    });

    if (mergedEdge.data.metrics.error_rate) {
      mergedEdge.data.metrics.error_rate = mergedEdge.data.metrics.error_rate / errorRateCounter;
    }
    if (mergedEdge.data.metrics.rate) {
      mergedEdge.data.metrics.rate = mergedEdge.data.metrics.rate / rateCounter;
    }
    if (mergedEdge.data.metrics.response_time) {
      mergedEdge.data.metrics.response_time = mergedEdge.data.metrics.response_time / responseTimeCounter;
    }
    if (mergedEdge.data.metrics.success_rate) {
      mergedEdge.data.metrics.success_rate = mergedEdge.data.metrics.success_rate / successRateCounter;
    }
    if (mergedEdge.data.metrics.threshold) {
      mergedEdge.data.metrics.threshold = mergedEdge.data.metrics.threshold / thresholdCounter;
    }

    return mergedEdge;
  }

  _edgeMapToMergedEdges(edgeMap: Map<string, IntGraphEdge[]>) {
    var edges: IntGraphEdge[] = [];
    for (const entry of edgeMap.values()) {
      edges.push(this._mergeArrayOfEdges(entry));
    }
    return edges;
  }

  _mergeEdges(edges: IntGraphEdge[]) {
    const edgeMap = this._resolveEdgeMap(edges);
    this._edgeMapToMergedEdges(edgeMap);

    return edges;
  }

  _createEdges(data: GraphDataElement[]): IntGraphEdge[] {
    const filteredData = _(data)
      .filter((e) => !!e.source)
      .filter((e) => e.source !== e.target)
      .filter((e) => e.target !== null || e.source !== null)
      .value();

    const edges = _.map(filteredData, (element) => this._createEdge(element));
    const filteredEdges = edges.filter(isPresent);
    return this._mergeEdges(filteredEdges);
  }

  _filterData(graph: IntGraph): IntGraph {
    const { filterEmptyConnections: filterData } = this.controller.getSettings(true);

    if (filterData) {
      const filteredGraph: IntGraph = {
        nodes: [],
        edges: [],
      };

      // filter empty connections
      filteredGraph.edges = _.filter(graph.edges, (edge) => _.size(edge.data.metrics) > 0);

      filteredGraph.nodes = _.filter(graph.nodes, (node) => {
        const id = node.data.id;

        // don't filter connected elements and parents
        if (
          _.some(graph.edges, { source: id }) ||
          _.some(graph.edges, { target: id }) ||
          node.data.type === EnGraphNodeType.PARENT
        ) {
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

  _updateMaxLayer(layer: number) {
    if (layer > this.controller.maxLayer) {
      this.controller.maxLayer = layer;
    }
  }
}

export default GraphGenerator;
