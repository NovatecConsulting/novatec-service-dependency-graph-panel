import React from 'react';
import Autosuggest from 'react-autosuggest';
import { StandardEditorProps } from '@grafana/data';
import './TypeaheadTextfield.css';
import { PanelSettings } from '../../types';

interface Props extends StandardEditorProps<string, PanelSettings> {
  item: any;
  value: string;
  onChange: (value?: string) => void;
  context: any;
}

interface State {
  item: any;
  value: string;
  onChange: (value?: string) => void;
  context: any;
  suggestions: string[];
}

export class TypeaheadTextField extends React.PureComponent<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
      ...props,
      suggestions: [],
    };
  }

  renderSuggestion(suggestion: any) {
    return <div>{suggestion}</div>;
  }

  getColumns() {
    var { data } = this.props.context;
    var series;
    var columnNames = [];
    if (data !== undefined && data.length > 0) {
      series = data[0].fields;
      for (const index in series) {
        const field = series[index];
        if (field.config !== undefined && field.config.displayName !== undefined) {
          columnNames.push(field.config.displayName);
        } else {
          columnNames.push(field.name);
        }
      }
    }
    return columnNames;
  }

  onChange = (event: any, { newValue, method }: any) => {
    this.setState({
      value: event.currentTarget.value,
    });
    this.props.onChange.call(this.props.item.path, newValue);
  };

  getSuggestions = (value: any) => {
    var inputValue = '';
    if (value.value !== undefined) {
      return [];
    }
    if (value !== undefined && value !== null && value !== '') {
      inputValue = value.trim().toLowerCase();
    }
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : this.getColumns().filter(column => column.toLowerCase().slice(0, inputLength) === inputValue);
  };

  onSuggestionsFetchRequested = (value: any) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  getSuggestionValue = (suggestion: any) => {
    return suggestion;
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    var value = this.props.value;
    if (value === undefined) {
      value = '';
    }

    const suggestions = this.getSuggestions(value);

    const inputProps = {
      placeholder: 'Enter cloumn name...',
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
