import _ from 'lodash';
import { ServiceDependencyGraph } from 'panel/serviceDependencyGraph/ServiceDependencyGraph';

export function isPresent<T>(t: T | undefined | null | void): t is T {
  return t !== undefined && t !== null;
}

export default {
  getConfig: function(graph: ServiceDependencyGraph, configName: string) {
    return graph.getSettings().dataMapping[configName];
  },
};
