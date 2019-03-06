import _ from 'lodash';

export default {

	getTemplateVariable: function(controller, variableName) {
		var templateVariable: any = _.find(controller.dashboard.templating.list, {
			name: variableName
		});
		return templateVariable.current.value;
	},

	getConfig: function(controller, configName) {
		return controller.panel.dataMapping[configName];
	},

	getSourcePrefix: function(controller) {
		return this.getConfig(controller, 'sourceComponentPrefix');
	},

	getTargetPrefix: function(controller) {
		return this.getConfig(controller, 'targetComponentPrefix');
	},

	getTemplateVariableValues: function(controller, variableName) {
		var templateVariable: any = _.find(controller.dashboard.templating.list, {
			name: variableName
		});
		var options: any = templateVariable.model.options;
		return _.map(options, o => o.value);
	}

};
