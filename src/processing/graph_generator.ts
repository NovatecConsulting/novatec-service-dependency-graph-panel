import _, { groupBy, filter, map, sum, some, isUndefined, uniq, difference, flatMap, concat, mean, defaultTo, find } from 'lodash';
import { isPresent } from '../util/Utils';
import { ServiceDependencyGraphCtrl } from '../service_dependency_graph_ctrl';
import { GraphDataElement, IGraph, IGraphEdge, IGraphMetrics, IGraphNode, EGraphNodeType, GraphDataType } from '../types';

class GraphGenerator {

	controller: ServiceDependencyGraphCtrl;

	constructor(controller: ServiceDependencyGraphCtrl) {
		this.controller = controller;
	}

	_createNode(dataElements: GraphDataElement[]): IGraphNode | undefined {

		if (!dataElements || dataElements.length <= 0) {
			return undefined;
		}

		const sumMetrics = this.controller.getSettings().sumTimings;

		const nodeName = dataElements[0].target;
		const internalNode = some(dataElements, ['type', GraphDataType.INTERNAL]) || some(dataElements, ['type', GraphDataType.EXTERNAL_IN]);
		const nodeType = internalNode ? EGraphNodeType.INTERNAL : EGraphNodeType.EXTERNAL;

		const metrics: IGraphMetrics = {};

		const node: IGraphNode = {
			name: nodeName,
			type: nodeType,
			metrics
		};

		const aggregationFunction = sumMetrics ? sum : mean;

		if (internalNode) {
			metrics.rate = sum(map(dataElements, element => element.data.rate_in));
			metrics.error_rate = sum(map(dataElements, element => element.data.error_rate_in));
			metrics.response_time = aggregationFunction(map(dataElements, element => element.data.response_time_in));
			metrics.threshold = sum(map(dataElements, element => element.data.threshold));
		} else {
			metrics.rate = sum(map(dataElements, element => element.data.rate_out));
			metrics.error_rate = sum(map(dataElements, element => element.data.error_rate_out));
			metrics.response_time = aggregationFunction(map(dataElements, element => element.data.response_time_out));
			metrics.threshold = sum(map(dataElements, element => element.data.threshold));

			const externalType = _(dataElements)
				.map(element => element.data.type)
				.uniq()
				.value();
			if (externalType.length == 1) {
				node.external_type = externalType[0];
			}
		}

		if (sumMetrics) {
			const requestCount = defaultTo(metrics.rate, 0) + defaultTo(metrics.error_rate, 0);
			if (requestCount > 0) {
				metrics.response_time = metrics.response_time / requestCount;
			}
		}

		const { rate, error_rate } = metrics;
		if (rate + error_rate > 0) {
			metrics.success_rate = 1.0 / (rate + error_rate) * rate;
		} else {
			metrics.success_rate = 1.0;
		}

		return node;
	}

	_createMissingNodes(data: GraphDataElement[], nodes: IGraphNode[]): IGraphNode[] {
		const existingNodeNames = map(nodes, node => node.name);
		const expectedNodeNames = uniq(flatMap(data, dataElement => [dataElement.source, dataElement.target])).filter(isPresent);
		const missingNodeNames = difference(expectedNodeNames, existingNodeNames);

		const missingNodes = map(missingNodeNames, name => {
			let nodeType: EGraphNodeType;

			// derive node type
			let elementSrc = find(data, { source: name });
			let elementTrgt = find(data, { target: name });
			if (elementSrc && elementSrc.type == GraphDataType.EXTERNAL_IN) {
				nodeType = EGraphNodeType.EXTERNAL;
			} else if (elementTrgt && elementTrgt.type == GraphDataType.EXTERNAL_OUT) {
				nodeType = EGraphNodeType.EXTERNAL;
			} else {
				nodeType = EGraphNodeType.INTERNAL;
			}

			return <IGraphNode>{
				name,
				type: nodeType
			};
		});

		return missingNodes;
	}

	_createNodes(data: GraphDataElement[]): IGraphNode[] {
		const filteredData = filter(data, dataElement => dataElement.source !== dataElement.target);

		const targetGroups = groupBy(filteredData, 'target');

		const nodes = map(targetGroups, group => this._createNode(group)).filter(isPresent);

		// ensure that all nodes exist, even we have no data for them
		const missingNodes = this._createMissingNodes(filteredData, nodes);

		return concat(nodes, missingNodes);
	}

	_createEdge(dataElement: GraphDataElement): IGraphEdge | undefined {
		const { source, target } = dataElement;

		if (source === undefined || target === undefined) {
			console.error("source and target are necessary to create an edge", dataElement);
			return undefined;
		}

		const metrics: IGraphMetrics = {};

		const edge: IGraphEdge = {
			source,
			target,
			metrics
		};

		const { rate_out, rate_in, error_rate_out, response_time_out } = dataElement.data;

		if (!isUndefined(rate_out)) {
			metrics.rate = rate_out;
		} else if (!isUndefined(rate_in)) {
			metrics.rate = rate_in;
		}
		if (!isUndefined(error_rate_out)) {
			metrics.error_rate = error_rate_out;
		}
		if (!isUndefined(response_time_out)) {
			const { sumTimings } = this.controller.getSettings();

			if (sumTimings && metrics.rate) {
				metrics.response_time = response_time_out / metrics.rate;
			} else {
				metrics.response_time = response_time_out;
			}
		}


		return edge;
	}

	_createEdges(data: GraphDataElement[]): IGraphEdge[] {

		const filteredData = _(data)
			.filter(e => !!e.source)
			.filter(e => e.source !== e.target)
			.value();

		const edges = map(filteredData, element => this._createEdge(element));
		return edges.filter(isPresent);
	}

	_filterData(data: GraphDataElement[]): GraphDataElement[] {
		const { filterEmptyConnections: filterData } = this.controller.getSettings();

		if (filterData) {
			return filter(data, dataElement => {
				return defaultTo(dataElement.data.rate_in, 0) > 0
					|| defaultTo(dataElement.data.rate_out, 0) > 0
					|| defaultTo(dataElement.data.error_rate_in, -1) >= 0
					|| defaultTo(dataElement.data.error_rate_out, -1) >= 0
					|| defaultTo(dataElement.data.threshold, 0) > 0;

			});
		} else {
			return data;
		}
	}

	generateGraph(graphData: GraphDataElement[]): IGraph {
		const filteredData = this._filterData(graphData);

		const nodes = this._createNodes(filteredData);
		const edges = this._createEdges(filteredData);

		console.groupCollapsed('Graph generated');
		console.log('Input data:', graphData);
		console.log('Filtered data:', filteredData);
		console.log('Nodes:', nodes);
		console.log('Edges:', edges);
		console.groupEnd();

		const graph: IGraph = {
			nodes,
			edges
		};

		return graph;
	}
}

export default GraphGenerator;