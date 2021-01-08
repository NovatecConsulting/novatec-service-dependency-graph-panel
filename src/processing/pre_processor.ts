import _, { map, has, groupBy, values, reduce, merge, forOwn, keys, concat } from 'lodash';
import { ServiceDependencyGraphPanelController } from '../panel/ServiceDependencyGraphPanelController';
import { QueryResponse, GraphDataElement, GraphDataType, CurrentData } from '../types';

class PreProcessor {
  controller: ServiceDependencyGraphPanelController;

  constructor(controller: ServiceDependencyGraphPanelController) {
    this.controller = controller;
  }

  _transformTables(tables: any[]) {
    var transformedTable: any[] = [];
    for (var index = 0; index < tables.length; index++) {
      var currentField = tables[index];

      for (var j = 0; j < currentField.values.buffer.length; j++) {
        if (transformedTable[j] === undefined) {
          transformedTable[j] = {};
        }
        transformedTable[j][currentField.name] = currentField.values.buffer[j];
      }
    }

    return transformedTable;
  }

  _transformObjects(data: any[]): GraphDataElement[] {
    const dataMapping = this.controller.getSettings().dataMapping;

    const sourceComponentPrefix = dataMapping.sourceComponentPrefix;
    const targetComponentPrefix = dataMapping.targetComponentPrefix;
    const externalSource = dataMapping.extOrigin;
    const externalTarget = dataMapping.extTarget;
    const aggregationSuffix: string = this.controller.getAggregationType();

    const sourceColumn = sourceComponentPrefix + aggregationSuffix;
    const targetColumn = targetComponentPrefix + aggregationSuffix;

    const result = map(data, dataObject => {
      let source = has(dataObject, sourceColumn) && dataObject[sourceColumn] !== '';
      let target = has(dataObject, targetColumn) && dataObject[targetColumn] !== '';
      const extSource = has(dataObject, externalSource) && dataObject[externalSource] !== '';
      const extTarget = has(dataObject, externalTarget) && dataObject[externalTarget] !== '';

      let trueCount = [source, target, extSource, extTarget].filter(e => e).length;

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

    const filteredResult: GraphDataElement[] = result.filter(
      (element): element is GraphDataElement => element !== null
    );
    return filteredResult;
  }

  _mergeGraphData(data: GraphDataElement[]): GraphDataElement[] {
    const groupedData = values(groupBy(data, element => element.source + '<--->' + element.target));

    const mergedData = map(groupedData, group => {
      return reduce(group, (result, next) => {
        return merge(result, next);
      });
    });

    return mergedData;
  }

  _cleanMetaData(columnMapping: any, metaData: any) {
    const result: any = {};

    forOwn(columnMapping, (value, key) => {
      if (has(metaData, value)) {
        result[key] = metaData[value];
      }
    });

    return result;
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
            mergedField.values = concat(field.values, mergedField.values);
          }
        }
      }
    }
    return mergedSeries;
  }

  _dataToRows(inputDataSets: any) {
    var rows: any[] = [];

    const aggregationSuffix: string = this.controller.getAggregationType();
    const {
      sourceComponentPrefix,
      targetComponentPrefix,
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
    } = this.controller.getSettings().dataMapping;

    const sourceColumn = sourceComponentPrefix + aggregationSuffix;
    const targetColumn = targetComponentPrefix + aggregationSuffix;

    for (const inputData of inputDataSets) {
      const externalSourceField = inputData.fields.find((field: { name: any }) => field.name === extOrigin);
      const externalTargetField = inputData.fields.find((field: { name: any }) => field.name === extTarget);
      const aggregationSuffixField = inputData.fields.find((field: { name: any }) => field.name === aggregationSuffix);
      const typeField = inputData.fields.find((field: { name: any }) => field.name === type);

      const sourceColumnField = inputData.fields.find((field: { name: any }) => field.name === sourceColumn);
      const targetColumnField = inputData.fields.find((field: { name: any }) => field.name === targetColumn);

      const errorRateColumnField = inputData.fields.find((field: { name: any }) => field.name === errorRateColumn);
      const errorRateOutgoingColumnField = inputData.fields.find(
        (field: { name: any }) => field.name === errorRateOutgoingColumn
      );
      const responseTimeColumnField = inputData.fields.find(
        (field: { name: any }) => field.name === responseTimeColumn
      );
      const responseTimeOutgoingColumnField = inputData.fields.find(
        (field: { name: any }) => field.name === responseTimeOutgoingColumn
      );
      const requestRateColumnField = inputData.fields.find((field: { name: any }) => field.name === requestRateColumn);
      const requestRateOutgoingColumnField = inputData.fields.find(
        (field: { name: any }) => field.name === requestRateOutgoingColumn
      );
      const responseTimeBaselineField = inputData.fields.find((field: { name: any }) => field.name === baselineRtUpper);

      for (let i = 0; i < inputData.length; i++) {
        const row: any = {};
        row[extOrigin] = externalSourceField?.values.get(i);
        row[extTarget] = externalTargetField?.values.get(i);
        row[aggregationSuffix] = aggregationSuffixField?.values.get(i);
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
        Object.keys(row).forEach(key => (row[key] === undefined || row[key] === '') && delete row[key]);
        rows.push(row);
      }
    }
    return rows;
  }

  _resolveData(row: any) {
    let source = has(row, 'sourceColumn') && row['sourceColumn'] !== '';
    let target = has(row, 'targetColumn') && row['targetColumn'] !== '';
    const extSource = has(row, 'extOrigin') && row['extOrigin'] !== '';
    const extTarget = has(row, 'extTarget') && row['extTarget'] !== '';
    let trueCount = [source, target, extSource, extTarget].filter(e => e).length;

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

  processData(inputData: QueryResponse[]): CurrentData {
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
