import { PanelPlugin } from '@grafana/data';
import { PanelSettings } from './types';
import { ServiceDependencyGraphPanel } from './ServiceDependencyGraphPanel';
//import { TypeaheadTextField } from './options/TypeaheadTextfield';
import { ServiceIconMapping } from 'options/serviceIconMapping/ServiceIconMapping';
import { ExternalIconMapping } from 'options/externalIconMapping/ExternalIconMapping';

export const plugin = new PanelPlugin<PanelSettings>(ServiceDependencyGraphPanel).setPanelOptions(
  
  builder => {
  return builder
    //Connection Mapping
    /*.addCustomEditor({
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
      })*/
          
    //General Settings
    .addBooleanSwitch({
      path: 'showConnectionStats',
      description: "This is a field you can use!",
      name: 'Show Connection Statistics',
      category: ['General Settings'],
    })
    .addBooleanSwitch({
      path: 'sumTimings',
      name: 'Handle Timings as Sums',
      category: ['General Settings'],
    })
    .addBooleanSwitch({
      path: 'filterEmptyConnections',
      name: 'Filter Empty Data',
      category: ['General Settings'],
    })
    .addBooleanSwitch({
      path: 'showDebugInformation',
      name: 'Show Debug Information',
      category: ['General Settings'],
    })
    .addBooleanSwitch({
      path: 'showDummyData',
      name: 'Show Dummy Data',
      category: ['General Settings'],
    })
    .addBooleanSwitch({
      path: 'showBaselines',
      name: 'Show Baselines',
      category: ['General Settings'],
    })

    //Appearance
    .addColorPicker({
      path: 'style.healthyColor',
      name: 'Healthy Color',
      category: ['Appearance'],
      defaultValue: "rgb(87, 148, 242)"
    })
    .addColorPicker({
      path: 'style.dangerColor',
      name: 'Danger Color',
      category: ['Appearance'],
      defaultValue: "#C4162A"
    })
    .addColorPicker({
      path: 'style.noDataColor',
      name: 'No Data Color',
      category: ['Appearance'],
      defaultValue: "rgb(123, 123, 138)"
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
    
});
