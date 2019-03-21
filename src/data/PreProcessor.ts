import _ from 'lodash';
import Utils from '../util/Utils';

class PreProcessor {

	controller: any;

	constructor(controller) {
		this.controller = controller;
	}

	processData(inputData) {
		// check for table types

		var connectionTables = _.filter(inputData, table => {
			var aggregationType: string = Utils.getTemplateVariable(this.controller, 'aggregationType');
			var sourcePrefix: string = Utils.getSourcePrefix(this.controller);
			var targetPrefix: string = Utils.getTargetPrefix(this.controller);

			var hasSource = Boolean(_.find(table.columns, { text: sourcePrefix + aggregationType }));
			var hasTarget = Boolean(_.find(table.columns, { text: targetPrefix + aggregationType }));

			return hasSource || hasTarget;
		});

		var processedData = _(connectionTables)
			.filter(table => table.type && table.type === 'table')
			.flatMap(table => _.map(table.rows, row => this.dataArrayToDataObject(table, row)))
			.filter(o => o.source || o.target)
			.groupBy(o => o.source + '===' + o.target)
			.values()
			.map(grp => {
				return _.reduce(grp, (result, next) => {
					return _.merge(result, next);
				}, {});
			})
			.filter(o => _.has(o, 'data.rate') || _.has(o, 'data.rate_out'))
			.value();

		var columns = _(connectionTables)
			.filter(table => table.type === 'table')
			.flatMap(table => table.columns)
			.flatMap(column => column.text)
			.uniq()
			.value();

		// var componentMapping = this.createComponentMapping(inputData);

		return {
			data: processedData,
			rawData: inputData,
			columns: columns,
			// componentMapping: componentMapping
		};
	}

	createComponentMapping(rawData) {
		var aggregationTypeValues = _.map(Utils.getTemplateVariableValues(this.controller, 'aggregationType'), val => { return { text: val } });
		var mappingTable = _.filter(rawData, { columns: aggregationTypeValues });

		return _(mappingTable)
			.flatMap((table: any) => {
				var appIdx = this.getColumnIndex(table, 'app');
				var serviceIdx = this.getColumnIndex(table, 'service');
				var instanceIdx = this.getColumnIndex(table, 'node');

				return _.map(table.rows, row => {
					return {
						//TODO rename this and use some sort of configuration for the mapping
						app: row[appIdx],
						service: row[serviceIdx],
						node: row[instanceIdx]
					}
				});
			})
			.uniqWith(_.isEqual)
			.value();
	}

	getColumnIndex(table, columnName) {
		return _.findIndex(table.columns, {
			text: columnName
		});
	}

	dataArrayToDataObject(table, row) {
		var rowObject: any = {};
		_.forOwn(row, (value, key) => {
			var attrName = this.getColumnKey(table, key);
			if (attrName == null) {
				return;
			}

			if (attrName === 'source' || attrName === 'target') {
				rowObject[attrName] = value;
			} else if (value && value !== '') {
				if (!_.has(rowObject, 'data')) {
					rowObject.data = {};
				}
				rowObject.data[attrName] = value;
			}
		});

		// handle external calls
		if (_.has(rowObject, 'data.ext_origin') && rowObject.data.ext_origin.length > 0) {
			rowObject.source = rowObject.data.ext_origin;
			rowObject.data['external'] = 'source';
			delete rowObject.data.ext_origin;
		} else if (_.has(rowObject, 'data.ext_target') && rowObject.data.ext_target.length > 0) {
			rowObject.target = rowObject.data.ext_target;
			rowObject.data['external'] = 'target';
			delete rowObject.data.ext_target;
		}

		return rowObject;
	}

	getColumnKey(table, index) {
		var aggregationType: string = Utils.getTemplateVariable(this.controller, 'aggregationType');
		var sourcePrefix: string = Utils.getSourcePrefix(this.controller);
		var targetPrefix: string = Utils.getTargetPrefix(this.controller);

		var nameLookup = {};
		nameLookup[Utils.getConfig(this.controller, 'responseTimeColumn')] = 'res_time_sum';
		nameLookup[Utils.getConfig(this.controller, 'requestRateColumn')] = 'rate';
		nameLookup[Utils.getConfig(this.controller, 'errorRateColumn')] = 'err_rate';
		nameLookup[Utils.getConfig(this.controller, 'responseTimeOutgoingColumn')] = 'res_time_sum_out';
		nameLookup[Utils.getConfig(this.controller, 'requestRateOutgoingColumn')] = 'rate_out';
		nameLookup[Utils.getConfig(this.controller, 'errorRateOutgoingColumn')] = 'err_rate_out';

		nameLookup[Utils.getConfig(this.controller, 'requestRateExternalColumn')] = 'rate_ext';
		nameLookup[Utils.getConfig(this.controller, 'responseTimeExternalColumn')] = 'res_time_sum_ext';
		nameLookup[Utils.getConfig(this.controller, 'extOrigin')] = 'ext_origin';
		nameLookup[Utils.getConfig(this.controller, 'extTarget')] = 'ext_target';
		nameLookup[Utils.getConfig(this.controller, 'type')] = 'type';

		var name = table.columns[index].text;

		if (name === sourcePrefix + aggregationType) {
			return 'source';
		} else if (name === targetPrefix + aggregationType) {
			return 'target';
		} else if (name === aggregationType) {
		
			if (_.find(table.columns, {text: "origin_service"})) {
				// incoming
				return 'target';
			} else {
				// outgoing
				return 'source';
			}

		} else if (_.has(nameLookup, name)) {
			return nameLookup[name];
		} else {
			return null;
		}
	}

};

export default PreProcessor;
