import { PanelSettings } from '../types';

export const DefaultSettings: PanelSettings = {
  animate: true,

  dataMapping: {
    sourceComponentPrefix: 'origin_',
    targetComponentPrefix: 'target_',

    responseTimeColumn: 'response-time',
    requestRateColumn: 'request-rate',
    errorRateColumn: 'error-rate',
    responseTimeOutgoingColumn: 'response-time-out',
    requestRateOutgoingColumn: 'request-rate-out',
    errorRateOutgoingColumn: 'error-rate-out',

    extOrigin: 'external_origin',
    extTarget: 'external_target',
    type: 'type',

    baselineRtUpper: 'threshold',

    showDummyData: false,
  },

  sumTimings: true,
  filterEmptyConnections: true,
  showDebugInformation: false,
  showConnectionStats: true,
  showBaselines: false,

  style: {
    healthyColor: 'rgb(87, 148, 242)',
    dangerColor: 'rgb(196, 22, 42)',
    noDataColor: 'rgb(123, 123, 138)',
  },

  serviceIcons: [
    {
      pattern: 'java',
      filename: 'java',
    },
    {
      pattern: 'spok|star trek',
      filename: 'star_trek',
    },
  ],

  externalIcons: [
    {
      pattern: 'web',
      filename: 'web',
    },
    {
      pattern: 'jms',
      filename: 'message',
    },
    {
      pattern: 'jdbc',
      filename: 'database',
    },
    {
      pattern: 'http',
      filename: 'http',
    },
  ],

  drillDownLink: '',
  timeFormat: 'm',
};
