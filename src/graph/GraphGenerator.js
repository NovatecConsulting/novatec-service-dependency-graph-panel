import _ from 'lodash';

class GraphGenerator {

	constructor(panelController, inputData) {
		this.data = inputData;
		this.panelCtrl = panelController;
	}

	generateGraph() {
		//TODO ensure that data has correct format => data processor
		var data = this.data;

		var nodes = this.getNodes();
		var connections = this.getConnections();

		var graph = {
			renderer: "region",
			name: "INTERNET",
			displayName: "INTERNET",
			nodes: nodes,
			layout: this.panelCtrl.panel.sdgSettings.layout,
			metadata: {},
			class: "normal",
			maxVolume: 10000,
			connections: connections,
			layoutOptions: {
				noRankPromotion: true,
				pullUpLeaves: true
			}
		};

		return graph;
	}

	getNodes() {
		var that = this;

		var nodes = _(this.data.data)
			.flatMap(d => [d.source, d.target])
			.uniq()
			.filter()
			.map(nodeName => {
				var requestCount = _.defaultTo(
					_(this.data.data)
					.filter(d => d.source !== d.target)
					.filter({
						'target': nodeName
					})
					.map(n => n.data.rate)
					.sum(), 0);

				var errorCount = _.defaultTo(
					_(this.data.data)
					.filter(d => d.source !== d.target)
					.filter({
						'target': nodeName
					})
					.filter(d => _.has(d.data, 'err_rate'))
					.map(n => n.data.err_rate)
					.sum(), -1);

				var responseTime = _.defaultTo(
					_(this.data.data)
					.filter(d => d.source !== d.target)
					.filter({
						'target': nodeName
					})
					.map(n => n.data.res_time_sum)
					.sum(), -1);

				if (responseTime >= 0) {
					responseTime = responseTime / (requestCount + errorCount);
				}

				var healthyPct = 1.0 / (requestCount + errorCount) * requestCount;
				var errorPct = 1.0 / (requestCount + errorCount) * errorCount;

				var aggregationType = this.getTemplateVariable('aggregationType');
				var componentMapping = _.filter(this.data.componentMapping, c => c[aggregationType] == nodeName);

				// TODO cleanup
				var centerData = {};
				if (aggregationType == 'app') {
					centerData.value = _(componentMapping)
						.map(c => c.service)
						.uniq()
						.value()
						.length;
					centerData.text = 'Service' + (centerData.value > 1 ? 's' : '');
				}
				else if (aggregationType == 'service') {
					centerData.value = _(componentMapping)
						.map(c => c.node)
						.uniq()
						.value()
						.length;
					centerData.text = 'Instance' + (centerData.value > 1 ? 's' : '');
				}
				else {
					centerData = null
				}

				return {
					name: nodeName,
					metrics: {
						requestCount: requestCount,
						errorCount: errorCount,
						responseTime: responseTime
					},
					donutMetrics: {
						healthyPct: healthyPct,
						errorPct: errorPct
					},
					metadata: {
						componentMapping: componentMapping,
						aggregation: aggregationType,
						centerData: centerData
					},
					nodeView: 'focused'
				};
			})
			.value();

		var entryNodes = _(this.data.data)
			.filter(d => !d.source && d.target)
			.map(d => d.target)
			.uniq()
			.map(nodeName => {
				return {
					name: '__ENTRY__', // + nodeName,
					nodeView: 'symbol',
					symbol: this.getTypeSymbol('web'),
					hideName: true
				};
			})
			.value();

		var externalNodes = _(this.data.external.components)
			.map(c => c.target)
			.uniq()
			.map(target => {
				var sample = _.find(this.data.external.components, {
					target: target
				});

				var callCount = _(this.data.external.components)
					.filter({
						target: target
					})
					.map(o => o.data.rate_ext)
					.sum();

				var responseTimeSum = _(this.data.external.components)
					.filter({
						target: target
					})
					.map(o => o.data.res_time_sum_ext)
					.sum();

				var responseTime = responseTimeSum / callCount;

				return {
					name: target,
					metrics: {
						requestCount: callCount,
						responseTime: responseTime
					},
					metadata: {
						external_type: sample.data.type
					},
					nodeView: 'symbol',
					symbol: this.getTypeSymbol(sample.data.type)
				};
			})
			.value();

		return _.concat(nodes, entryNodes, externalNodes);
	}

	getConnections() {
		var that = this;
		// for now -  filter incomplete connections

		var connections = _(this.data.data)
			.filter(e => e.source && e.target)
			.filter(e => e.source !== e.target) // no self calls
			.map(obj => {
				var connectionTime;
				var errorRate;
				var requestRate;

				if (obj.data) {
					connectionTime = _.defaultTo((obj.data.res_time_sum_out / obj.data.rate_out) - (obj.data.res_time_sum / obj.data.rate), -1);

					errorRate = _.defaultTo(obj.data.err_rate_out, -1);
					requestRate = _.defaultTo(obj.data.rate, -1);
				}

				return {
					source: obj.source,
					target: obj.target,
					metrics: {
						normal: requestRate,
						danger: errorRate
					},
					metadata: {
						connectionTime: connectionTime
					},
					updated: Date.now()
				};
			})
			.value();

		var entryConnections = _(this.data.data)
			.filter(e => !e.source && e.target)
			.map(obj => {
				var requestRate;

				if (obj.data) {
					requestRate = _.defaultTo(obj.data.rate, 0);
				}

				return {
					source: '__ENTRY__', // + obj.target,
					target: obj.target,
					metrics: {
						normal: requestRate
					},
					updated: Date.now()
				};
			})
			.value();

		var externalConnections = _.map(this.data.external.components, obj => {
			return {
				source: obj.source,
				target: obj.target,
				metrics: {
					normal: obj.data.rate_ext
				},
				updated: Date.now()
			};
		});

		var allConnections = _.concat(connections, entryConnections, externalConnections);

		_.each(allConnections, c => {
			if (!_.has(c, 'metadata')) {
				c['metadata'] = {};
			}
			c.metadata['showStats'] = this.panelCtrl.panel.sdgSettings.showConnectionStats;
		});

		return allConnections;
	}

	getTypeSymbol(type) {
		if (type.toLowerCase() === 'database') {
			return this.getAssetUrl('database.png');
		}
		else if (type.toLowerCase() === 'jms') {
			return this.getAssetUrl('message.png');
		}
		else if (type.toLowerCase() === 'web') {
			return this.getAssetUrl('web.png');
		}
		else {
			return '';
		}
	}

	getAssetUrl(assetName) {
		var baseUrl = 'public/plugins/' + this.panelCtrl.panel.type;

		return baseUrl + '/assets/' + assetName;
	}

	getTemplateVariable(name) {
		return _.find(this.panelCtrl.dashboard.templating.list, {
			name: name
		}).current.value;
	}
}

export default GraphGenerator;