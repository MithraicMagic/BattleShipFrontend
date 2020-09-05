import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { RensAlertContainer } from './rensAlert/rensAlert';
 
import './scss/general.scss';
import Main from './pages/Main';

export default class App extends Component {
  render() {
    return (
      <>
      <RensAlertContainer/>
      <Router>
        <Switch>
          <Route path={'/'} component={Main} />
        </Switch>
      </Router>
      </>
    )
  }
}
