import React from 'react';
import { StandardEditorContext, StandardEditorProps } from '@grafana/data';
import { PanelSettings, DataMapping } from '../../types';
import { Switch } from '@grafana/ui';

interface Props extends StandardEditorProps<boolean, PanelSettings> {
  item: any;
  value: boolean;
  onChange: (value?: boolean) => void;
  context: StandardEditorContext<any>;
}

interface State {
  item: any;
  value: boolean;
  dataMapping: DataMapping | undefined;
  onChange: (value?: boolean) => void;
  context: StandardEditorContext<any>;
}

export class DummyDataSwitch extends React.PureComponent<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    let { dataMapping } = props.context.options;
    if (dataMapping === undefined) {
      dataMapping = props.item.defaultValue;
    }
    this.state = {
      dataMapping: dataMapping,
      ...props,
    };
  }

  getDummyDataMapping = () => {
    return {
      aggregationType: 'service',
      sourceColumn: 'origin_service',
      targetColumn: 'target_service',
      responseTimeColumn: 'in_timesum',
      requestRateColumn: 'in_count',
      errorRateColumn: 'error_in',
      responseTimeOutgoingColumn: 'out_timesum',
      requestRateOutgoingColumn: 'out_count',
      errorRateOutgoingColumn: 'error_out',
      extOrigin: 'origin_external',
      extTarget: 'target_external',
      type: 'protocol',
      showDummyData: true,
      baselineRtUpper: 'threshold',
    };
  };

  onChange = () => {
    let { dataMapping } = this.props.context.options;
    const { item } = this.state;
    const { onChange } = this.props;
    const newValue = !dataMapping.showDummyData;

    if (newValue) {
      this.setState({ dataMapping: dataMapping });
      dataMapping = this.getDummyDataMapping();
    }
    dataMapping.showDummyData = newValue;
    onChange.call(item.path, dataMapping);
  };

  render() {
    let { dataMapping } = this.props.context.options;
    if (dataMapping === undefined) {
      dataMapping = this.props.item.defaultValue;
      this.props.context.options.dataMapping = this.props.item.defaultValue;
    }

    return (
      <div>
        <Switch value={dataMapping.showDummyData} onChange={() => this.onChange()} />
      </div>
    );
  }
}
