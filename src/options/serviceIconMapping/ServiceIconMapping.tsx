import React from 'react';
import { remove } from 'lodash';
import { StandardEditorProps } from '@grafana/data';
import { PanelSettings } from '../../types';
import assetUtils from '../../panel/asset_utils';

interface Props extends StandardEditorProps<string, PanelSettings> {
  item: any;
  value: any;
  onChange: any;
  context: any;
}

interface State {
  item: any;
  value: string;
  onChange: (value?: string) => void;
  context: any;
  serviceIcons: string[];
}

export class ServiceIconMapping extends React.PureComponent<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
      ...props,
      serviceIcons: [],
    };
    fetch(assetUtils.getAssetUrl('service_icons/icon_index.json'))
      .then(response => response.json())
      .then(data => {
        data.sort();
        this.setState({
          serviceIcons: data,
        });
      })
      .catch(() => {
        console.error(
          'Could not load service icons mapping index. Please verify the "icon_index.json" in the plugin\'s asset directory.'
        );
      });
  }

  addMapping() {
    this.state.context.options.serviceIcons.push({ pattern: 'my-type', filename: 'default' });
    this.state.onChange.call(this.state.item.path, this.state.context.options.serviceIcons);
  }

  removeMapping(index: any) {
    remove(this.state.context.options.serviceIcons, n => this.state.context.options.serviceIcons.indexOf(n) === index);
    this.state.onChange.call(this.state.item.path, this.state.context.options.serviceIcons);
  }

  setPatternValue(event: any, index: any) {
    this.state.context.options.serviceIcons[index].pattern = event.currentTarget.value;
    this.state.onChange.call(this.state.item.path, this.state.context.options.serviceIcons);
  }

  setFileNameValue(event: any, index: any) {
    this.state.context.options.serviceIcons[index].filename = event.currentTarget.value.toString();
    this.props.onChange.call(this.state.item.path, this.state.context.options.serviceIcons);
  }

  render() {
    if (!this.state.value || this.state.value === undefined) {
      this.state.context.options.serviceIcons = [{ pattern: 'my-type', filename: 'default' }];
    }
    var optionsList: JSX.Element[] = [];
    if (this.state.serviceIcons !== undefined) {
      for (const image of this.state.serviceIcons) {
        optionsList.push(<option value={image}>{image}</option>);
      }
    }
    var componentList: JSX.Element[] = [];
    for (const [index] of this.state.context.options.serviceIcons.entries()) {
      componentList.push(
        <div>
          <div className="gf-form">
            <input
              type="text"
              className="input-small gf-form-input width-10"
              value={this.state.context.options.serviceIcons[index].pattern}
              onChange={e => this.setPatternValue(e, index)}
            />

            <select
              className="input-small gf-form-input width-10"
              value={this.state.context.options.serviceIcons[index].filename}
              onChange={e => this.setFileNameValue(e, index)}
            >
              {optionsList}
            </select>

            <a className="gf-form-label tight-form-func" onClick={() => this.removeMapping(index)}>
              <i className="fa fa-trash"></i>
            </a>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="gf-form-inline">
          <div className="gf-form">
            <label className="gf-form-label width-10">Target Name (RegEx)</label>
            <label className="gf-form-label width-10">Icon</label>
          </div>
        </div>
        <div>{componentList}</div>
        <button className="btn navbar-button navbar-button--primary" onClick={() => this.addMapping()}>
          Add Service Icon Mapping
        </button>
      </div>
    );
  }
}
