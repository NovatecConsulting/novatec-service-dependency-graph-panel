import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { PanelSettings, DataMapping } from '../../types';
import { Switch } from '@grafana/ui';

interface Props extends StandardEditorProps<boolean, PanelSettings> {
  item: any;
  value: boolean;
  onChange: (value?: boolean) => void;
  context: any;
}

interface State {
  item: any;
  value: boolean;
  dataMapping: DataMapping | undefined;
  onChange: (value?: boolean) => void;
  context: any;
}

export class DummyDataSwitch extends React.PureComponent<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
      dataMapping: this.props.context.options.dataMapping,
      ...props,
    };
  }

  getDummyDataMapping = () => {
    return {
      sourceComponentPrefix: 'origin_',
      targetComponentPrefix: 'target_',
      responseTimeColumn: 'in_timesum',
      requestRateColumn: 'in_count',
      errorRateColumn: 'error_in',
      responseTimeOutgoingColumn: 'out_timesum',
      requestRateOutgoingColumn: 'out_count',
      errorRateOutgoingColumn: 'error_out',
      extOrigin: '',
      extTarget: '',
      type: '',
      showDummyData: true,
      baselineRtUpper: 'threshold',
    };
  };

  onChange = (event: any) => {
    var dataMapping = this.props.context.options.dataMapping;
    var newValue = !dataMapping.showDummyData;

    dataMapping = this.state.dataMapping;

    if (newValue) {
      this.setState({ dataMapping: dataMapping });
      dataMapping = this.getDummyDataMapping();
    }
    dataMapping.showDummyData = newValue;
    this.props.onChange.call(this.state.item.path, dataMapping);
    /*this.setState({
            value:!this.state.value,
            dataMapping:this.props.context.options.dataMapping
        });*/
  };

  render() {
    return (
      <div>
        <Switch
          value={this.props.context.options.dataMapping.showDummyData}
          css={{}}
          onChange={(event: any) => this.onChange(event)}
        />
      </div>
    );
  }
}
