import React, { ChangeEvent } from 'react';
import { StandardEditorContext, StandardEditorProps } from '@grafana/data';
import { IconResource, PanelSettings } from '../../types';
import assetUtils from '../../panel/asset_utils';
import './IconMapping.css';

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
  icons: string[];
}

export class IconMapping extends React.PureComponent<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
      ...props,
      icons: [],
    };
    fetch(assetUtils.getAssetUrl('icons/icon_index.json'))
      .then(response => response.json())
      .then(data => {
        data.sort();
        this.setState({
          icons: data,
        });
      })
      .catch(() => {
        console.error(
          'Could not load service icons mapping index. Please verify the "icon_index.json" in the plugin\'s asset directory.'
        );
      });
  }

  addMapping() {
    const { path } = this.state.item;
    const icons = this.state.context.options[path];
    icons.push({ pattern: 'my-type', filename: 'default' });
    this.state.onChange.call(path, icons);
  }

  removeMapping(index: number) {
    const { path } = this.state.item;
    const icons = this.state.context.options[path];
    icons.splice(index, 1);
    this.state.onChange.call(path, icons);
  }

  setPatternValue(event: React.ChangeEvent<HTMLInputElement>, index: number) {
    const { path } = this.state.item;
    const icons = this.state.context.options[path];
    icons[index].pattern = event.currentTarget.value;
    this.state.onChange.call(path, icons);
  }

  setFileNameValue(event: ChangeEvent<HTMLSelectElement>, index: number) {
    const { path } = this.state.item;
    const icons = this.state.context.options[path];
    icons[index].filename = event.currentTarget.value.toString();
    this.props.onChange.call(path, icons);
  }

  render() {
    const { path } = this.state.item;
    const { icons: iconNames } = this.state;
    var icons = this.state.context.options[path];
    if (icons === undefined) {
      icons = this.state.item.defaultValue;
      this.state.context.options[path] = this.state.item.defaultValue;
    }

    return (
      <div>
        <div className="gf-form-inline">
          <div className="gf-form width-100">
            <label className="gf-form-label no-background no-padding-left width-half">Target Name (RegEx)</label>
            <label className="gf-form-label no-background no-padding-left width-half">Icon</label>
          </div>
        </div>
        <div>
          {icons.map((icon: IconResource, index: number) => (
            <>
              <div className="gf-form">
                <input
                  type="text"
                  className="input-small gf-form-input"
                  value={icon.pattern}
                  onChange={e => this.setPatternValue(e, index)}
                />

                <select
                  className="input-small gf-form-input"
                  value={icon.filename}
                  onChange={e => this.setFileNameValue(e, index)}
                >
                  {iconNames.map((iconNames: string) => (
                    <option value={iconNames}>{iconNames}</option>
                  ))}
                </select>

                <a className="gf-form-label tight-form-func no-background" onClick={() => this.removeMapping(index)}>
                  <i className="fa fa-trash"></i>
                </a>
              </div>
            </>
          ))}
        </div>
        <button
          className="btn navbar-button navbar-button--primary icon-mapping-button"
          onClick={() => this.addMapping()}
        >
          Add Icon Mapping
        </button>
      </div>
    );
  }
}
