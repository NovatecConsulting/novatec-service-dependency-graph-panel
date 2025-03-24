import _ from 'lodash';
import { EnGraphNodeType, IntGraphMetrics, IntGraphNode, NodeTreeElement } from '../types';

class NodeTree {
  private _root: NodeTreeElement;
  private _metricMap: any;

  constructor() {
    this._root = { id: 'root', children: [] };
    this._metricMap = {};
  }

  addNode(node: IntGraphNode) {
    if (node.data.id !== 'undefined') {
      this._addNode({ id: node.data.id, node: node, children: [] }, this._root, 0);
    }
  }

  getNodesFromLayer(layer: number) {
    let nodes = this._getNodesFromLayer(this._root, layer, 0);
    nodes.forEach((element) => {
      if (this._metricMap[element.data.id]) {
        (Object.keys(element.data.metrics) as Array<keyof typeof element.data.metrics>).forEach(
          (key) => (element.data.metrics[key] = element.data.metrics[key] / this._metricMap[element.data.id][key])
        );
      }
    });
    return this._getNodesFromLayer(this._root, layer, 0);
  }

  getNamePath(namePath: string[]) {
    let currentLayer = this._root;
    namePath.forEach((element) => {
      currentLayer = this._getObjectFromArray(currentLayer.children, element);
    });
    return currentLayer;
  }

  private _getNodesFromLayer(currentNode: NodeTreeElement, layer: number, layerCounter: number): IntGraphNode[] {
    let children;
    if (layer === layerCounter) {
      children = currentNode.children.map((element) => element.node);
      if (currentNode !== this._root) {
        children.push(currentNode.node);
      }
      return children;
    }
    layerCounter++;
    children = _.flatten(currentNode.children.map((element) => this._getNodesFromLayer(element, layer, layerCounter)));
    if (currentNode !== this._root) {
      children.push(currentNode.node);
    }
    return children;
  }

  private _getNameSpaceFromCurrentLevel(namespace: string[], currentLevel: number) {
    let nameSpaces = [];
    for (let i = 0; i < currentLevel; i++) {
      nameSpaces.push(namespace[i]);
    }
    return nameSpaces;
  }

  private _sumMetrics(sourceNode: IntGraphNode, targetNode: IntGraphNode): IntGraphMetrics {
    const source = sourceNode.data.metrics;
    const target = targetNode.data.metrics;
    let metrics: IntGraphMetrics = {};
    if (!this._metricMap[targetNode.data.id]) {
      this._metricMap[targetNode.data.id] = {};
    }
    if (target.rate || source.rate) {
      metrics.rate = (target.rate ? target.rate : 0) + (source.rate ? source.rate : 0);
      if (target.rate && source.rate && !isNaN(target.rate) && !isNaN(source.rate)) {
        this._metricMap[targetNode.data.id].rate
          ? (this._metricMap[targetNode.data.id].rate = this._metricMap[targetNode.data.id].rate + 1)
          : (this._metricMap[targetNode.data.id].rate = 1);
      } else {
        if (!this._metricMap[targetNode.data.id].rate) {
          this._metricMap[targetNode.data.id].rate = 1;
        }
      }
    }

    if (target.response_time || source.response_time) {
      metrics.response_time =
        (target.response_time ? target.response_time : 0) + (source.response_time ? source.response_time : 0);
      if (
        target.response_time &&
        source.response_time &&
        !isNaN(target.response_time) &&
        !isNaN(source.response_time)
      ) {
        this._metricMap[targetNode.data.id].response_time
          ? (this._metricMap[targetNode.data.id].response_time = this._metricMap[targetNode.data.id].response_time + 1)
          : (this._metricMap[targetNode.data.id].response_time = 1);
      } else {
        if (!this._metricMap[targetNode.data.id].response_time) {
          this._metricMap[targetNode.data.id].response_time = 1;
        }
      }
    }

    if (target.success_rate || source.success_rate) {
      metrics.success_rate =
        (target.success_rate ? target.success_rate : 0) + (source.success_rate ? source.success_rate : 0);
      if (target.success_rate && source.success_rate && !isNaN(target.success_rate) && !isNaN(source.success_rate)) {
        this._metricMap[targetNode.data.id].success_rate
          ? (this._metricMap[targetNode.data.id].success_rate = this._metricMap[targetNode.data.id].success_rate + 1)
          : (this._metricMap[targetNode.data.id].success_rate = 1);
      } else {
        if (!this._metricMap[targetNode.data.id].success_rate) {
          this._metricMap[targetNode.data.id].success_rate = 1;
        }
      }
    }
    return metrics;
  }

  private _getObjectFromArray(array: NodeTreeElement[], id: string) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].node.data.label === id) {
        return array[i];
      }
    }
    return undefined;
  }

  private _addNode(nodeToAdd: NodeTreeElement, currentLayerNode: NodeTreeElement, currentLevel: number) {
    const namespace = nodeToAdd.node.data.namespace;
    const namespaceLength = namespace ? namespace.length : 0;
    if (namespaceLength === currentLevel) {
      const possibleDuplicate = _.find(currentLayerNode.children, function (o) {
        return o.id === nodeToAdd.id;
      });
      if (possibleDuplicate) {
        //Object.assign(possibleDuplicate.node.data.metrics, nodeToAdd.node.data.metrics);
        //TODO: Copy/merge metrics
      } else {
        currentLayerNode.children.push(nodeToAdd);
      }
    } else {
      const nextLayerNode = this._getObjectFromArray(
        currentLayerNode.children,
        nodeToAdd.node.data.namespace[currentLevel]
      );
      if (nextLayerNode === undefined) {
        const children: NodeTreeElement[] = [];
        const newNode = {
          id: nodeToAdd.node.data.namespace[currentLevel],
          children: children,
          node: {
            data: {
              id: nodeToAdd.node.data.namespace[currentLevel],
              type: EnGraphNodeType.PARENT,
              label: nodeToAdd.node.data.namespace[currentLevel],
              parent: nodeToAdd.node.data.namespace[currentLevel - 1],
              namespace: this._getNameSpaceFromCurrentLevel(nodeToAdd.node.data.namespace, currentLevel),
              layer: currentLevel,
              metrics: {},
            },
          },
        };
        currentLayerNode.children.push(newNode);
        currentLevel++;
        newNode.node.data.metrics = this._sumMetrics(nodeToAdd.node, newNode.node);
        this._addNode(nodeToAdd, newNode, currentLevel);
      } else {
        const nextTopLayerNode = this._getObjectFromArray(
          currentLayerNode.children,
          nodeToAdd.node.data.namespace[currentLevel]
        );
        nextTopLayerNode.node.data.type = EnGraphNodeType.PARENT;
        nextTopLayerNode.node.data.metrics = this._sumMetrics(nodeToAdd.node, nextTopLayerNode.node);
        currentLevel++;
        this._addNode(nodeToAdd, nextTopLayerNode, currentLevel);
      }
    }
  }
}

export default NodeTree;
