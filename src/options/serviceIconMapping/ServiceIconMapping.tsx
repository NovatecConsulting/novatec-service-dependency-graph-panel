import React, { ChangeEvent } from 'react';
import { StandardEditorContext, StandardEditorProps } from '@grafana/data';
import { IconResource, PanelSettings } from '../../types';
import assetUtils from '../../panel/asset_utils';

interface Props extends StandardEditorProps<string, PanelSettings> {
  item: any;
  value: any;
  onChange: (value?: string) => void;
  context: StandardEditorContext<any>;
}

interface State {
  item: any;
  value: string;
  onChange: (value?: string) => void;
  context: StandardEditorContext<any>;
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
    const { serviceIcons } = this.state.context.options;
    const { path } = this.state.item;
    serviceIcons.push({ pattern: 'my-type', filename: 'default' });
    this.state.onChange.call(path, serviceIcons);
  }

  removeMapping(index: number) {
    const { serviceIcons } = this.state.context.options;
    const { path } = this.state.item;
    serviceIcons.splice(index, 1);
    this.state.onChange.call(path, serviceIcons);
  }

  setPatternValue(event: React.ChangeEvent<HTMLInputElement>, index: number) {
    const { serviceIcons } = this.state.context.options;
    const { path } = this.state.item;
    serviceIcons[index].pattern = event.currentTarget.value;
    this.state.onChange.call(path, serviceIcons);
  }

  setFileNameValue(event: ChangeEvent<HTMLSelectElement>, index: number) {
    const { serviceIcons } = this.state.context.options;
    const { path } = this.state.item;
    serviceIcons[index].filename = event.currentTarget.value.toString();
    this.props.onChange.call(path, serviceIcons);
  }

  render() {
    var { serviceIcons } = this.state.context.options;
    const { serviceIcons: serviceIconNames } = this.state;
    if (serviceIcons === undefined) {
      serviceIcons = [];
    }

    return (
      <div>
        <div className="gf-form-inline">
          <div className="gf-form">
            <label className="gf-form-label width-10">Target Name (RegEx)</label>
            <label className="gf-form-label width-10">Icon</label>
          </div>
        </div>
        <div>
          {serviceIcons.map((icon: IconResource, index: number) => (
            <>
              <div className="gf-form">
                <input
                  type="text"
                  className="input-small gf-form-input width-10"
                  value={icon.pattern}
                  onChange={e => this.setPatternValue(e, index)}
                />

                <select
                  className="input-small gf-form-input width-10"
                  value={icon.filename}
                  onChange={e => this.setFileNameValue(e, index)}
                >
                  {serviceIconNames.map((iconNames: string) => (
                    <option value={iconNames}>{iconNames}</option>
                  ))}
                </select>

                <a className="gf-form-label tight-form-func" onClick={() => this.removeMapping(index)}>
                  <i className="fa fa-trash"></i>
                </a>
              </div>
            </>
          ))}
        </div>
        <button className="btn navbar-button navbar-button--primary" onClick={() => this.addMapping()}>
          Add Service Icon Mapping
        </button>
      </div>
    );
  }
}
