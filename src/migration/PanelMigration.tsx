import { PanelModel } from '@grafana/data';
import { DefaultSettings } from 'options/DefaultSettings';
import { PanelSettings } from 'types';

/**
 * Checks if the given options are in the format of version < 4.0.0.
 * @param options The options object which should be checked.
 */
function isLegacyFormat(options: any) {
  return options && !('showDummyData' in options['dataMapping']);
}

/**
 * Migrates the legacy iconMapping format to the iconMapping format of version > 4.0.0.
 * @param iconMappings The iconMappings object to be migrated.
 */
function migrateIconMapping(iconMappings: any) {
  const migratedIconMapping = [];
  for (const iconMapping of iconMappings) {
    migratedIconMapping.push({
      pattern: iconMapping.name,
      filename: iconMapping.filename,
    });
  }
  return migratedIconMapping;
}

/**
 * Migrates the legacy panel settings from version < 4.0.0 to the new format introduced in version 4.0.0
 * The newly introduced variable aggregationType will be set to $aggregationTyoe in order to ensure functionality with
 * the legacy setup of the panel.
 * All other newly added options will be set to their respective default values.
 * @param panel The panel object which should be migrated.
 */
export const PanelMigrationHandler = (panel: PanelModel<Partial<PanelSettings>> | any) => {
  const { settings } = panel;
  if (isLegacyFormat(settings)) {
    return {
      animate: settings.animate,
      sumTimings: settings.sumTimings,
      filterEmptyConnections: settings.filterEmptyConnections,
      style: {
        healthyColor: settings.style.healthyColor,
        dangerColor: settings.style.dangerColor,
        noDataColor: settings.style.unknownColor,
      },
      showDebugInformation: settings.showDebugInformation,
      showConnectionStats: settings.showConnectionStats,
      externalIcons: migrateIconMapping(settings.externalIcons),
      icons: settings.serviceIcons,
      dataMapping: {
        aggregationType: '$aggregationType',
        sourceColumn: settings.dataMapping.sourceComponentPrefix + '$aggregationType',
        targetColumn: settings.dataMapping.targetComponentPrefix + '$aggregationType',

        responseTimeColumn: settings.dataMapping.responseTimeColumn,
        requestRateColumn: settings.dataMapping.requestRateColumn,
        errorRateColumn: settings.dataMapping.errorRateColumn,
        responseTimeOutgoingColumn: settings.dataMapping.responseTimeOutgoingColumn,
        requestRateOutgoingColumn: settings.dataMapping.requestRateOutgoingColumn,
        errorRateOutgoingColumn: settings.dataMapping.errorRateOutgoingColumn,

        extOrigin: settings.dataMapping.extOrigin,
        extTarget: settings.dataMapping.extTarget,
        type: settings.dataMapping.type,
        showDummyData: settings.showDummyData,

        baselineRtUpper: settings.dataMapping.baselineRtUpper,
      },
      drillDownLink: settings.drillDownLink,
      showBaselines: settings.showBaselines,
      timeFormat: DefaultSettings.timeFormat,
    };
  }
  return settings;
};
