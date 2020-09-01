import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './general.scss';
import Main from './pages/main/Main';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path={'/'} component={Main} />
        </Switch>
      </Router>
    )
  }
}
