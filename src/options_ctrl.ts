import _, { sortBy } from 'lodash';
import { ServiceDependencyGraphCtrl } from './service_dependency_graph_ctrl';

export class OptionsCtrl {
	panel: any;
	controller: ServiceDependencyGraphCtrl;
	colorModes: any;

	serviceIcons: string[] = [];

	/** @ngInject */
	constructor($scope) {
		$scope.editor = this;

		this.controller = $scope.ctrl;
		this.panel = this.controller.panel;

		this.render = this.render.bind(this);
		this.getColumnNames = this.getColumnNames.bind(this);
		this.getPrefixCandidates = this.getPrefixCandidates.bind(this);
		this.addExternalMapping = this.addExternalMapping.bind(this);
		this.removeExternalMapping = this.removeExternalMapping.bind(this);

		fetch(this.controller.getAssetUrl('service_icons/icon_index.json'))
			.then(response => response.json())
			.then(data => {
				data.sort();
				this.serviceIcons = data;
			})
			.catch(() => {
				console.error('Could not load service icons mapping index. Please verify the "icon_index.json" in the plugin\'s asset directory.');
			});

	}

	addExternalMapping() {
		this.panel.settings.externalIcons.push({ name: 'my-type', filename: 'default' });
		this.controller.render();
	}

	removeExternalMapping(index) {
		this.panel.settings.externalIcons.splice(index, 1);
		this.controller.render();
	}

	getExternalIconOptions() {
		return ['default', 'message', 'database', 'http', 'web', 'balancer', 'ldap', 'mainframe', 'smtp', 'ftp'];
	}

	addServiceMapping() {
		this.panel.settings.serviceIcons.push({ pattern: 'my-type', filename: 'default' });
		this.controller.render();
	}

	removeServiceMapping(index) {
		this.panel.settings.serviceIcons.splice(index, 1);
		this.controller.render();
	}

	getServiceIconOptions() {
		return this.serviceIcons;
	}

	getColumnNames() {
		const { currentData } = this.controller;
		if (currentData) {
			return sortBy(currentData.columnNames);
		}
		return [];
	}

	getTraceBackend() {
		return [
			"http://localhost:9411/zipkin/?serviceName={}",
			"http://localhost:9411/zipkin/?serviceName={}&lookback=custom&startTs=[[__from]]&endTs=[[__to]]",
			"http://localhost:16686/search?service={}&end=[[__to]]&limit=20&lookback=custom&start=[[__from]]"
		];
	}

	getPrefixCandidates() {
		var aggregationType = (_.find(this.controller.dashboard.templating.list, {
			name: 'aggregationType'
		}) as any).current.value;

		const { currentData } = this.controller;

		if (currentData) {
			return _(currentData.columnNames)
				.filter(element => element.includes(aggregationType))
				.map(element => element.slice(0, -aggregationType.length))
				.value();
		}
		return [];
	}

	render() {
		this.controller.graphCanvas.resetAssets();
		this.controller.render();
	}
}

/** @ngInject */
export function optionsTab($q, uiSegmentSrv) {
	'use strict';
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'public/plugins/novatec-sdg-panel/partials/options.html',
		controller: OptionsCtrl,
	};
}
