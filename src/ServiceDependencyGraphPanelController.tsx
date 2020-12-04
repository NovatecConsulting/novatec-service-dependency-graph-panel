import React from 'react';
import  { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { ServiceDependencyGraphPanel } from './ServiceDependencyGraphPanel'
import _, { find} from 'lodash';
import { PanelSettings } from './types';
import cytoscape from 'cytoscape';
//import cola from 'cytoscape-cola';
//import cyCanvas from 'cytoscape-canvas';



interface Props extends PanelProps<PanelSettings> {}

interface PanelState {
    id: any, 
    data: any, 
    fieldConfig: any, 
    height:any, 
    width: any, 
    onChangeTimeRange: any, 
    onFieldConfigChange: any, 
    onOptionsChange: any, 
    renderCounter: any, 
    replaceVariables: any, 
    timeRange: any, 
    timeZone: any, 
    title: any, 
    transparent: any
  }

export class ServiceDependencyGraphPanelController extends PureComponent<Props, PanelState> {
    cy: cytoscape.Core | undefined
    ref:any
    panel: any;
  constructor(props: Props){
    super(props);
    this.state = {...props}
    this.ref = React.createRef();
  }

  getSettings(): PanelSettings {
    return this.props.options
 }

 getAssetUrl(assetName: string) {
     //TODO: Fix this with something like this.panel.type
    var baseUrl = 'public/plugins/' + 'novatec-service-dependency-graph-panel';
    return baseUrl + '/assets/' + assetName;
}

 getTypeSymbol(type: any, resolveName = true) {
    if (!type) {
        return this.getAssetUrl('default.png');
    }

    if (!resolveName) {
        return this.getAssetUrl(type);
    }

    const { externalIcons } = this.getSettings();

    const icon = find(externalIcons, icon => icon.name.toLowerCase() === type.toLowerCase());

    if (icon !== undefined) {
        return this.getAssetUrl(icon.filename + '.png');
    } else {
        return this.getAssetUrl('default.png');
    }
}



  render(){
    const elements = [
       { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
       { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
       { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
    ];
  
    return (
        <div className="service-dependency-graph-panel" style ={ {height: this.props.height, width: this.props.width}} ref={this.ref} id = "cy">
            <ServiceDependencyGraphPanel cytoscape={this.cy} elements={ elements } width = { this.state.width } height = { this.state.height } zoom = { 1 }  controller = { this } animate = { false }/>
        </div>   
        );
      }
    }
        


    /* render() {
        return (
          <div className="service-dependency-graph-panel" ng-style="{height: ctrl.height}">
            <div className="graph-container" ng-show="!ctrl.getError()">
                <div className="service-dependency-graph">
                    <div className="canvas-container"></div>

                    <div className="zoom-button-container">
                        <button className="btn navbar-button" ng-click="ctrl.toggleAnimation()"><i
                                ng-className="{fa: true, 'fa-play-circle': !ctrl.panel.settings.animate, 'fa-pause-circle': ctrl.panel.settings.animate}"></i></button>
                        <button className="btn navbar-button" ng-click="ctrl.runLayout()"><i className="fa fa-sitemap"></i></button>
                        <button className="btn navbar-button" ng-click="ctrl.fit()"><i className="fa fa-dot-circle-o"></i></button>
                        <button className="btn navbar-button" ng-click="ctrl.zoom(+1)"><i className="fa fa-plus"></i></button>
                        <button className="btn navbar-button" ng-click="ctrl.zoom(-1)"><i className="fa fa-minus"></i></button>
                    </div>
                </div>
                
            </div>
            <div ng-show="ctrl.getError()">{{ctrl.getError()}}</div>
        </div>
        );
      }
}*/