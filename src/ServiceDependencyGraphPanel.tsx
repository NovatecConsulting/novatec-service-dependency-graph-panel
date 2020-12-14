import CanvasDrawer from 'canvas/graph_canvas';
import cytoscape from 'cytoscape';
import React from 'react';
import { PureComponent } from 'react';
import { ServiceDependencyGraphPanelController } from './ServiceDependencyGraphPanelController';
import cyCanvas from 'cytoscape-canvas';
import cola from 'cytoscape-cola';
import layoutOptions from './layout_options';
import { Statistics } from 'Statistics';


interface PanelState {
    elements: any, 
    zoom: number | undefined,
    animate: boolean | undefined,
    controller: ServiceDependencyGraphPanelController;
    cy?: any | undefined,
    graphCanvas?: any | undefined,
    animateButton?: string,
    showStatistics: boolean
  }

cyCanvas(cytoscape);
cytoscape.use(cola);

export class ServiceDependencyGraphPanel extends PureComponent<PanelState, PanelState> {
    ref: any;
    constructor(props: PanelState){
        super(props);
        this.state = {
            ...props,
            animateButton: "fa fa-play-circle",
            showStatistics: false
        }
        this.ref = React.createRef();
      }

      

    componentDidMount () {
        const cy = cytoscape({
            container: this.ref,
            zoom: this.state.zoom,
            elements:  this.props.elements,
            style: [],
            wheelSensitivity: 0.125
        });
        
        var graphCanvas = new CanvasDrawer(this, cy, cy.cyCanvas({
            zIndex: 1
        }))
        cy.on("render cyCanvas.resize", () => {
            graphCanvas.repaint(true)
            });
        cy.on('select', 'node', (event) => this.onSelectionChange(event));
        cy.on('unselect', 'node', (event) => this.onSelectionChange(event));
        this.setState({
            cy: cy,
            graphCanvas: graphCanvas
        })
    }

    onSelectionChange(event: any) {
        const selection = this.state.cy.$(':selected');

		if (selection.length === 1) {
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
		this.state.cy.nodes().forEach(node => {
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

    render(){
        return (
            <div className="graph-container" ng-show="!ctrl.getError()">
                <div className="service-dependency-graph">
                    <div className="canvas-container" ref={ ref => this.ref = ref} style= {{height: "100%", width: "100%"}}>

                    </div>
                    <div className="zoom-button-container">
                        <button className="btn navbar-button" onClick={() => this.toggleAnimation()}>
                            <i className={this.state.animateButton}></i>
                        </button>
                        <button className="btn navbar-button" onClick={() => this.runLayout()}>
                            <i className="fa fa-sitemap"></i>
                        </button>
                        <button className="btn navbar-button" onClick={() => this.fit()}>
                            <i className="fa fa-dot-circle-o"></i>
                            </button>
                        <button className="btn navbar-button" onClick={() => this.zoom(+1)}>
                            <i className="fa fa-plus"></i>
                        </button>
                        <button className="btn navbar-button" onClick={() => this.zoom(-1)}>
                            <i className="fa fa-minus"></i>
                        </button>
                    </div>
                </div>
                <Statistics show = {this.state.showStatistics} 
                            selectionId="a"
                            resolvedDrillDownLink= "" 
                            selectionStatistics="c"
                            node=""
                            currentType='INTERNAL'
                            showBaselines = {false}
                            receiving = ""/>
            </div>
        );
    }
}