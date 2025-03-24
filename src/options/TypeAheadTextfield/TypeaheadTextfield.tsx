import React from 'react';
import Autosuggest, { InputProps } from 'react-autosuggest';
import { StandardEditorContext, StandardEditorProps } from '@grafana/data';
import './TypeaheadTextfield.css';
import { PanelSettings } from '../../types';
interface Props extends StandardEditorProps<string, PanelSettings> {
  item: any;
  value: string;
  onChange: (value?: string) => void;
  context: StandardEditorContext<any>;
}
interface State {
  item: any;
  value: string;
  onChange: (value?: string) => void;
  context: StandardEditorContext<any>;
  suggestions: string[];
}
export class TypeaheadTextField extends React.PureComponent<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
    let { value } = props;
    if (value === undefined) {
      value = props.item.defaultValue;
    }
    this.state = {
      ...props,
      value: value,
      suggestions: [],
    };
  }
  renderSuggestion(suggestion: string) {
    return <div>{suggestion}</div>;
  }
  getColumnNames() {
    let { data } = this.props.context;
    let series;
    let columnNames = [];
    if (data !== undefined && data.length > 0) {
      series = data[0].fields;
      for (const index in series) {
        const field = series[index];
        const { config, name } = field;
        if (config !== undefined && config.displayName !== undefined) {
          columnNames.push(config.displayName);
        } else {
          columnNames.push(name);
        }
      }
    }
    return columnNames;
  }
  onChange = (event: React.FormEvent<HTMLElement>, { newValue }: { newValue: string }) => {
    //TODO make this type nicer!
    const { path } = this.props.item;
    const { value } = event.currentTarget as HTMLInputElement;
    this.setState({
      value: value,
    });
    this.props.onChange.call(path, newValue);
  };
  getSuggestions = (value: string) => {
    let inputValue = '';
    if (value !== undefined) {
      return [];
    }
    if (value !== undefined && value !== null && value !== '') {
      inputValue = value.trim().toLowerCase();
    }
    const inputLength = inputValue.length;
    if (inputLength === 0 || inputValue === undefined) {
      return [];
    }
    return this.getColumnNames().filter((columnName) => columnName.toLowerCase().startsWith(inputValue));
  };
  onSuggestionsFetchRequested = (value: any) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };
  getSuggestionValue = (suggestion: string) => {
    return suggestion;
  };
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };
  render() {
    let { value } = this.props;
    if (value === undefined) {
      value = this.props.item.defaultValue;
    }
    const suggestions = this.getSuggestions(value);
    const inputProps: InputProps<string> = {
      placeholder: 'Enter column name...',
      value,
      onChange: this.onChange,
    };
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        theme={{
          input: 'input-small gf-form-input width-100',
          suggestion: 'suggestion',
        }}
      />
    );
  }
}
