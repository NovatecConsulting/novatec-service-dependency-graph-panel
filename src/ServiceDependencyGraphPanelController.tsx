import React from 'react';
import  { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { ServiceDependencyGraphPanel } from './ServiceDependencyGraphPanel'
import _, { find} from 'lodash';
import { PanelSettings } from './types';
import cytoscape from 'cytoscape';
import './css/novatec-service-dependency-graph-panel.css'
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
    console.log("SETTINGS!!!")
    console.log(this.state.options)
    return this.state.options
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
       { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } },
       { data: { id: 'three', label: 'Node 3' }, position: { x: 0, y: 0 } },
       { data: { id: 'four', label: 'Node 4' }, position: { x: 100, y: 0 } },
       { data: { source: 'three', target: 'four', label: 'Edge from Node1 to Node2' } },
       { data: { id: 'five', label: 'Node 5' }, position: { x: 0, y: 0 } },
       { data: { id: 'six', label: 'Node 6' }, position: { x: 100, y: 0 } },
       { data: { source: 'five', target: 'six', label: 'Edge from Node1 to Node2' } },
       { data: { id: 'seven', label: 'Node 7' }, position: { x: 0, y: 0 } },
       { data: { id: 'eight', label: 'Node 8' }, position: { x: 100, y: 0 } },
       { data: { source: 'seven', target: 'eight', label: 'Edge from Node1 to Node2' } },
       { data: { source: 'eight', target: 'one', label: 'Edge from Node1 to Node2' } },
       { data: { source: 'five', target: 'four', label: 'Edge from Node1 to Node2' } },
       { data: { source: 'three', target: 'six', label: 'Edge from Node1 to Node2' } },
       { data: { source: 'six', target: 'three', label: 'Edge from Node1 to Node2' } }
    ];
    console.log(this.state)
    return (
        <div className="service-dependency-graph-panel" style ={ {height: this.props.height, width: this.props.width}} ref={this.ref} id = "cy">
            <ServiceDependencyGraphPanel elements={ elements } width = { this.state.width } height = { this.state.height } zoom = { 1 }  controller = { this } animate = { false } showStatistics = {false}/>
        </div>   
        );
      }
    }