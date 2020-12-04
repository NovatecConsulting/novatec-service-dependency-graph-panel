import React from 'react';
import { remove } from 'lodash';
import { StandardEditorProps } from '@grafana/data';
import { PanelSettings } from '../../types';


interface Props extends StandardEditorProps<string, PanelSettings> {}

function addMapping(context: any, onChange: any, item: any) {
    context.options.externalIcons.push({ pattern: 'my-type', filename: 'default' })
    onChange.call(item.path, context.options.externalIcons)
}

function removeMapping(context: any, index:any, onChange: any, item: any) {
    remove(context.options.externalIcons, n => context.options.externalIcons.indexOf(n) == index)
    onChange.call(item.path, context.options.externalIcons)
}

function setPatternValue(context: any, event: any, index: any, onChange: any, item: any) {
    context.options.externalIcons[index].pattern = event.currentTarget.value
    onChange.call(item.path, context.options.externalIcons)
}

function setFileNameValue(context: any, event: any, index: any, onChange: any, item: any) {
    context.options.serviceIcons[index].pattern = event.currentTarget.value
    onChange.call(item.path, context.options.externalIcons)
}

export const ExternalIconMapping: React.FC<Props> = ({ item, value, onChange, context }) => {
    if(context.options.externalIcons == undefined) {
        context.options.externalIcons = [{ pattern: 'my-type', filename: 'default' }]
    }
    var componentList = []
    for (const [index] of context.options.externalIcons.entries()) {
        componentList.push(
            <div>
                <div className="gf-form">
                    <input type="text" className="input-small gf-form-input width-10"
                        value = {context.options.externalIcons[index].pattern}
                        onChange={e => setPatternValue(context, e, index, onChange, item)} />

                    <select className="input-small gf-form-input width-10"
                        value = {context.options.externalIcons[index].fileName}
                        onChange={e => setFileNameValue(context, e, index, onChange, item)}>
                        <option ng-repeat="variable in editor.getServiceIconOptions()" value="{{variable}}">
                        </option>
                    </select>

                    <a className="gf-form-label tight-form-func" onClick = {() => removeMapping(context, index, onChange, item)}><i
                            className="fa fa-trash"></i></a>
                </div>
            </div>
        )
      }
    return (
        <div>
            <div className="gf-form-inline">
            <div className="gf-form">
                <label className="gf-form-label width-10">Target Type</label>
                <label className="gf-form-label width-10">Icon</label>
            </div>
            </div>
            <div>
                {componentList}
            </div>
            <button className="btn navbar-button navbar-button--primary" onClick={() => addMapping(context, onChange, item)}>Add External Service Icon Mapping</button>
        </div>
    )
}
