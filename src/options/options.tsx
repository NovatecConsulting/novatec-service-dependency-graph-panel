import { PanelOptionsEditorBuilder } from '@grafana/data';
import { PanelSettings } from '../types';
import { TypeaheadTextField } from './TypeAheadTextfield/TypeaheadTextfield';
import { ServiceIconMapping } from './serviceIconMapping/ServiceIconMapping';
import { ExternalIconMapping } from './externalIconMapping/ExternalIconMapping';
import { DummyDataSwitch } from './dummyDataSwitch/DummyDataSwitch';
import { DefaultSettings } from './DefaultSettings';

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
        defaultValue: DefaultSettings.dataMapping.sourceComponentPrefix,
      })

      .addCustomEditor({
        path: 'dataMapping.targetComponentPrefix',
        id: 'targetComponentPrefix',
        name: 'Target Component Column Prefix',
        category: ['Connection Mapping'],
        editor: TypeaheadTextField,
        defaultValue: DefaultSettings.dataMapping.targetComponentPrefix,
      })

      .addCustomEditor({
        path: 'dataMapping.type',
        id: 'type',
        name: 'Type',
        category: ['Connection Mapping'],
        editor: TypeaheadTextField,
        defaultValue: DefaultSettings.dataMapping.type,
      })

      .addCustomEditor({
        path: 'dataMapping.extOrigin',
        id: 'externalOrigin',
        name: 'External Origin',
        category: ['Connection Mapping'],
        editor: TypeaheadTextField,
        defaultValue: DefaultSettings.dataMapping.extOrigin,
      })

      .addCustomEditor({
        path: 'dataMapping.extTarget',
        id: 'externalTarget',
        name: 'External Target',
        category: ['Connection Mapping'],
        editor: TypeaheadTextField,
        defaultValue: DefaultSettings.dataMapping.extTarget,
      })

      //Data Mapping
      .addCustomEditor({
        id: 'responseTime',
        path: 'dataMapping.responseTimeColumn',
        name: 'Response Time Column',
        editor: TypeaheadTextField,
        category: ['Data Mapping'],
        defaultValue: DefaultSettings.dataMapping.responseTimeColumn,
      })

      .addCustomEditor({
        id: 'requestRateColumn',
        path: 'dataMapping.requestRateColumn',
        name: 'Request Rate Column',
        editor: TypeaheadTextField,
        category: ['Data Mapping'],
        defaultValue: DefaultSettings.dataMapping.requestRateColumn,
      })

      .addCustomEditor({
        id: 'errorRateColumn',
        path: 'dataMapping.errorRateColumn',
        name: 'Error Rate Column',
        editor: TypeaheadTextField,
        category: ['Data Mapping'],
        defaultValue: DefaultSettings.dataMapping.errorRateColumn,
      })

      .addCustomEditor({
        id: 'responseTimeOutgoingColumn',
        path: 'dataMapping.responseTimeOutgoingColumn',
        name: 'Response Time Column (Outgoing)',
        editor: TypeaheadTextField,
        category: ['Data Mapping'],
        defaultValue: DefaultSettings.dataMapping.responseTimeOutgoingColumn,
      })

      .addCustomEditor({
        id: 'requestRateOutgoingColumn',
        path: 'dataMapping.requestRateOutgoingColumn',
        name: 'Request Rate Column (Outgoing)',
        editor: TypeaheadTextField,
        category: ['Data Mapping'],
        defaultValue: DefaultSettings.dataMapping.requestRateOutgoingColumn,
      })

      .addCustomEditor({
        id: 'errorRateOutgoingColumn',
        path: 'dataMapping.errorRateOutgoingColumn',
        name: 'Error Rate Column (Outgoing)',
        editor: TypeaheadTextField,
        category: ['Data Mapping'],
        defaultValue: DefaultSettings.dataMapping.errorRateOutgoingColumn,
      })

      .addCustomEditor({
        id: 'baselineRtUpper',
        path: 'dataMapping.baselineRtUpper',
        name: 'Response Time Baseline (Upper)',
        editor: TypeaheadTextField,
        category: ['Data Mapping'],
        defaultValue: DefaultSettings.dataMapping.baselineRtUpper,
      })

      //General Settings
      .addBooleanSwitch({
        path: 'showConnectionStats',
        name: 'Show Connection Statistics',
        category: ['General Settings'],
        defaultValue: DefaultSettings.showConnectionStats,
      })

      .addBooleanSwitch({
        path: 'sumTimings',
        name: 'Handle Timings as Sums',
        description:
          'If this setting is active, the timings provided' +
          'by the mapped response time columns are considered as a ' +
          'continually increasing sum of response times. When ' +
          'deactivated, it is considered that the timings provided ' +
          'by columns are the actual average response times.',
        category: ['General Settings'],
        defaultValue: DefaultSettings.sumTimings,
      })

      .addBooleanSwitch({
        path: 'filterEmptyConnections',
        name: 'Filter Empty Data',
        description:
          'If this setting is active, the timings provided by ' +
          'the mapped response time columns are considered as a continually ' +
          'increasing sum of response times. When deactivated, it is considered ' +
          'that the timings provided by columns are the actual average response times.',
        category: ['General Settings'],
        defaultValue: DefaultSettings.filterEmptyConnections,
      })

      .addBooleanSwitch({
        path: 'showDebugInformation',
        name: 'Show Debug Information',
        category: ['General Settings'],
        defaultValue: DefaultSettings.showDebugInformation,
      })

      .addCustomEditor({
        path: 'dataMapping',
        id: 'dummyDataSwitch',
        name: 'Show Dummy Data',
        editor: DummyDataSwitch,
        category: ['General Settings'],
        defaultValue: DefaultSettings.dataMapping,
      })

      .addBooleanSwitch({
        path: 'showBaselines',
        name: 'Show Baselines',
        category: ['General Settings'],
        defaultValue: DefaultSettings.showBaselines,
      })

      .addSelect({
        path: 'timeFormat',
        name: 'Maximum Time Unit to Resolve',
        description: 
          'This setting controls to which time unit time values will be resolved to. ' +
          'Each value always includes the smaller units.',
        category: ['General Settings'],
        settings: {
          options: [{value: 'ms', label: 'ms' }, {value: 's', label: 's' }, {value: 'm', label: 'm' }],
        },
        defaultValue:  DefaultSettings.timeFormat
      },
      )

      //Appearance
      .addColorPicker({
        path: 'style.healthyColor',
        name: 'Healthy Color',
        category: ['Appearance'],
        defaultValue: DefaultSettings.style.healthyColor,
      })

      .addColorPicker({
        path: 'style.dangerColor',
        name: 'Danger Color',
        category: ['Appearance'],
        defaultValue: DefaultSettings.style.dangerColor,
      })

      .addColorPicker({
        path: 'style.unknownColor',
        name: 'No Data Color',
        category: ['Appearance'],
        defaultValue: DefaultSettings.style.unknownColor,
      })

      //Service Icon Mapping
      .addCustomEditor({
        path: 'serviceIcons',
        id: 'serviceIconMapping',
        editor: ServiceIconMapping,
        name: '',
        category: ['Service Icon Mapping'],
        defaultValue: DefaultSettings.serviceIcons,
      })

      // External Service Icon Mapping
      .addCustomEditor({
        path: 'externalIcons',
        id: 'externalIconMapping',
        editor: ExternalIconMapping,
        name: '',
        category: ['External Icon Mapping'],
        defaultValue: DefaultSettings.externalIcons,
      })

      //Tracing Drilldown
      .addTextInput({
        path: 'drillDownLink',
        name: 'Backend URL',
        category: ['Tracing Drilldown'],
        defaultValue: DefaultSettings.drillDownLink,
      })
  );
};
