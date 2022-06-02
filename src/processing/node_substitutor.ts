import _ from 'lodash';
import { IntGraphNode } from '../types';



class NodeSubstitutor {
    private _substitutionMap: any;

    constructor() {
        this._substitutionMap = {};
    }

    add(node: IntGraphNode) {
        const nameSpace = node.data.namespace
        if(nameSpace && nameSpace.length > 0 ) {
            var currentValue = nameSpace.pop();
            var currentKey = node.data.label;
            this._substitutionMap[currentKey]  = currentValue;
            while (nameSpace.length > 0) {
                currentKey = currentValue;
                currentValue = nameSpace.pop();
                this._substitutionMap[currentKey]  = currentValue;
            } 
        }
    }

    substituteUntilLayer(nodeName: string, layer: number, maxLayer: number) {
        var currentSubstitution = nodeName;
        for (let i = maxLayer; i > layer; i--) {
            currentSubstitution = this._substitutionMap[currentSubstitution];
        }
        return currentSubstitution;
    }

}

export default NodeSubstitutor;