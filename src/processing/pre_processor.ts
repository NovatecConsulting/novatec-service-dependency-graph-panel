import _, { map, flattenDeep, has, groupBy, values, reduce, merge, forOwn, keys, filter, concat } from 'lodash';
import Utils from './util/Utils';
import { ServiceDependencyGraphPanelController } from '../panel/ServiceDependencyGraphPanelController';
import { QueryResponse, GraphDataElement, GraphDataType, CurrentData } from '../types';
import { toDataFrame } from '@grafana/data';

class PreProcessor {

	controller: ServiceDependencyGraphPanelController;

	constructor(controller: ServiceDependencyGraphPanelController) {
		this.controller = controller;
	}

	_transformTables(tables: any[]) {
		var transformedTable: any[] = [];
		console.log(tables)
		for (var index = 0; index < tables.length; index++) {
			
			var currentField = tables[index]
			// TODO APPLY out_duration_avg
			if(currentField.name !== "out_duration_avg") {
				for (var j = 0; j < currentField.values.buffer.length; j++) {
					if(transformedTable[j] === undefined) {
						transformedTable[j] = {}
					}
					transformedTable[j][currentField.name] = currentField.values.buffer[j]
				}
			}

		}
		
		return transformedTable;
	}

	_transformObjects(data: any[]): GraphDataElement[] {
		const dataMapping = this.controller.getSettings().dataMapping;
		console.log(data)
		//TODO make block below nice!
		const sourceComponentPrefix = dataMapping.sourceComponentPrefix
		const targetComponentPrefix = dataMapping.targetComponentPrefix
		const externalSource = dataMapping.extOrigin
		const externalTarget = dataMapping.extTarget
		const aggregationSuffix: string = this.controller.getAggregationType();

		const sourceColumn = sourceComponentPrefix + aggregationSuffix;
		const targetColumn = targetComponentPrefix + aggregationSuffix;

		const result = map(data, dataObject => {
			let source = has(dataObject, sourceColumn) && dataObject[sourceColumn] !== "";
			let target = has(dataObject, targetColumn) && dataObject[targetColumn] !== "";
			const extSource = has(dataObject, externalSource) && dataObject[externalSource] !== "";
			const extTarget = has(dataObject, externalTarget) && dataObject[externalTarget] !== "";
			console.log(data)
			let trueCount = [source, target, extSource, extTarget].filter(e => e).length;
			console.log(trueCount)
			if (trueCount > 1) {
				if (target && extTarget) {
					target = false;
				} else if (source && extSource) {
					source = false;
				} else {
					console.error("source-target conflict for data element", dataObject);
					return;
				}
			}

			const result: GraphDataElement = {
				target: "",
				data: dataObject,
				type: GraphDataType.INTERNAL
			};

			if (trueCount == 0) {
				result.target = dataObject[aggregationSuffix];
				result.type = GraphDataType.EXTERNAL_IN;
			} else {
				if (source || target) {
					if (source) {
						result.source = dataObject[sourceColumn];
						result.target = dataObject[aggregationSuffix];
					} else {
						result.source = dataObject[aggregationSuffix];
						result.target = dataObject[targetColumn];
					}

					if (result.source === result.target) {
						result.type = GraphDataType.SELF;
					}
				} else if (extSource) {
					result.source = dataObject[externalSource];
					result.target = dataObject[aggregationSuffix];
					result.type = GraphDataType.EXTERNAL_IN;
				} else if (extTarget) {
					result.source = dataObject[aggregationSuffix];
					result.target = dataObject[externalTarget];
					result.type = GraphDataType.EXTERNAL_OUT;
				}
			}
			return result;
		});

		const filteredResult: GraphDataElement[] = result.filter((element): element is GraphDataElement => element !== null);
		return filteredResult;
	}

	_mergeGraphData(data: GraphDataElement[]): GraphDataElement[] {
		const groupedData = values(groupBy(data, element => element.source + '<--->' + element.target));

		const mergedData = map(groupedData, group => {
			return reduce(group, (result, next) => {
				return merge(result, next);
			}, <GraphDataElement>{});
		});

		return mergedData;
	}

	_cleanMetaData(columnMapping: any, metaData: any) {
		const result = {};

		forOwn(columnMapping, (value, key) => {
			if (has(metaData, value)) {
				result[key] = metaData[value];
			}
		});

		return result;
	}

	_cleanData(data: GraphDataElement[]): GraphDataElement[] {
		const columnMapping = {};
		columnMapping['response_time_in'] = Utils.getConfig(this.controller, 'responseTimeColumn');
		columnMapping['rate_in'] = Utils.getConfig(this.controller, 'requestRateColumn');
		columnMapping['error_rate_in'] = Utils.getConfig(this.controller, 'errorRateColumn');
		columnMapping['response_time_out'] = Utils.getConfig(this.controller, 'responseTimeOutgoingColumn');
		columnMapping['rate_out'] = Utils.getConfig(this.controller, 'requestRateOutgoingColumn');
		columnMapping['error_rate_out'] = Utils.getConfig(this.controller, 'errorRateOutgoingColumn');
		columnMapping['type'] = Utils.getConfig(this.controller, 'type');
		columnMapping["threshold"] = Utils.getConfig(this.controller, 'baselineRtUpper');

		console.log(columnMapping)
		const cleanedData = map(data, dataElement => {
			const cleanedMetaData = this._cleanMetaData(columnMapping, dataElement.data);

			const result = {
				...dataElement,
				data: cleanedMetaData
			};

			return result;
		});
		console.log(cleanedData)
		return filter(cleanedData, dataElement => dataElement.target !== "" && dataElement.source !== "");;
	}

	_extractColumnNames(data: GraphDataElement[]): string[] {
		const columnNames: string[] = _(data)
			.flatMap(dataElement => keys(dataElement.data))
			.uniq()
			.sort()
			.value();

		return columnNames;
	}

	_getField(fieldName: string, fields: any[]) {
		for(const field of fields) {
			if(field.name === fieldName) {
				return field
			}
		}
		return undefined
	}

	_mergeSeries(series: any[]) {
		var mergedSeries: any = undefined
		for(const seriesElement of series) {
			if(mergedSeries === undefined) {
				mergedSeries = seriesElement
			} else {
				for(const field of seriesElement.fields) {
					const mergedField = this._getField(field.name, mergedSeries.fields)
					if(mergedField === undefined) {
						mergedSeries.fields.push(field)
					} else {
						mergedField.values = concat(field.values, mergedField.values)
					}
				}
			}
		}
		console.log(mergedSeries)
		return mergedSeries
	}

	_flattenValues(inputData: any) {
		for(const data of inputData) {
			for(const field of data.fields) {
				var flattenValues: any[] = []
				for(const valueArray of field.values) {
					flattenValues = concat(flattenValues, valueArray);
				}
				field.values = flattenValues;
			}
		}
		return inputData
	}

	processData(inputData: QueryResponse[]): CurrentData {
		console.log(inputData)
		console.log(toDataFrame(inputData))
		//const flatDataFrame = this._flattenValues(inputData)


		const mergedSeries = this._mergeSeries(inputData);
		console.log(mergedSeries)
		const objectTables = this._transformTables(mergedSeries);

		const flattenData = flattenDeep(objectTables);

		const graphElements = this._transformObjects(flattenData);

		const mergedData = this._mergeGraphData(graphElements);

		const columnNames = this._extractColumnNames(mergedData);

		const cleanData = this._cleanData(mergedData);

		console.groupCollapsed('Data transformation log');
		console.log('Transform tables:', objectTables);
		console.log('Flat data:', flattenData);
		console.log('Graph elements:', graphElements);
		console.log('Merged graph data:', mergedData);
		console.log('Cleaned data:', cleanData);
		console.log('Table columns:', columnNames);
		console.groupEnd();

		return {
			graph: cleanData,
			raw: inputData,
			columnNames: columnNames
		};
	}
};

export default PreProcessor;