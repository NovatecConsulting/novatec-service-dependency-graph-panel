import React from 'react';
import {  remove} from 'lodash';
import { StandardEditorProps } from '@grafana/data';
import { PanelSettings } from '../../types';


interface Props extends StandardEditorProps<string, PanelSettings> {}

function addMapping(context: any, onChange: any) {
    context.options.serviceIcons.push({ pattern: 'my-type', filename: 'default' })
}

function removeMapping(context: any, index:any, onChange: any) {
    remove(context.options.serviceIcons, n => context.options.serviceIcons.indexOf(n) == index)
}

function setPatternValue(context: any, event: any, index: any, onChange: any) {
    context.options.serviceIcons[index].pattern = event.currentTarget.value
}

export const ServiceIconMapping: React.FC<Props> = ({ item, value, onChange, context }) => {
    if(!value || value === undefined) {
        context.options.serviceIcons = [{ pattern: 'my-type', filename: 'default' }]
    }
    
    var componentList = []
    for (const [index] of context.options.serviceIcons.entries()) {
        componentList.push(
            <div>
                <div className="gf-form">
                    <input type="text" className="input-small gf-form-input width-10"
                        defaultValue = {context.options.serviceIcons[index].pattern}
                        onChange={e => setPatternValue(context, e, index, onChange(context.options.serviceIcons))} />

                    <select className="input-small gf-form-input width-10"
                        defaultValue = {context.options.serviceIcons[index].fileName}>
                        <option ng-repeat="variable in editor.getServiceIconOptions()" value="{{variable}}">
                        </option>
                    </select>

                    <a className="gf-form-label tight-form-func" onClick = {e => removeMapping(context, index, onChange())}><i
                            className="fa fa-trash"></i></a>
                </div>
            </div>
        )
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
                {componentList}
            </div>
            <button className="btn navbar-button navbar-button--primary" onClick={e => addMapping(context, onChange())}>Add Service Icon Mapping</button>
        </div>
    )
}
