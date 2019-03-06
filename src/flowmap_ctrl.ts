import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import _ from 'lodash';
import { optionsTab } from './options_ctrl';
import './css/novatec-flowmap-panel.css';
import Vizceral from 'vizceral';
import PreProcessor from './data/PreProcessor';

import GraphGenerator from './graph/GraphGenerator'

export class FlowmapCtrl extends MetricsPanelCtrl {

	static templateUrl = 'partials/module.html';

	panelDefaults = {
		dataMapping: {
			sourceComponentPrefix: "origin_",
			targetComponentPrefix: "target_",
			responseTimeColumn: "response-time",
			requestRateColumn: "request-rate",
			errorRateColumn: "error-rate",
			responseTimeOutgoingColumn: "response-time-out",
			requestRateOutgoingColumn: "request-rate-out",
			errorRateOutgoingColumn: "error-rate-out",
			responseTimeExternalColumn: "response-time-external",
			requestRateExternalColumn: "request-rate-external",
		},
		flowmapStyle: {
			healthyColor: 'rgb(87, 148, 242)',
			dangerColor: 'rgb(184, 36, 36)'
		},
		flowmapSettings: {
			showConnectionStats: true,
			layout: 'ltrTree'
		}
	};

	vizceral: any;

	currentData: any;

	currentGraphNodes: Array<string> = [];

	currentLayout: string;

	/** @ngInject */
	constructor($scope, $injector) {
		super($scope, $injector);

		_.defaultsDeep(this.panel, this.panelDefaults);

		this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
		this.events.on('component-did-mount', this.onRender.bind(this));
		this.events.on('refresh', this.onRefresh.bind(this));
		this.events.on('render', this.onRender.bind(this));
		this.events.on('data-received', this.onDataReceived.bind(this));
		this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
	}

	dataAvailable() {
		return this.currentData != null && _.has(this.currentData, 'data') && this.currentData.data.length > 0;
	}

	updateFlowmapStyle() {
		if (this.vizceral) {
			this.vizceral.updateStyles({
				colorText: 'rgb(214, 214, 214)',
				colorTextDisabled: 'rgb(129, 129, 129)',
				colorTraffic: {
					healthy: this.panel.flowmapStyle.healthyColor,
					normal: 'rgb(186, 213, 237)',
					normalDonut: 'rgb(91, 91, 91)',
					warning: 'rgb(268, 185, 73)',
					danger: this.panel.flowmapStyle.dangerColor
				},
				colorNormalDimmed: 'rgb(101, 117, 128)',
				colorBackgroundDark: 'rgb(35, 35, 35)',
				colorLabelBorder: 'rgb(16, 17, 18)',
				colorLabelText: 'rgb(0, 0, 0)',
				colorDonutInternalColor: 'rgb(35, 35, 35)',
				colorDonutInternalColorHighlighted: 'rgb(255, 255, 255)',
				colorConnectionLine: 'rgb(255, 255, 255)',
				colorPageBackground: 'rgb(45, 45, 45)',
				colorPageBackgroundTransparent: 'rgba(45, 45, 45, 0)',
				colorBorderLines: 'rgb(137, 137, 137)',
				colorArcBackground: 'rgb(60, 60, 60)'
			});

			this.render();
		}
	}

	forceRender() {
		this.vizceral = null;
		this.render();
	}

	onObjectHighlighted(object) {
		//TODO handle event
	}

	onRender(payload) {
		if (!this.vizceral) {
			var flowmapContainer = document.getElementById("nt-flowmap-container");

			if (flowmapContainer != null) {
				flowmapContainer.innerHTML = '<canvas id="nt-flowmap-viz"></canvas>';
			} else {
				console.warn("Flowmap container cannot be found!");
			}

			var vizContainer = <HTMLCanvasElement>document.getElementById("nt-flowmap-viz");

			if (vizContainer != null) {

				var viz = new Vizceral(vizContainer);
				viz.setOptions({
					allowDraggingOfNodes: true,
					showLabels: true
				});

				// Add event handlers for the vizceral events
				viz.on('viewChanged', view => { });
				viz.on('objectHighlighted', object => this.onObjectHighlighted(object));
				viz.on('rendered', data => { });
				viz.on('nodeContextSizeChanged', dimensions => { });

				viz.updateStyles({
					colorText: 'rgb(214, 214, 214)',
					colorTextDisabled: 'rgb(129, 129, 129)',
					colorTraffic: {
						healthy: this.panel.flowmapStyle.healthyColor,
						normal: 'rgb(186, 213, 237)',
						normalDonut: 'rgb(91, 91, 91)',
						warning: 'rgb(268, 185, 73)',
						danger: this.panel.flowmapStyle.dangerColor
					},
					colorNormalDimmed: 'rgb(101, 117, 128)',
					colorBackgroundDark: 'rgb(35, 35, 35)',
					colorLabelBorder: 'rgb(16, 17, 18)',
					colorLabelText: 'rgb(0, 0, 0)',
					colorDonutInternalColor: 'rgb(35, 35, 35)',
					colorDonutInternalColorHighlighted: 'rgb(255, 255, 255)',
					colorConnectionLine: 'rgb(255, 255, 255)',
					colorPageBackground: 'rgb(45, 45, 45)',
					colorPageBackgroundTransparent: 'rgba(45, 45, 45, 0)',
					colorBorderLines: 'rgb(137, 137, 137)',
					colorArcBackground: 'rgb(60, 60, 60)'
				});

				viz.updateDefinitions({
					detailedNode: {
						volume: {
							default: {
								top: null,
								bottom: null,

								donut: {
									data: 'donutMetrics',
									indices: [
										{ key: 'errorPct', class: 'danger' },
										{ key: 'healthyPct', class: 'healthy' }
									]
								}

							},
						}
					}
				});

				viz.setView();
				viz.animate();

				this.vizceral = viz;
			}
		}

		if (this.dataAvailable()) {
			var generator = new GraphGenerator(this, this.currentData);
			var graph = generator.generateGraph();
			this.vizceral.updateData(graph);

			var nodeNames = _.map(graph.nodes, node => node.name);

			if (!_.isEqual(this.currentGraphNodes, nodeNames)) {
				this.currentGraphNodes = nodeNames;
				if (this.vizceral.currentGraph) {
					this.vizceral.currentGraph.layout.cache = [];
					this.vizceral.currentGraph._relayout();
				}
			}
		}
	}

	onRefresh() {
	}

	onInitEditMode() {
		this.addEditorTab('Options', optionsTab, 2);
	}

	onPanelTeardown() {
	}

	onDataReceived(receivedData) {
		var preProcessor = new PreProcessor(this);

		var processedData = preProcessor.processData(receivedData);

		if (processedData.data.length > 0) {
			this.currentData = processedData;
		} else {
			this.currentData = [];
		}

		var layout = this.getTemplateVariable('layout');
		if (this.currentLayout === layout) {
			this.render();
		} else {
			this.currentLayout = layout;
			this.forceRender();
		}
	}

	getTemplateVariable(name) {
		let variable: any = _.find(this.dashboard.templating.list, {
			name: name
		});
		return variable.current.value;
	}
}
