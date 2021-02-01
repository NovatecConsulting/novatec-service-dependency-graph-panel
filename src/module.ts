import { PanelPlugin } from '@grafana/data';
import { PanelSettings } from './types';

import { PanelController } from './panel/PanelController';
import { optionsBuilder } from './options/options';

export const plugin = new PanelPlugin<PanelSettings>(PanelController).setPanelOptions(optionsBuilder);
