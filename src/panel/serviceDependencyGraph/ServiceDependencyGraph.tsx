import CanvasDrawer from 'panel/canvas/graph_canvas';
import cytoscape, { EdgeCollection, EdgeSingular, ElementDefinition, NodeSingular } from 'cytoscape';
import React, { PureComponent } from 'react';
import { PanelController } from '../PanelController';
import cyCanvas from 'cytoscape-canvas';
import cola from 'cytoscape-cola';
import layoutOptions from '../layout_options';
import { Statistics } from '../statistics/Statistics';
import _ from 'lodash';
import {
  TableContent,
  IntGraphMetrics,
  IntGraph,
  IntGraphNode,
  IntGraphEdge,
  PanelSettings,
  IntSelectionStatistics,
} from 'types';
import { TemplateSrv, getTemplateSrv } from '@grafana/runtime';
import './ServiceDependencyGraph.css';

interface PanelState {
  zoom: number | undefined;
  animate: boolean | undefined;
  controller: PanelController;
  cy?: cytoscape.Core | undefined;
  graphCanvas?: CanvasDrawer | undefined;
  animateButtonClass?: string;
  showStatistics: boolean;
  data: IntGraph;
  settings: PanelSettings;
  layer: number | undefined;
  maxLayer: number;
  layerIncreaseFunction: any;
  layerDecreaseFunction: any;
}

cyCanvas(cytoscape);
cytoscape.use(cola);

export class ServiceDependencyGraph extends PureComponent<PanelState, PanelState> {
  ref: any;

  selectionId: string;

  currentType: string;

  selectionStatistics: IntSelectionStatistics;

  receiving: TableContent[];

  sending: TableContent[];

  resolvedDrillDownLink: string;

  templateSrv: TemplateSrv;

  initResize = true;

  constructor(props: PanelState) {
    super(props);

    let animateButtonClass = 'fa fa-play-circle';
    if (props.animate) {
      animateButtonClass = 'fa fa-pause-circle';
    }

    this.state = {
      ...props,
      showStatistics: false,
      animateButtonClass: animateButtonClass,
      animate: false,
    };

    this.ref = React.createRef();
    this.templateSrv = getTemplateSrv();
  }

  componentDidMount() {
    const cy: any = cytoscape({
      container: this.ref,
      zoom: this.state.zoom,
      elements: this.props.data,
      layout: {
        name: 'cola',
      },
      style: [
        {
          selector: 'node',
          css: {
            'background-color': '#fbfbfb',
            'background-opacity': 0,
          },
        },

        {
          selector: 'node:parent',
          css: {
            'background-opacity': 0.05,
            shape: 'barrel',
          },
        },

        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'control-point-step-size': 100,
            visibility: 'hidden',
          },
        },
      ],
      wheelSensitivity: 0.125,
    });

    let graphCanvas = new CanvasDrawer(
      this,
      cy,
      cy.cyCanvas({
        zIndex: 1,
      })
    );

    cy.on('render cyCanvas.resize', () => {
      graphCanvas.repaint(true);
    });
    cy.on('select', 'node', () => this.onSelectionChange());
    cy.on('unselect', 'node', () => this.onSelectionChange());
    this.setState({
      cy: cy,
      graphCanvas: graphCanvas,
    });
    graphCanvas.start();
  }

  componentDidUpdate() {
    this._updateGraph(this.props.data);
  }

  _updateGraph(graph: IntGraph) {
    const cyNodes = this._transformNodes(graph.nodes);
    const cyEdges = this._transformEdges(graph.edges);

    const nodes = this.state.cy.nodes().toArray();
    const updatedNodes = this._updateOrRemove(nodes, cyNodes);

    // add new nodes
    this.state.cy.add(cyNodes);

    const edges = this.state.cy.edges().toArray();
    this._updateOrRemove(edges, cyEdges);

    // add new edges
    this.state.cy.add(cyEdges);

    if (this.initResize) {
      this.initResize = false;
      this.state.cy.resize();
      this.state.cy.reset();
      this.runLayout();
    } else {
      if (cyNodes.length > 0) {
        _.each(updatedNodes, (node) => {
          node.lock();
        });
        this.runLayout(true);
      }
    }
    this.state.graphCanvas.repaint(true);
  }

  _transformNodes(nodes: IntGraphNode[]): ElementDefinition[] {
    const cyNodes: ElementDefinition[] = _.map(nodes, (node) => {
      const result: ElementDefinition = {
        group: 'nodes',
        data: {
          id: node.data.id,
          type: node.data.type,
          external_type: node.data.external_type,
          parent: node.data.parent,
          layer: node.data.layer,
          metrics: {
            ...node.data.metrics,
          },
        },
      };
      return result;
    });

    return cyNodes;
  }

  _transformEdges(edges: IntGraphEdge[]): ElementDefinition[] {
    const cyEdges: ElementDefinition[] = _.map(edges, (edge) => {
      const cyEdge: ElementDefinition = {
        group: 'edges',
        data: {
          id: edge.data.source + ':' + edge.data.target,
          source: edge.data.source,
          target: edge.data.target,
          metrics: {
            ...edge.data.metrics,
          },
        },
      };

      return cyEdge;
    });

    return cyEdges;
  }

  _updateOrRemove(dataArray: Array<NodeSingular | EdgeSingular>, inputArray: ElementDefinition[]) {
    const elements: any[] = []; //(NodeSingular | EdgeSingular)[]
    for (let i = 0; i < dataArray.length; i++) {
      const element = dataArray[i];

      const cyNode = _.find(inputArray, { data: { id: element.id() } });

      if (cyNode) {
        element.data(cyNode.data);
        _.remove(inputArray, (n) => n.data.id === cyNode.data.id);
        elements.push(element);
      } else {
        element.remove();
      }
    }
    return elements;
  }

  onSelectionChange() {
    const selection = this.state.cy.$(':selected');

    if (selection.length === 1) {
      this.updateStatisticTable();
      this.setState({
        showStatistics: true,
      });
    } else {
      this.setState({
        showStatistics: false,
      });
    }
  }

  getSettings(resolveVariables: boolean): PanelSettings {
    return this.state.controller.getSettings(resolveVariables);
  }

  toggleAnimation() {
    let newValue = !this.state.animate;
    let animateButtonClass = 'fa fa-play-circle';
    if (newValue) {
      this.state.graphCanvas.startAnimation();
      animateButtonClass = 'fa fa-pause-circle';
    } else {
      this.state.graphCanvas.stopAnimation();
    }
    this.setState({
      animate: newValue,
      animateButtonClass: animateButtonClass,
    });
  }

  runLayout(unlockNodes = false) {
    const that = this;
    const options = {
      ...layoutOptions,

      stop: function () {
        if (unlockNodes) {
          that.unlockNodes();
        }
        that.setState({
          zoom: that.state.cy.zoom(),
        });
      },
    };

    this.state.cy.layout(options).run();
  }

  unlockNodes() {
    this.state.cy.nodes().forEach((node: { unlock: () => void }) => {
      node.unlock();
    });
  }

  fit() {
    const selection = this.state.graphCanvas.selectionNeighborhood;
    if (selection && !selection.empty()) {
      this.state.cy.fit(selection, 30);
    } else {
      this.state.cy.fit();
    }
    this.setState({
      zoom: this.state.cy.zoom(),
    });
  }

  zoom(zoom: number) {
    const zoomStep = 0.25 * zoom;
    const zoomLevel = Math.max(0.1, this.state.zoom + zoomStep);
    this.setState({
      zoom: zoomLevel,
    });
    this.state.cy.zoom(zoomLevel);
    this.state.cy.center();
  }

  updateStatisticTable() {
    const selection = this.state.cy.$(':selected');

    if (selection.length === 1) {
      const currentNode: NodeSingular = selection[0];
      this.selectionId = currentNode.id().toString();
      this.currentType = currentNode.data('type');
      const receiving: TableContent[] = [];
      const sending: TableContent[] = [];
      const edges: EdgeCollection = selection.connectedEdges();

      const metrics: IntGraphMetrics = selection.nodes()[0].data('metrics');

      const requestCount = _.defaultTo(metrics.rate, -1);
      const errorCount = _.defaultTo(metrics.error_rate, -1);
      const duration = _.defaultTo(metrics.response_time, -1);
      const threshold = _.defaultTo(metrics.threshold, -1);

      this.selectionStatistics = {};

      if (requestCount >= 0) {
        this.selectionStatistics.requests = Math.floor(requestCount);
      }
      if (errorCount >= 0) {
        this.selectionStatistics.errors = Math.floor(errorCount);
      }
      if (duration >= 0) {
        this.selectionStatistics.responseTime = Math.floor(duration);

        if (threshold >= 0) {
          this.selectionStatistics.threshold = Math.floor(threshold);
          this.selectionStatistics.thresholdViolation = duration > threshold;
        }
      }

      for (let i = 0; i < edges.length; i++) {
        const actualEdge: EdgeSingular = edges[i];
        const sendingCheck: boolean = actualEdge.source().id() === this.selectionId;
        let node: NodeSingular;

        if (sendingCheck) {
          node = actualEdge.target();
        } else {
          node = actualEdge.source();
        }

        const sendingObject: TableContent = {
          name: node.id(),
          responseTime: '-',
          rate: '-',
          error: '-',
        };

        const edgeMetrics: IntGraphMetrics = actualEdge.data('metrics');

        if (edgeMetrics !== undefined) {
          const { response_time, rate, error_rate } = edgeMetrics;

          if (rate !== undefined) {
            sendingObject.rate = Math.floor(rate).toString();
          }
          if (response_time !== undefined) {
            sendingObject.responseTime = Math.floor(response_time) + ' ms';
          }
          if (error_rate !== undefined && rate !== undefined) {
            sendingObject.error = Math.floor(error_rate / (rate / 100)) + '%';
          }
        }

        if (sendingCheck) {
          sending.push(sendingObject);
        } else {
          receiving.push(sendingObject);
        }
      }
      this.receiving = receiving;
      this.sending = sending;

      this.generateDrillDownLink();
    }
  }

  generateDrillDownLink() {
    const { drillDownLink } = this.getSettings(false);
    if (drillDownLink !== undefined) {
      const link = drillDownLink.replace('{}', this.selectionId);
      this.resolvedDrillDownLink = this.templateSrv.replace(link);
    }
  }

  render() {
    if (this.state.cy !== undefined) {
      this._updateGraph(this.props.data);
    }
    return (
      <div className="graph-container">
        <div className="service-dependency-graph">
          <div className="canvas-container" ref={(ref) => (this.ref = ref)}></div>
          <div className="zoom-button-container">
            <button className="btn navbar-button width-100" onClick={() => this.toggleAnimation()}>
              <i className={this.state.animateButtonClass}></i>
            </button>
            <button className="btn navbar-button width-100" onClick={() => this.runLayout()}>
              <i className="fa fa-sitemap"></i>
            </button>
            <button className="btn navbar-button width-100" onClick={() => this.fit()}>
              <i className="fa fa-dot-circle-o"></i>
            </button>
            <button className="btn navbar-button width-100" onClick={() => this.props.layerIncreaseFunction()}>
              <i className="fa fa-plus"></i>
            </button>
            <button className="btn navbar-button width-100" onClick={() => this.props.layerDecreaseFunction()}>
              <i className="fa fa-minus"></i>
            </button>
            <span>
              Layer {this.state.controller.state.currentLayer}/{this.state.maxLayer}
            </span>
          </div>
        </div>
        <Statistics
          show={this.state.showStatistics}
          selectionId={this.selectionId}
          resolvedDrillDownLink={this.resolvedDrillDownLink}
          selectionStatistics={this.selectionStatistics}
          currentType={this.currentType}
          showBaselines={this.getSettings(true).showBaselines}
          receiving={this.receiving}
          sending={this.sending}
        />
      </div>
    );
  }
}
