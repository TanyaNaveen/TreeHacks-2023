import 'brace/mode/java'
import 'brace/theme/monokai'

import React, { Component } from 'react';
import AceEditor from 'react-ace';
export default class Main extends Component {
  render() {
    return (
      <div>
        <AceEditor mode="java" theme="monokai" />
      </div>
    );
  }
}