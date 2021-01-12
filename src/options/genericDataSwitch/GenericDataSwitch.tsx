import React from 'react';
import { Switch } from '@grafana/ui';
import { IntSwitch } from 'types';

interface StandardEditorProps {
  item: any;
  value: IntSwitch;
  onChange: any;
  context: any;
}

function onChangeOverride(value: IntSwitch, onChange: any, item: any) {
  value.value = !value.value;
  onChange.call(item.path, value);
}

export const GenericDataSwitch: React.FC<StandardEditorProps> = ({ item, value, onChange, context }) => {
  if (context.options[item.path] === undefined) {
    context.options[item.path] = item.defaultValue;
  }

  return (
    <div>
      <Switch
        value={context.options[item.path].value}
        css={{}}
        onChange={() => onChangeOverride(value, onChange, item)}
      />
    </div>
  );
};
