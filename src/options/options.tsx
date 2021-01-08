import { PanelOptionsEditorBuilder } from '@grafana/data';
import { PanelSettings } from '../types';
import { TypeaheadTextField } from './TypeAheadTextfield/TypeaheadTextfield';
import { ServiceIconMapping } from './serviceIconMapping/ServiceIconMapping';
import { ExternalIconMapping } from './externalIconMapping/ExternalIconMapping';
import { DummyDataSwitch } from './dummyDataSwitch/DummyDataSwitch';
import { GenericDataSwitch } from './genericDataSwitch/GenericDataSwitch';

export const optionsBuilder = (builder: PanelOptionsEditorBuilder<PanelSettings>) => {
  return (
    builder

      //Connection Mapping
      .addCustomEditor({
        path: 'dataMapping.sourceComponentPrefix',
        id: 'sourceComponentPrefix',
        editor: TypeaheadTextField,
        name: 'Source Component Column Prefix',
        category: ['Connection Mapping'],
      })

      .addCustomEditor({
        path: 'dataMapping.targetComponentPrefix',
        id: 'targetComponentPrefix',
        name: 'Target Component Column Prefix',
        category: ['Connection Mapping'],
        editor: TypeaheadTextField,
      })

      .addCustomEditor({
        path: 'dataMapping.type',
        id: 'type',
        name: 'Type',
        category: ['Connection Mapping'],
        editor: TypeaheadTextField,
      })

      .addCustomEditor({
        path: 'dataMapping.extOrigin',
        id: 'externalOrigin',
        name: 'External Origin',
        category: ['Connection Mapping'],
        editor: TypeaheadTextField,
      })

      .addCustomEditor({
        path: 'dataMapping.extTarget',
        id: 'externalTarget',
        name: 'External Target',
        category: ['Connection Mapping'],
        editor: TypeaheadTextField,
      })

      //Data Mapping
      .addCustomEditor({
        id: 'responseTime',
        path: 'dataMapping.responseTimeColumn',
        name: 'Response Time Column',
        editor: TypeaheadTextField,
        category: ['Data Mapping'],
      })

      .addCustomEditor({
        id: 'requestRateColumn',
        path: 'dataMapping.requestRateColumn',
        name: 'Request Rate Column',
        editor: TypeaheadTextField,
        category: ['Data Mapping'],
      })

      .addCustomEditor({
        id: 'errorRateColumn',
        path: 'dataMapping.errorRateColumn',
        name: 'Error Rate Column',
        editor: TypeaheadTextField,
        category: ['Data Mapping'],
      })

      .addCustomEditor({
        id: 'responseTimeOutgoingColumn',
        path: 'dataMapping.responseTimeOutgoingColumn',
        name: 'Response Time Column (Outgoing)',
        editor: TypeaheadTextField,
        category: ['Data Mapping'],
      })

      .addCustomEditor({
        id: 'requestRateOutgoingColumn',
        path: 'dataMapping.requestRateOutgoingColumn',
        name: 'Request Rate Column (Outgoing)',
        editor: TypeaheadTextField,
        category: ['Data Mapping'],
      })

      .addCustomEditor({
        id: 'errorRateOutgoingColumn',
        path: 'dataMapping.errorRateOutgoingColumn',
        name: 'Error Rate Column (Outgoing)',
        editor: TypeaheadTextField,
        category: ['Data Mapping'],
      })

      .addCustomEditor({
        id: 'baselineRtUpper',
        path: 'dataMapping.baselineRtUpper',
        name: 'Response Time Baseline (Upper)',
        editor: TypeaheadTextField,
        category: ['Data Mapping'],
      })

      //General Settings
      .addCustomEditor({
        id: 'connectionStats',
        path: 'showConnectionStats',
        name: 'Show Connection Statistics',
        editor: GenericDataSwitch,
        category: ['General Settings'],
        defaultValue: {value: false}
      })

      .addCustomEditor({
        id: 'sumTimings',
        path: 'sumTimings',
        name: 'Handle Timings as Sums',
        editor: GenericDataSwitch,
        description:
          'If this setting is active, the timings provided' +
          'by the mapped response time columns are considered as a ' +
          'continually increasing sum of response times. When ' +
          'deactivated, it is considered that the timings provided ' +
          'by columns are the actual average response times.',
        category: ['General Settings'],
        defaultValue: {value: false}
      })

      .addCustomEditor({
        id: 'filterEmptyConnections',
        path: 'filterEmptyConnections',
        name: 'Filter Empty Data',
        editor: GenericDataSwitch,
        description:
          'If this setting is active, the timings provided by ' +
          'the mapped response time columns are considered as a continually ' +
          'increasing sum of response times. When deactivated, it is considered ' +
          'that the timings provided by columns are the actual average response times.',
        category: ['General Settings'],
        defaultValue: {value: false}
      })

      .addCustomEditor({
        id: 'showDebugInformation',
        path: 'showDebugInformation',
        name: 'Show Debug Information',
        editor: GenericDataSwitch,
        category: ['General Settings'],
        defaultValue: {value: false}
      })

      .addCustomEditor({
        path: 'dataMapping',
        id: 'dummyDataSwitch',
        name: 'Show Dummy Data',
        editor: DummyDataSwitch,
        category: ['General Settings'],
        defaultValue: {
          sourceComponentPrefix: 'origin_',
          targetComponentPrefix: 'target_',
          responseTimeColumn: 'in_timesum',
          requestRateColumn: 'in_count',
          errorRateColumn: 'error_in',
          responseTimeOutgoingColumn: 'out_timesum',
          requestRateOutgoingColumn: 'out_count',
          errorRateOutgoingColumn: 'error_out',
          extOrigin: '',
          extTarget: '',
          type: '',
          showDummyData: true,
          baselineRtUpper: 'threshold',
        }
      })

      .addCustomEditor({
        id: 'showBaselines',
        path: 'showBaselines',
        name: 'Show Baselines',
        editor: GenericDataSwitch,
        category: ['General Settings'],
        defaultValue: {value: false}
      })

      //Appearance
      .addColorPicker({
        path: 'style.healthyColor',
        name: 'Healthy Color',
        category: ['Appearance'],
        defaultValue: 'rgb(87, 148, 242)',
      })

      .addColorPicker({
        path: 'style.dangerColor',
        name: 'Danger Color',
        category: ['Appearance'],
        defaultValue: '#C4162A',
      })

      .addColorPicker({
        path: 'style.noDataColor',
        name: 'No Data Color',
        category: ['Appearance'],
        defaultValue: 'rgb(123, 123, 138)',
      })

      //Service Icon Mapping
      .addCustomEditor({
        path: 'serviceIcons',
        id: 'serviceIconMapping',
        editor: ServiceIconMapping,
        name: '',
        category: ['Service Icon Mapping'],
      })

      // External Service Icon Mapping
      .addCustomEditor({
        path: 'externalIcons',
        id: 'externalIconMapping',
        editor: ExternalIconMapping,
        name: '',
        category: ['External Icon Mapping'],
      })

      //Tracing Drilldown
      .addTextInput({
        path: 'drillDownLink',
        name: 'Backend URL',
        category: ['Tracing Drilldown'],
      })
  );
};
