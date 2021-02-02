import { PanelPlugin } from '@grafana/data';
import { PanelSettings } from './types';

import { PanelController } from './panel/PanelController';
import { optionsBuilder } from './options/options';
import { PanelMigrationHandler } from './migration/PanelMigration';

export const plugin = new PanelPlugin<PanelSettings>(PanelController)
  .setPanelOptions(optionsBuilder)
  .setMigrationHandler(PanelMigrationHandler);
