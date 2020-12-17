import CanvasDrawer from 'panel/canvas/graph_canvas';
import cytoscape, { EdgeCollection, EdgeSingular, NodeSingular } from 'cytoscape';
import React from 'react';
import { PureComponent } from 'react';
import { ServiceDependencyGraphPanelController } from '../ServiceDependencyGraphPanelController';
import cyCanvas from 'cytoscape-canvas';
import cola from 'cytoscape-cola';
import layoutOptions from '../layout_options';
import { Statistics } from '../statistics/Statistics';
import _ from 'lodash';
import { TableContent, IGraphMetrics } from 'types';
import { TemplateSrv, getTemplateSrv } from '@grafana/runtime';


interface PanelState {
    zoom: number | undefined,
    animate: boolean | undefined,
    controller: ServiceDependencyGraphPanelController;
    cy?: any | undefined,
    graphCanvas?: any | undefined,
    animateButton?: string,
    showStatistics: boolean,
    data: any
  }

cyCanvas(cytoscape);
cytoscape.use(cola);

export class ServiceDependencyGraph extends PureComponent<PanelState, PanelState> {
  ref: any;
  graphGenerator: any
  currentData: any
  selectionId: any
  currentType: any
  selectionStatistics: any
  receiving: any
  sending: any
  resolvedDrillDownLink: string
  templateSrv: TemplateSrv

  constructor(props: PanelState){
      super(props);
      this.state = {
          ...props,
          animateButton: "fa fa-play-circle",
          showStatistics: false
      }
      this.ref = React.createRef();
      this.templateSrv = getTemplateSrv()
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
      }))
      
      cy.on("render cyCanvas.resize", () => {
          graphCanvas.repaint(true)
          });
      cy.on('select', 'node', () => this.onSelectionChange());
      cy.on('unselect', 'node', () => this.onSelectionChange());
      this.setState({
          cy: cy,
          graphCanvas: graphCanvas
      })

      //this._updateGraph(graph, cy);
  }

  onSelectionChange() {
    const selection = this.state.cy.$(':selected');

    if (selection.length === 1) {
      this.updateStatisticTable(); 
      this.setState({
                showStatistics: true
      })
            
    } else {
      this.setState({
                showStatistics: false
            }) 
    }

  }

  getSettings() {
      return this.props.controller.state.options
  }

  toggleAnimation() {
    this.props.controller.state.options.animate = !this.state.controller.state.options.animate;

    if (this.state.controller.state.options.animate) {
      this.state.graphCanvas.startAnimation();
      this.setState({
          animateButton: "fa fa-pause-circle"
      })
    } else {
      this.state.graphCanvas.stopAnimation();
      this.setState({
          animateButton: "fa fa-play-circle"
      })
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
                that.setState(
                    {zoom: that.state.cy.zoom()}
                )
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
        this.setState(
            {zoom: this.state.cy.zoom()}
        )
	}
    
  zoom(zoom: any) {
    const zoomStep = 0.25 * zoom;
    const zoomLevel = Math.max(0.1, this.state.zoom + zoomStep);
    this.setState(
        {zoom: zoomLevel}
    )
    this.state.cy.zoom(zoomLevel);
  }

  updateStatisticTable() {
		const selection = this.state.cy.$(':selected');
    console.log(selection)
		if (selection.length === 1) {
			const currentNode: NodeSingular = selection[0];
			this.selectionId = currentNode.id();
			this.currentType = currentNode.data('type');
			const receiving: TableContent[] = [];
			const sending: TableContent[] = [];
			const edges: EdgeCollection = selection.connectedEdges();
      console.log(currentNode)
      const metrics: IGraphMetrics = selection.nodes()[0].data('metrics');
      console.log(metrics)
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
					node = actualEdge.source()
				}

				const sendingObject: TableContent = {
					name: node.id(),
					responseTime: "-",
					rate: "-",
					error: "-"
				};

        const edgeMetrics: IGraphMetrics = actualEdge.data('metrics');
        console.log(edgeMetrics)
        console.log(actualEdge)
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
    const link = drillDownLink.replace('{}', this.selectionId);
    console.log(link)
		this.resolvedDrillDownLink = this.templateSrv.replace(link);
	}

  render(){
    
    return (
        <div className="graph-container" ng-show="!ctrl.getError()">
            <div className="service-dependency-graph">
                <div className="canvas-container" ref={ ref => this.ref = ref} style= {{height: "100%", width: "100%"}}>

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