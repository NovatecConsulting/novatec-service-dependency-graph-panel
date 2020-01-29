import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import _, { find, map, isUndefined, remove, each, has } from 'lodash';
import { optionsTab } from './options_ctrl';
import './css/novatec-service-dependency-graph-panel.css';
import PreProcessor from './processing/pre_processor'

import GraphGenerator from './processing/graph_generator'

import GraphCanvas from './canvas/graph_canvas';
import cytoscape, { NodeSingular, EdgeSingular } from 'cytoscape';
import cola from 'cytoscape-cola';
import cyCanvas from 'cytoscape-canvas';

import layoutOptions from './layout_options';
import { DataMapping, IGraph, IGraphNode, IGraphEdge, CyData, PanelSettings, CurrentData, QueryResponse } from './types';

// Register cytoscape extensions
cyCanvas(cytoscape);
cytoscape.use(cola);

export class ServiceDependencyGraphCtrl extends MetricsPanelCtrl {

	static templateUrl = 'partials/module.html';

	panelDefaults = {
		settings: <PanelSettings>{
			animate: true,
			sumTimings: false,
			showConnectionStats: true,
			filterEmptyConnections: true,
			externalIcons: [
				{
					name: 'web',
					filename: 'web'
				},
				{
					name: 'jms',
					filename: 'message'
				},
				{
					name: 'jdbc',
					filename: 'database'
				},
				{
					name: 'http',
					filename: 'http'
				}
			],
			style: {
				healthyColor: 'rgb(87, 148, 242)',
				dangerColor: 'rgb(184, 36, 36)'
			},
			showDebugInformation: false,
			dataMapping: {
				sourceComponentPrefix: "origin_",
				targetComponentPrefix: "target_",

				responseTimeColumn: "response-time",
				requestRateColumn: "request-rate",
				errorRateColumn: "error-rate",
				responseTimeOutgoingColumn: "response-time-out",
				requestRateOutgoingColumn: "request-rate-out",
				errorRateOutgoingColumn: "error-rate-out",

				extOrigin: 'external_origin',
				extTarget: 'external_target',
				type: 'type'
			}
		}
	};

	currentData: CurrentData | undefined;

	cy: cytoscape.Core;

	graphCanvas: GraphCanvas;

	initResize: boolean = true;

	preProcessor: PreProcessor = new PreProcessor(this);

	graphGenerator: GraphGenerator = new GraphGenerator(this);

	graphContainer: any;

	validQueryTypes: boolean;

	/** @ngInject */
	constructor($scope, $injector) {
		super($scope, $injector);

		_.defaultsDeep(this.panel, this.panelDefaults);

		this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
		this.events.on('component-did-mount', this.onMount.bind(this));
		this.events.on('refresh', this.onRefresh.bind(this));
		this.events.on('render', this.onRender.bind(this));
		this.events.on('data-received', this.onDataReceived.bind(this));
		this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
	}

	link(scope, element, attrs, controller) {
		console.log("Linking container DOM element.");

		this.graphContainer = element.find('.sdg-container')[0];
	}

	onRefresh() {
		console.log("refresh");
	}

	onInitEditMode() {
		this.addEditorTab('Options', optionsTab, 2);
	}

	onPanelTeardown() {
	}

	toggleAnimation() {
		this.panel.settings.animate = !this.panel.settings.animate;

		if (this.panel.settings.animate) {
			this.graphCanvas.startAnimation();
		} else {
			this.graphCanvas.stopAnimation();
		}
	}

	zoom(zoom) {
		const zoomStep = 0.25 * zoom;
		const zoomLevel = Math.max(0.1, this.cy.zoom() + zoomStep);
		this.cy.zoom(zoomLevel);
	}

	isDataAvailable() {
		const dataExist = !isUndefined(this.currentData) && this.currentData.graph.length > 0;
		return dataExist;
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

	_updateGraph(graph: IGraph) {
		const cyNodes = this._transformNodes(graph.nodes);
		const cyEdges = this._transformEdges(graph.edges);

		console.groupCollapsed("Updating graph");
		console.log("cytoscape nodes: ", JSON.parse(JSON.stringify(cyNodes)));
		console.log("cytoscape edges: ", JSON.parse(JSON.stringify(cyEdges)));
		console.groupEnd();

		const nodes = this.cy.nodes().toArray();
		const updatedNodes = <NodeSingular[]>this._updateOrRemove(nodes, cyNodes);

		// add new nodes
		(<any>this.cy).add(cyNodes);

		const edges = this.cy.edges().toArray();
		this._updateOrRemove(edges, cyEdges);

		// add new edges
		(<any>this.cy).add(cyEdges);

		if (this.initResize) {
			this.initResize = false;
			this.cy.resize();
			this.cy.reset();
			this.runLayout();
		} else {
			if (cyNodes.length > 0) {
				each(updatedNodes, node => {
					node.lock();
				});
				this.runLayout(true);
			}
		}
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

	_initCytoscape() {
		const that = this;

		console.log("Initialize cytoscape..");

		this.cy = cytoscape({
			container: this.graphContainer,
			style: <any>[
				{
					"selector": "node",
					"style": {
						"background-opacity": 0
					}
				},
				{
					"selector": "edge",
					"style": {
						"visibility": "hidden"
					}
				}
			],
			wheelSensitivity: 0.125
		});

		// create canvas layer
		const layer = (<any>this.cy).cyCanvas({
			zIndex: 1
		});

		this.graphCanvas = new GraphCanvas(this, this.cy, layer);
		this.graphCanvas.start();
		if (this.panel.settings.animate) {
			this.graphCanvas.startAnimation();
		}

		this.cy.reset();
		this.cy.resize();
		this.cy.center();

		this.cy.on('render', (event) => {
			// trigger also repainting of the graph canvas overlay
			that.graphCanvas.repaint(true);
		});
	}

	onMount() {
		console.log("mount");
		this.render();
	}

	onRender(payload) {
		console.log("render");

		if (!this.cy) {
			this._initCytoscape();
		}

		if (this.isDataAvailable()) {
			const graph: IGraph = this.graphGenerator.generateGraph((<CurrentData>this.currentData).graph);
			this._updateGraph(graph);
		}
	}

	runLayout(unlockNodes: boolean = false) {
		const that = this;

		const options = {
			...layoutOptions,
			stop: function () {
				if (unlockNodes) {
					that.unlockNodes();
				}
			}
		};

		this.cy.layout(options).run()
	}

	unlockNodes() {
		this.cy.nodes().forEach(node => {
			node.unlock();
		});
	}

	fit() {
		const selection = this.graphCanvas.selectionNeighborhood;
		if (selection && !selection.empty()) {
			this.cy.fit(selection, 30);
		} else {
			this.cy.fit();
		}
	}

	hasAggregationVariable() {
		const templateVariable: any = _.find(this.dashboard.templating.list, {
			name: 'aggregationType'
		});

		return !!templateVariable;
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

	onDataReceived(receivedData: QueryResponse[]) {
		this.validQueryTypes = this.hasOnlyTableQueries(receivedData);

		if (this.hasAggregationVariable() && this.validQueryTypes) {
			const graphData = this.preProcessor.processData(receivedData);

			console.groupCollapsed('Processed received data');
			console.log('raw data: ', receivedData);
			console.log('graph data: ', graphData);
			console.groupEnd();

			this.currentData = graphData;
		} else {
			this.currentData = undefined;
		}
		this.render();
	}

	getTemplateVariable(name) {
		let variable: any = find(this.dashboard.templating.list, {
			name: name
		});
		return variable.current.value;
	}

	getAssetUrl(assetName: string) {
		var baseUrl = 'public/plugins/' + this.panel.type;
		return baseUrl + '/assets/' + assetName;
	}

	getTypeSymbol(type) {
		if (!type) {
			return this.getAssetUrl('default.png');
		}

		const { externalIcons } = this.getSettings();

		const icon = find(externalIcons, icon => icon.name.toLowerCase() === type.toLowerCase());

		if (icon !== undefined) {
			return this.getAssetUrl(icon.filename + '.png');
		} else {
			return this.getAssetUrl('default.png');
		}
	}

	getDataMapping(): DataMapping {
		return this.getSettings().dataMapping;
	}

	getSettings(): PanelSettings {
		return this.panel.settings;
	}
}
