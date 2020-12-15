import React from 'react';
import  { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { ServiceDependencyGraph } from './serviceDependencyGraph/ServiceDependencyGraph'
import _ from 'lodash';
import { EGraphNodeType, PanelSettings } from '../types';
import cytoscape from 'cytoscape';
import '../css/novatec-service-dependency-graph-panel.css'


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
    options: any
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
    return this.state.options
 }

  render(){
    const elements = [
       { data: { id: 'one', label: 'Node 1', type: EGraphNodeType.EXTERNAL, external_type: "one" }, position: { x: 0, y: 0 } },
       { data: { id: 'two', label: 'Node 2', type: EGraphNodeType.INTERNAL }, position: { x: 100, y: 0 } },
       { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } },
       { data: { id: 'three', label: 'Node 3', type: EGraphNodeType.EXTERNAL, external_type: "three" }, position: { x: 0, y: 0 } },
       { data: { id: 'four', label: 'Node 4', type: EGraphNodeType.INTERNAL }, position: { x: 100, y: 0 } },
       { data: { source: 'three', target: 'four', label: 'Edge from Node1 to Node2' } },
       { data: { id: 'five', label: 'Node 5', type: EGraphNodeType.INTERNAL }, position: { x: 0, y: 0 }},
       { data: { id: 'six', label: 'Node 6', type: EGraphNodeType.INTERNAL }, position: { x: 100, y: 0 }},
       { data: { source: 'five', target: 'six', label: 'Edge from Node1 to Node2' } },
       { data: { id: 'seven', label: 'Node 7', type: EGraphNodeType.INTERNAL }, position: { x: 0, y: 0 } },
       { data: { id: 'eight', label: 'Node 8', type: EGraphNodeType.INTERNAL }, position: { x: 100, y: 0 } },
       { data: { source: 'seven', target: 'eight', label: 'Edge from Node1 to Node2' } },
       { data: { source: 'eight', target: 'one', label: 'Edge from Node1 to Node2' } },
       { data: { source: 'five', target: 'four', label: 'Edge from Node1 to Node2' } },
       { data: { source: 'three', target: 'six', label: 'Edge from Node1 to Node2' } },
       { data: { source: 'six', target: 'three', label: 'Edge from Node1 to Node2' } }
    ];
    return (
        <div className="service-dependency-graph-panel" style ={ {height: this.props.height, width: this.props.width}} ref={this.ref} id = "cy">
            <ServiceDependencyGraph elements={ elements } zoom = { 1 }  controller = { this } animate = { false } showStatistics = {false}/>
        </div>   
        );
      }
    }