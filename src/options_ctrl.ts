import _ from 'lodash';

export class OptionsCtrl {
	panel: any;
	panelCtrl: any;
	colorModes: any;

	/** @ngInject */
	constructor($scope) {
		$scope.editor = this;

		this.panelCtrl = $scope.ctrl;
		this.panel = this.panelCtrl.panel;

		this.render = this.render.bind(this);
		this.getColumnNames = this.getColumnNames.bind(this);
		this.getPrefixCandidates = this.getPrefixCandidates.bind(this);
		this.getColumnNamesExternal = this.getColumnNamesExternal.bind(this);
	}

	getLayoutOptions() {
		return ['ltrTree', 'ring', 'ringCenter', 'cytoscape'];
	}

	getColumnNames() {
		if (this.panelCtrl.currentData) {
			return _.sortBy(this.panelCtrl.currentData.columns);
		}
		return [];
	}

	getColumnNamesExternal() {
		if (this.panelCtrl.currentData) {
			return _.sortBy(this.panelCtrl.currentData.external.columns);
		}
		return [];
	}

	getPrefixCandidates() {
		var aggregationType = (_.find(this.panelCtrl.dashboard.templating.list, {
			name: 'aggregationType'
		}) as any).current.value;

		if (this.panelCtrl.currentData) {
			return _(this.panelCtrl.currentData.columns)
				.filter(element => element.includes(aggregationType))
				.map(element => element.slice(0, -aggregationType.length))
				.value();
		}
		return [];
	}

	render() {
		this.panelCtrl.render();
	}
}

/** @ngInject */
export function optionsTab($q, uiSegmentSrv) {
	'use strict';
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'public/plugins/novatec-flowmap-panel/partials/options.html',
		controller: OptionsCtrl,
	};
}
