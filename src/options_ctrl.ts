import _, { sortBy } from 'lodash';
import { ServiceDependencyGraphCtrl } from './service_dependency_graph_ctrl';

export class OptionsCtrl {
	panel: any;
	controller: ServiceDependencyGraphCtrl;
	colorModes: any;

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
	}

	addExternalMapping() {
		this.panel.settings.externalIcons.push({ type: 'my-type', icon: 'default' });
		this.controller.render();
	}

	removeExternalMapping(index) {
		this.panel.settings.externalIcons.splice(index, 1);
		this.controller.render();
	}

	getExternalIconOptions() {
		return ['default', 'message', 'database', 'http', 'web', 'balancer', 'ldap', 'mainframe', 'smtp', 'ftp'];
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
