import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import _ from 'lodash';
import { optionsTab } from './options_ctrl';
import './css/novatec-service-dependency-graph-panel.css';
import Vizceral from 'vizceral';
import PreProcessor from './data/PreProcessor';

import GraphGenerator from './graph/GraphGenerator'

export class ServiceDependencyGraphCtrl extends MetricsPanelCtrl {

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

			extOrigin: 'external_origin',
			extTarget: 'external_target',
			type: 'type'
		},
		sdgStyle: {
			healthyColor: 'rgb(87, 148, 242)',
			dangerColor: 'rgb(184, 36, 36)'
		},
		sdgSettings: {
			sumTimings: false,
			showConnectionStats: true,
			layout: 'ltrTree',
			maxVolume: 10000,
			filterEmptyConnections: true,
			externalIcons: [
				{
					type:'web',
					icon: 'web'
				},
				{
					type:'jms',
					icon: 'message'
				},
				{
					type:'database',
					icon: 'database'
				},
				{
					type:'http',
					icon: 'http'
				}
			]
		}
	};

	vizceral: any;

	currentData: any;

	currentGraphNodes: Array<string> = [];

	zoomLevel: number;

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

	zoom(zoom) {
		const zoomStep = 0.1 * zoom;
		const nextZoomLevel = Math.min(Math.max(this.zoomLevel + zoomStep, 0.1), 2);

		if (this.vizceral) {
			console.log("Current:", this.zoomLevel, "New:", nextZoomLevel);
			this.zoomLevel = nextZoomLevel;
			this.vizceral.setZoom(this.zoomLevel);
		}
	}

	dataAvailable() {
		return this.currentData != null && _.has(this.currentData, 'data') && this.currentData.data.length > 0;
	}

	updateSDGStyle() {
		if (this.vizceral) {
			this.vizceral.updateStyles({
				colorText: 'rgb(214, 214, 214)',
				colorTextDisabled: 'rgb(129, 129, 129)',
				colorTraffic: {
					healthy: this.panel.sdgStyle.healthyColor,
					normal: 'rgb(186, 213, 237)',
					normalDonut: 'rgb(91, 91, 91)',
					warning: 'rgb(268, 185, 73)',
					danger: this.panel.sdgStyle.dangerColor
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
			var sdgContainer = document.getElementById("nt-sdg-container");

			if (sdgContainer != null) {
				sdgContainer.innerHTML = '<canvas id="nt-sdg-viz"></canvas>';
			} else {
				console.warn("SDG container cannot be found!");
			}

			var vizContainer = <HTMLCanvasElement>document.getElementById("nt-sdg-viz");

			if (vizContainer != null) {

				// init variables for vizceral
				this.zoomLevel = 1;

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
						healthy: this.panel.sdgStyle.healthyColor,
						normal: 'rgb(186, 213, 237)',
						normalDonut: 'rgb(91, 91, 91)',
						warning: 'rgb(268, 185, 73)',
						danger: this.panel.sdgStyle.dangerColor
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
			const nodesAreEqual = _.isEqual(_.sortBy(nodeNames), _.sortBy(this.currentGraphNodes));

			if (!nodesAreEqual) {
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

		this.render();
	}

	getTemplateVariable(name) {
		let variable: any = _.find(this.dashboard.templating.list, {
			name: name
		});
		return variable.current.value;
	}
}
