import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import RensAlert, { RensAlertContainer } from './rensAlert/rensAlert';

import './scss/general.scss';
import Main from './pages/Main';
import Setup from './pages/Setup';
import Game from './pages/Game';
import Settings from './pages/SingleplayerSettings';
import BigError from './pages/BigError';
import TauntWindow from './Components/tauntWindow';
import VideoPlayer from './Components/videoPlayer';
import { DEFAULT_STYLE } from './rensAlertStyles';
import Documentation from './pages/Documentation';
import Login from './pages/Login';
import Socket from './socket';

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
            <Route exact path={'/game'} component={Game} />
            <Route exact path={'/setup'} component={Setup} />
            <Route exact path={'/settings'} component={Settings} />
            <Route exact path={'/login'} component={Login} />
            <Route exact path={'/documentation'} component={Documentation} />
            <Route exact path={'/'} component={Main} />
            <Route path={'*'} component={BigError} />
          </Switch>
        </Router>
        <TauntWindow/>
        <VideoPlayer ref={Socket.videoPlayer}/>
      </>
    )
  }
}
