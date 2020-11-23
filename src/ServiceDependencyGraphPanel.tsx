import  { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import _  from 'lodash';


import { DataMapping, PanelSettings, PanelStyleSettings, IconResource} from './types';
import React from 'react';

interface Props extends PanelProps<PanelSettings> {}
interface PanelState {
	animate: boolean;
    sumTimings: boolean;
    filterEmptyConnections: boolean;
    style: PanelStyleSettings;
    showDebugInformation: boolean;
    showConnectionStats: boolean;
    externalIcons: IconResource[];
    dataMapping: DataMapping;
    showDummyData: boolean;
    drillDownLink: string;
    showBaselines: boolean;
  }

export class ServiceDependencyGraphPanel extends PureComponent<Props, PanelState> {
    getColumnNames() {
        /*if (data) {
          return sortBy(this.props..series[0].fields.map((field: any) => field));
        }*/
        console.log(this.props.data.series[0].fields)
        return [];
      }


    render() {
        return (
          <div>
              <h1> HI!</h1>
          </div>
        );
      }
}