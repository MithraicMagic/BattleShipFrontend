import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { RensAlertContainer } from './rensAlert/rensAlert';

import './scss/general.scss';
import Main from './pages/Main';
import Setup from './pages/Setup';
import Game from './pages/Game';
import TauntWindow from './Components/tauntWindow';

export default class App extends Component {
  render() {
    return (
      <>
        <RensAlertContainer />
        <Router>
          <Switch>
            <Route path={'/game'} component={Game} />
            <Route path={'/setup'} component={Setup} />
            <Route path={'/'} component={Main} />
          </Switch>
        </Router>
        <TauntWindow/>
      </>
    )
  }
}
