import { DataFrame } from '@grafana/data';
import _ from 'lodash';
import { PanelController } from '../panel/PanelController';
import { GraphDataElement, GraphDataType, CurrentData } from '../types';

class PreProcessor {
  controller: PanelController;

  constructor(controller: PanelController) {
    this.controller = controller;
  }

  _transformObjects(data: any[]): GraphDataElement[] {
    const {
      aggregationType,
      sourceColumn,
      targetColumn,
      extOrigin: externalSource,
      extTarget: externalTarget,
    } = this.controller.getSettings(true).dataMapping;

    const result = _.map(data, (dataObject) => {
      var source = _.has(dataObject, sourceColumn) && dataObject[sourceColumn] !== '';
      var target = _.has(dataObject, targetColumn) && dataObject[targetColumn] !== '';
      const extSource = _.has(dataObject, externalSource) && dataObject[externalSource] !== '';
      const extTarget = _.has(dataObject, externalTarget) && dataObject[externalTarget] !== '';

      let trueCount = [source, target, extSource, extTarget].filter((e) => e).length;

      if (trueCount > 1) {
        if (target && extTarget) {
          target = false;
        } else if (source && extSource) {
          source = false;
        } else {
          console.error('source-target conflict for data element', dataObject);
          return undefined;
        }
      }

      const result: GraphDataElement = {
        target: '',
        data: dataObject,
        type: GraphDataType.INTERNAL,
      };

      if (trueCount === 0) {
        result.target = dataObject[aggregationType];
        result.type = GraphDataType.EXTERNAL_IN;
      } else {
        if (source || target) {
          if (source) {
            result.source = dataObject[sourceColumn];
            result.target = dataObject[aggregationType];
          } else {
            result.source = dataObject[aggregationType];
            result.target = dataObject[targetColumn];
          }

          if (result.source === result.target) {
            result.type = GraphDataType.SELF;
          }
        } else if (extSource) {
          result.source = dataObject[externalSource];
          result.target = dataObject[aggregationType];
          result.type = GraphDataType.EXTERNAL_IN;
        } else if (extTarget) {
          result.source = dataObject[aggregationType];
          result.target = dataObject[externalTarget];
          result.type = GraphDataType.EXTERNAL_OUT;
        }
      }
      return result;
    });

    const filteredResult: GraphDataElement[] = result.filter(
      (element): element is GraphDataElement => element !== null
    );
    return filteredResult;
  }

  _mergeGraphData(data: GraphDataElement[]): GraphDataElement[] {
    const groupedData = _.values(_.groupBy(data, (element) => element.source + '<--->' + element.target));

    const mergedData = _.map(groupedData, (group) => {
      return _.reduce(group, (result, next) => {
        return _.merge(result, next);
      });
    });

    return mergedData;
  }

  _cleanMetaData(columnMapping: any, metaData: any) {
    const result: any = {};

    _.forOwn(columnMapping, (value, key) => {
      if (_.has(metaData, value)) {
        result[key] = metaData[value];
      }
    });

    return result;
  }

  _extractColumnNames(data: GraphDataElement[]): string[] {
    const columnNames: string[] = _(data)
      .flatMap((dataElement) => _.keys(dataElement.data))
      .uniq()
      .sort()
      .value();

    return columnNames;
  }

  _getField(fieldName: string, fields: any[]) {
    for (const field of fields) {
      if (field.name === fieldName) {
        return field;
      }
    }
    return undefined;
  }

  _mergeSeries(series: any[]) {
    var mergedSeries: any = undefined;
    for (const seriesElement of series) {
      if (mergedSeries === undefined) {
        mergedSeries = seriesElement;
      } else {
        for (const field of seriesElement.fields) {
          const mergedField = this._getField(field.name, mergedSeries.fields);
          if (mergedField === undefined) {
            mergedSeries.fields.push(field);
          } else {
            mergedField.values = _.concat(field.values, mergedField.values);
          }
        }
      }
    }
    return mergedSeries;
  }

  _dataToRows(inputDataSets: any) {
    var rows: any[] = [];

    const {
      aggregationType,
      sourceColumn,
      targetColumn,
      extOrigin,
      extTarget,
      type,
      errorRateColumn,
      errorRateOutgoingColumn,
      responseTimeColumn,
      responseTimeOutgoingColumn,
      requestRateColumn,
      requestRateOutgoingColumn,
      baselineRtUpper,
    } = this.controller.getSettings(true).dataMapping;

    for (const inputData of inputDataSets) {
      const { fields } = inputData;
      const externalSourceField = _.find(fields, ['name', extOrigin]);
      const externalTargetField = _.find(fields, ['name', extTarget]);
      const aggregationSuffixField = _.find(fields, ['name', aggregationType]);

      const typeField = _.find(fields, ['name', type]);

      const sourceColumnField = _.find(fields, ['name', sourceColumn]);
      const targetColumnField = _.find(fields, ['name', targetColumn]);

      const errorRateColumnField = _.find(fields, ['name', errorRateColumn]);
      const errorRateOutgoingColumnField = _.find(fields, ['name', errorRateOutgoingColumn]);
      const responseTimeColumnField = _.find(fields, ['name', responseTimeColumn]);
      const responseTimeOutgoingColumnField = _.find(fields, ['name', responseTimeOutgoingColumn]);
      const requestRateColumnField = _.find(fields, ['name', requestRateColumn]);
      const requestRateOutgoingColumnField = _.find(fields, ['name', requestRateOutgoingColumn]);
      const responseTimeBaselineField = _.find(fields, ['name', baselineRtUpper]);

      for (let i = 0; i < inputData.length; i++) {
        const row: any = {};
        row[extOrigin] = externalSourceField?.values.get(i);
        row[extTarget] = externalTargetField?.values.get(i);
        row[aggregationType] = aggregationSuffixField?.values.get(i);
        row[sourceColumn] = sourceColumnField?.values.get(i);
        row[targetColumn] = targetColumnField?.values.get(i);
        row['error_rate_in'] = errorRateColumnField?.values.get(i);
        row['error_rate_out'] = errorRateOutgoingColumnField?.values.get(i);
        row['response_time_in'] = responseTimeColumnField?.values.get(i);
        row['response_time_out'] = responseTimeOutgoingColumnField?.values.get(i);
        row['rate_in'] = requestRateColumnField?.values.get(i);
        row['rate_out'] = requestRateOutgoingColumnField?.values.get(i);
        row['threshold'] = responseTimeBaselineField?.values.get(i);
        row['type'] = typeField?.values.get(i);
        // The above code returns { "": undefined } for values that do not exist.
        // These values are filtered by this line.
        Object.keys(row).forEach((key) => (row[key] === undefined || row[key] === '') && delete row[key]);
        rows.push(row);
      }
    }
    return rows;
  }

  _resolveData(row: any) {
    let source = _.has(row, 'sourceColumn') && row['sourceColumn'] !== '';
    let target = _.has(row, 'targetColumn') && row['targetColumn'] !== '';
    const extSource = _.has(row, 'extOrigin') && row['extOrigin'] !== '';
    const extTarget = _.has(row, 'extTarget') && row['extTarget'] !== '';
    let trueCount = [source, target, extSource, extTarget].filter((e) => e).length;

    if (trueCount > 1) {
      if (target && extTarget) {
        target = false;
      } else if (source && extSource) {
        source = false;
      } else {
        console.error('source-target conflict for data element', row);
        return;
      }
    }
    var resolvedObject: any = {
      data: row.data,
    };
    if (trueCount === 0) {
      resolvedObject.target = row['aggregationSuffix'];
      resolvedObject.type = GraphDataType.EXTERNAL_IN;
    } else {
      if (source || target) {
        if (source) {
          resolvedObject.source = row['sourceColumn'];
          resolvedObject.target = row['aggregationSuffix'];
          resolvedObject.type = GraphDataType.INTERNAL;
        } else {
          resolvedObject.source = row['aggregationSuffix'];
          resolvedObject.target = row['targetColumn'];
          resolvedObject.type = GraphDataType.INTERNAL;
        }

        if (resolvedObject.source === resolvedObject.target) {
          resolvedObject.type = GraphDataType.SELF;
        }
      } else if (extSource) {
        resolvedObject.source = row['externalSource'];
        resolvedObject.target = row['aggregationSuffix'];
        resolvedObject.type = GraphDataType.EXTERNAL_IN;
      } else if (extTarget) {
        resolvedObject.source = row['aggregationSuffix'];
        resolvedObject.target = row['externalTarget'];
        resolvedObject.type = GraphDataType.EXTERNAL_OUT;
      }
    }
    return resolvedObject;
  }

  _mergeObjects(rows: any[]) {
    var mergedObjects: any[] = [];

    for (const row of rows) {
      mergedObjects.push(row);
    }
    return mergedObjects;
  }

  processData(inputData: DataFrame[]): CurrentData {
    const rows = this._dataToRows(inputData);

    const flattenData = this._mergeObjects(rows);

    const graphElements = this._transformObjects(flattenData);

    const columnNames = this._extractColumnNames(graphElements);

    const mergedData = this._mergeGraphData(graphElements);

    return {
      graph: mergedData,
      raw: inputData,
      columnNames: columnNames,
    };
  }
}

export default PreProcessor;
