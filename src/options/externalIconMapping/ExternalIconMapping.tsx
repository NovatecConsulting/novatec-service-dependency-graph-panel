import React from 'react';
import { remove } from 'lodash';
import { StandardEditorProps } from '@grafana/data';
import { PanelSettings } from '../../types';

interface Props extends StandardEditorProps<string, PanelSettings> {
  item: any;
  value: string;
  onChange: (value?: string) => void;
  context: any;
}

export class ExternalIconMapping extends React.PureComponent<Props, Props> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = { ...props };
  }

  addMapping() {
    this.state.context.options.externalIcons.push({ pattern: 'my-type', filename: 'default' });
    this.state.onChange.call(this.state.item.path, this.state.context.options.externalIcons);
  }

  removeMapping(index: number) {
    remove(
      this.state.context.options.externalIcons,
      n => this.state.context.options.externalIcons.indexOf(n) === index
    );
    this.state.onChange.call(this.state.item.path, this.state.context.options.externalIcons);
  }

  setPatternValue(event: any, index: number) {
    this.state.context.options.externalIcons[index].pattern = event.currentTarget.value;
    this.state.onChange.call(this.state.item.path, this.state.context.options.externalIcons);
  }

  setFileNameValue(event: any, index: number) {
    this.state.context.options.externalIcons[index].filename = event.currentTarget.value;
    this.state.onChange.call(this.state.item.path, this.state.context.options.externalIcons);
  }

  getExternalIcons() {
    return ['default', 'message', 'database', 'http', 'web', 'balancer', 'ldap', 'mainframe', 'smtp', 'ftp'];
  }

  render() {
    if (!this.state.value || this.state.value === undefined) {
      this.state.context.options.externalIcons = [{ pattern: 'my-type', filename: 'default' }];
    }
    var optionsList: JSX.Element[] = [];
    for (const image of this.getExternalIcons()) {
      optionsList.push(<option value={image}>{image}</option>);
    }
    var componentList: JSX.Element[] = [];
    for (const [index] of this.state.context.options.externalIcons.entries()) {
      componentList.push(
        <div>
          <div className="gf-form">
            <input
              type="text"
              className="input-small gf-form-input width-10"
              value={this.state.context.options.externalIcons[index].pattern}
              onChange={e => this.setPatternValue(e, index)}
            />

            <select
              className="input-small gf-form-input width-10"
              value={this.state.context.options.externalIcons[index].filename}
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
            <label className="gf-form-label width-10">Target Type</label>
            <label className="gf-form-label width-10">Icon</label>
          </div>
        </div>
        <div>{componentList}</div>
        <button className="btn navbar-button navbar-button--primary" onClick={() => this.addMapping()}>
          Add External Service Icon Mapping
        </button>
      </div>
    );
  }
}
