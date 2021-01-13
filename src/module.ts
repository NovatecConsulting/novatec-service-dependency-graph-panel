import { PanelPlugin } from '@grafana/data';
import { PanelSettings } from './types';

import { ServiceDependencyGraphPanelController } from './panel/ServiceDependencyGraphPanelController';
import { optionsBuilder } from './options/options';

export const plugin = new PanelPlugin<PanelSettings>(ServiceDependencyGraphPanelController).setPanelOptions(
  optionsBuilder
);
