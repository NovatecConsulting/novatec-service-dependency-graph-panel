import _ from 'lodash';
import { DataMapping } from '../../types';
import { ServiceDependencyGraph } from 'panel/serviceDependencyGraph/ServiceDependencyGraph';

export function isPresent<T>(t: T | undefined | null | void): t is T {
  return t !== undefined && t !== null;
}

export default {
  getConfig: function (graph: ServiceDependencyGraph, configName: keyof DataMapping) {
    return graph.getSettings(true).dataMapping[configName];
  },
};
