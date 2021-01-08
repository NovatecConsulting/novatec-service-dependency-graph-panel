import CanvasDrawer from 'panel/canvas/graph_canvas';
import cytoscape, { EdgeCollection, EdgeSingular, ElementDefinition, NodeSingular } from 'cytoscape';
import React from 'react';
import { PureComponent } from 'react';
import { ServiceDependencyGraphPanelController } from '../ServiceDependencyGraphPanelController';
import cyCanvas from 'cytoscape-canvas';
import cola from 'cytoscape-cola';
import layoutOptions from '../layout_options';
import { Statistics } from '../statistics/Statistics';
import _, { map, find, remove, each } from 'lodash';
import { TableContent, IGraphMetrics, IGraph, IGraphNode, IGraphEdge } from 'types';
import { TemplateSrv, getTemplateSrv } from '@grafana/runtime';
import './ServiceDependencyGraph.css'


interface PanelState {
    zoom: number | undefined,
    animate: boolean | undefined,
    controller: ServiceDependencyGraphPanelController;
    cy?: cytoscape.Core | undefined,
    graphCanvas?: CanvasDrawer | undefined,
    animateButton?: string,
    showStatistics: boolean,
    data: any
  }

cyCanvas(cytoscape);
cytoscape.use(cola);

export class ServiceDependencyGraph extends PureComponent<PanelState, PanelState> {

  ref: any;

  selectionId: string | number;

  currentType: string;

  selectionStatistics: any;

  receiving: TableContent[];

  sending: TableContent[];

  resolvedDrillDownLink: string;

  templateSrv: TemplateSrv;

  initResize: boolean = true;

  constructor(props: PanelState){
      super(props);
      this.state = {
          ...props,
          animateButton: "fa fa-play-circle",
          showStatistics: false
      };
      this.ref = React.createRef();
      this.templateSrv = getTemplateSrv();
  }

  componentDidMount () {
      const cy: any = cytoscape({
          container: this.ref,
          zoom: this.state.zoom,
          elements: this.props.data,
          style: [
          {
            "selector": "node",
            "style": {
              "background-opacity": 0
            }
          },
          {
            "selector": "edge",
            "style": {
              "visibility": "hidden"
            }
          }
        ],
          wheelSensitivity: 0.125
      });
      
      var graphCanvas = new CanvasDrawer(this, cy, cy.cyCanvas({
          zIndex: 1
      }));
      
      cy.on("render cyCanvas.resize", () => {
          graphCanvas.repaint(true)
          });
      cy.on('select', 'node', () => this.onSelectionChange());
      cy.on('unselect', 'node', () => this.onSelectionChange());
      this.setState({
          cy: cy,
          graphCanvas: graphCanvas
      });
      graphCanvas.start();
  }

  componentDidUpdate(){
    this._updateGraph(this.props.data);
  }

  _updateGraph(graph: IGraph) {
		const cyNodes = this._transformNodes(graph.nodes);
		const cyEdges = this._transformEdges(graph.edges);

		console.groupCollapsed("Updating graph");
		console.log("cytoscape nodes: ", JSON.parse(JSON.stringify(cyNodes)));
		console.log("cytoscape edges: ", JSON.parse(JSON.stringify(cyEdges)));
		console.groupEnd();

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
				each(updatedNodes, node => {
					node.lock();
				});
				this.runLayout(true);
			}
		}
  }
  
  _transformNodes(nodes: IGraphNode[]): ElementDefinition[] {
		const cyNodes: ElementDefinition[] = map(nodes, node => {
			const result: ElementDefinition = {
				group: 'nodes',
				data: {
					id: node.data.id,
					type: node.data.type,
					external_type: node.data.external_type,
					metrics: {
						...node.data.metrics
					}
				}
			};
			return result;
		});

		return cyNodes;
  }
  
  _transformEdges(edges: IGraphEdge[]): ElementDefinition[] {
		const cyEdges: ElementDefinition[] = map(edges, edge => {
			const cyEdge: ElementDefinition = {
				group: 'edges',
				data: {
					id: edge.data.source + ":" + edge.data.target,
					source: edge.data.source,
					target: edge.data.target,
					metrics: {
						...edge.data.metrics
					}
				}
			};

			return cyEdge;
		});

		return cyEdges;
  }
  
  _updateOrRemove(dataArray: (NodeSingular | EdgeSingular)[], inputArray: ElementDefinition[]) {
		const elements: any[]  = []; //(NodeSingular | EdgeSingular)[]
		for (let i = 0; i < dataArray.length; i++) {
			const element = dataArray[i];

			const cyNode = find(inputArray, { data: { id: element.id() } });

			if (cyNode) {
				element.data(cyNode.data);
				remove(inputArray, n => n.data.id === cyNode.data.id);
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
                showStatistics: true
      });
            
    } else {
      this.setState({
                showStatistics: false
            });
    }

  }

  getSettings() {
      return this.props.controller.state.options;
  }

  toggleAnimation() {
    this.props.controller.state.options.animate = !this.state.controller.state.options.animate;

    if (this.state.controller.state.options.animate) {
      this.state.graphCanvas.startAnimation();
      this.setState({
          animateButton: "fa fa-pause-circle"
      });
    } else {
      this.state.graphCanvas.stopAnimation();
      this.setState({
          animateButton: "fa fa-play-circle"
      });
    }
  }

  runLayout(unlockNodes: boolean = false) {
		const that = this;
		const options = {

      ...layoutOptions,

			stop: function () {
				if (unlockNodes) {
					that.unlockNodes();
        }
        that.setState({
          zoom: that.state.cy.zoom()
        })
			}
    };

    this.state.cy.layout(options).run()
	}

	unlockNodes() {
		this.state.cy.nodes().forEach((node: { unlock: () => void; }) => {
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
          zoom: this.state.cy.zoom()
        });
	}
    
  zoom(zoom: any) {
    const zoomStep = 0.25 * zoom;
    const zoomLevel = Math.max(0.1, this.state.zoom + zoomStep);
    this.setState({
      zoom: zoomLevel
    });
    this.state.cy.zoom(zoomLevel);
  }

  updateStatisticTable() {
    const selection = this.state.cy.$(':selected');
    
		if (selection.length === 1) {
			const currentNode: NodeSingular = selection[0];
			this.selectionId = currentNode.id();
			this.currentType = currentNode.data('type');
			const receiving: TableContent[] = [];
			const sending: TableContent[] = [];
      const edges: EdgeCollection = selection.connectedEdges();
      
      const metrics: IGraphMetrics = selection.nodes()[0].data('metrics');

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
				}
				else {
					node = actualEdge.source();
				}

				const sendingObject: TableContent = {
					name: node.id(),
					responseTime: "-",
					rate: "-",
					error: "-"
				};

        const edgeMetrics: IGraphMetrics = actualEdge.data('metrics');

        if(edgeMetrics !== undefined) {
          const { response_time, rate, error_rate } = edgeMetrics;

          if (rate != undefined) {
            sendingObject.rate = Math.floor(rate).toString();
          }
          if (response_time != undefined) {
            sendingObject.responseTime = Math.floor(response_time) + " ms";
          }
          if (error_rate != undefined && rate != undefined) {
            sendingObject.error = Math.floor(error_rate / (rate / 100)) + "%";
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
    const { drillDownLink } = this.getSettings();
    if(drillDownLink !== undefined) {
      const link = drillDownLink.replace('{}', this.selectionId);
      this.resolvedDrillDownLink = this.templateSrv.replace(link);
    }
    
	}

  render(){
    if(this.state.cy !== undefined) {
      this._updateGraph(this.props.data);
    }
    return (
        <div className="graph-container">
            <div className="service-dependency-graph">
                <div className="canvas-container" ref={ ref => this.ref = ref} >

                </div>
                <div className="zoom-button-container">
                    <button className="btn navbar-button width-100" onClick={() => this.toggleAnimation()}>
                        <i className={this.state.animateButton}></i>
                    </button>
                    <button className="btn navbar-button width-100" onClick={() => this.runLayout()}>
                        <i className="fa fa-sitemap"></i>
                    </button>
                    <button className="btn navbar-button width-100" onClick={() => this.fit()}>
                        <i className="fa fa-dot-circle-o"></i>
                        </button>
                    <button className="btn navbar-button width-100" onClick={() => this.zoom(+1)}>
                        <i className="fa fa-plus"></i>
                    </button>
                    <button className="btn navbar-button width-100" onClick={() => this.zoom(-1)}>
                        <i className="fa fa-minus"></i>
                    </button>
                </div>
            </div>
            <Statistics show = {this.state.showStatistics} 
                        selectionId = { this.selectionId }
                        resolvedDrillDownLink= {this.resolvedDrillDownLink}
                        selectionStatistics = { this.selectionStatistics }
                        currentType = { this.currentType }
                        showBaselines = {false}
                        receiving = { this.receiving }
                        sending = {this.sending}/>
        </div>
    );
}
}