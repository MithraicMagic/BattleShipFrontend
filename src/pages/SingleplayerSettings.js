import React, { Component } from 'react'
import socket from '../socket'

import '../scss/settings.scss';
import autobind from 'class-autobind';
import { withRouter } from 'react-router-dom';

const difficulties = new Map([
    [ "1", "Easy" ], [ "2", "Medium" ], [ "3", "Hard" ]
]);

class SingleplayerSettings extends Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            difficulty: '2',
            time: '1000'
        };
    }

    componentDidMount() {
        socket.onStateSwitch = () => { 
            if (socket.state === "Lobby") {
                this.props.history.push("/");
                return;
            }

            this.forceUpdate(); 
        }
    }
    
    componentWillUnmount() {
        socket.removeListeners();
    }

    onSubmit(e) {
        e.preventDefault();

        socket.emit('startSinglePlayerLobby', { uid: socket.uid, difficulty: this.state.difficulty, time: this.state.time });
    }

    onSliderChange(e) {
        this.setState({ difficulty: e.target.value });
    }

    onTimeChange(e) {
        this.setState({ time: e.target.value });
    }

    render() {
        return (
            <div className="settings">
                <h1>Settings</h1>

                <form onSubmit={this.onSubmit}>
                    <h3>Difficulty: {difficulties.get(this.state.difficulty)}</h3>
                    <input className="slider" type="range" min="1" max="3" value={this.state.difficulty} onChange={this.onSliderChange}/>

                    <h3>AI Delay</h3>
                    <input type="number" min="100" max="10000" step="100" value={this.state.time} onChange={this.onTimeChange} />

                    <input type="submit" value="Start"/>
                </form>
            </div>
        )
    }
}

export default withRouter(SingleplayerSettings);
