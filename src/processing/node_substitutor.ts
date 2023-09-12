import _ from 'lodash';
import { IntGraphNode } from '../types';

class NodeSubstitutor {
  private _substitutionMap: any;

  constructor() {
    this._substitutionMap = new Map();
  }

  add(node: IntGraphNode) {
    const nameSpace = node.data.namespace;
    if (nameSpace && nameSpace.length > 0) {
      let currentValue = nameSpace;
      let currentKey = node.data.label;
      this._substitutionMap.set(currentKey, currentValue);
    }
  }

  substituteUntilLayer(nodeName: string, layer: number, maxLayer: number) {
    if (!this._substitutionMap.has(nodeName)) {
      return nodeName;
    }
    const nameSpace = this._substitutionMap.get(nodeName);
    const nsLeng = nameSpace.length;
    if (nsLeng - 1 < layer) {
      return nodeName;
    }

    return nameSpace[layer];
  }
}

export default NodeSubstitutor;
