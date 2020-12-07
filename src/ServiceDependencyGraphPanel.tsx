import CanvasDrawer from 'canvas/graph_canvas';
import cytoscape from 'cytoscape';
import React from 'react';
import { PureComponent } from 'react';
//import CytoscapeComponent from 'react-cytoscapejs';
//import ReactDOM from 'react-dom';
//import './ServiceDependencyGraphPanel.css';
import { ServiceDependencyGraphPanelController } from './ServiceDependencyGraphPanelController';
import cyCanvas from 'cytoscape-canvas';
import cola from 'cytoscape-cola';
import ReactDOM from 'react-dom';
import CytoscapeComponent from 'react-cytoscapejs';
//import {Core} from 'cytoscape';


interface PanelState {
    elements: any, 
    width: number,
    height: number,
    zoom: number,
    animate: boolean,
    controller: ServiceDependencyGraphPanelController;
  }

cyCanvas(cytoscape);
cytoscape.use(cola);

export class ServiceDependencyGraphPanel extends PureComponent<PanelState, PanelState> {
    ref: any;
    constructor(props: PanelState){
        super(props);
        this.state = {...props}
        this.ref = React.createRef();
      }

      zoom(zoom: any) {
        const zoomStep = 0.25 * zoom;
        const zoomLevel = Math.max(0.1, this.state.zoom + zoomStep);
        this.setState(
            {zoom: zoomLevel}
        )
    }

    componentDidMount () {
        this.onLoad()
    }

    getSettings() {
       return this.state.controller.state.options
    }

    onLoad() {
      
      
      const cy = cytoscape({
        // TODO: Use a ref here!
        container: this.ref,
        zoom: this.props.zoom,
        elements:  this.props.elements,
        style: []
      });
      cy.add([
          { group: 'nodes', data: { id: 'n0' }, position: { x: 373, y: 238 } },
          { group: 'nodes', data: { id: 'n1' }, position: { x: 273, y: 138 } },
          { group: 'edges', data: { id: 'e0', source: 'n0', target: 'n1' } }
        ]);
      
      var a = new CanvasDrawer(this, cy, cy.cyCanvas({
        zIndex: 1
      }))
      cy.on("render cyCanvas.resize", () => {
        a.repaint(true)
       });
      }


    //zoom = {this.state.zoom} style={ { width: this.props.width, height: this.props.height}}
    render(){
        return (
            <div className="graph-container" ng-show="!ctrl.getError()">
                <div className="canvas-container" ref={ ref => this.ref = ref} style= {{height: this.props.height, width: this.props.width - 100}}>
                    
                </div>
                <div className="zoom-button-container">
                    <button className="btn navbar-button" ng-click="ctrl.toggleAnimation()">
                        <i ng-class="{fa: true, 'fa-play-circle': !ctrl.panel.settings.animate, 'fa-pause-circle': ctrl.panel.settings.animate}"></i>
                    </button>
                    <button className="btn navbar-button" ng-click="ctrl.runLayout()">
                        <i className="fa fa-sitemap"></i>
                    </button>
                    <button className="btn navbar-button" ng-click="ctrl.fit()">
                        <i className="fa fa-dot-circle-o"></i>
                        </button>
                    <button className="btn navbar-button" onClick= {() => this.zoom(+1)}>
                        <i className="fa fa-plus"></i>
                    </button>
                    <button className="btn navbar-button" onClick= {() => this.zoom(-1)}>
                        <i className="fa fa-minus"></i>
                    </button>
                </div>
            </div>
        );
    }
}