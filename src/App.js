import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import RensAlert, { RensAlertContainer } from './rensAlert/rensAlert';

import './scss/general.scss';
import Main from './pages/Main';
import Setup from './pages/Setup';
import Game from './pages/Game';
import Settings from './pages/SingleplayerSettings';
import TauntWindow from './Components/tauntWindow';
import { DEFAULT_STYLE } from './rensAlertStyles';
import Documentation from './pages/Documentation';

export default class App extends Component {
  constructor(props) {
    super(props);
    RensAlert.setDefaultOptions(DEFAULT_STYLE);
  }

  render() {
    return (
      <>
        <RensAlertContainer ref={RensAlert.container}/>
        <Router>
          <Switch>
            <Route path={'/game'} component={Game} />
            <Route path={'/setup'} component={Setup} />
            <Route path={'/settings'} component={Settings} />
            <Route path={'/documentation'} component={Documentation} />
            <Route path={'/'} component={Main} />
          </Switch>
        </Router>
        <TauntWindow/>
      </>
    )
  }
}
