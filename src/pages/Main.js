import React, { Component, Fragment } from 'react'
import socket from '../socket';

import '../scss/main.scss';
import autobind from 'class-autobind';
import rensalert from '../rensAlert/rensAlert';
import { withRouter } from 'react-router-dom';

class Main extends Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {};
    }

    componentDidMount() {
        socket.onStateSwitch = () => { this.forceUpdate(); }

        socket.emit('getNameData', socket.uid);
        socket.on('nameData', (data) => {
            this.setState({
                playerCode: data.code,
                username: data.me
            });
        });

        socket.on('nameAccepted', (data) => {
            socket.setUid(data.uid);
            this.setState({
                playerCode: data.code,
                username: data.name
            });
        });

        socket.on('lobbyJoined', (data) => {
            this.setState({
                lobbyId: data.id,
                otherUsername: data.otherName,
                leader: data.leader
            });
        });

        socket.on('reconnectLobby', (data) => {
            this.setState({
                lobbyId: data.lobbyId,
                username: data.me,
                otherUsername: data.opponent,
                leader: data.leader
            });
        });

        socket.on('opponentLeft', () => {
            rensalert.popup({ title: "Oh no!", text: "Your opponent has disconnected 😭" });
        });

        socket.on('gameStarted', () => this.props.history.push('/game'));
    }

    componentWillUnmount() {
        socket.removeListeners();
    }

    submitUsername() {
        const name = document.getElementById('username').value.trimLeft().trimRight();
        if (!name || name.length < 4) {
            rensalert.popup({ title: 'Oopsie!', text: 'Please enter a username that is longer than 4 characters', time: 4000 });
            return;
        }
        if (name.length > 20) {
            rensalert.popup({ title: 'Oopsie!', text: 'Please enter a username that is shorter than 20 characters', time: 4000 });
            return;
        }
        socket.emit('inputUsername', document.getElementById('username').value);
    }

    tryCode() {
        socket.emit('tryCode', document.getElementById('code').value);
    }

    emitStart() {
        socket.emit('startGame', this.state.lobbyId);
    }

    getCurrentView() {
        switch (socket.state) {
            case "EnterName":
                return (
                    <div>
                        <h2>Enter your desired username!</h2>
                        <input type="text" id="username" autoComplete="off" data-lpignore="true"></input>
                        <button onClick={this.submitUsername}>Submit</button>
                    </div>
                );
            case "Available":
                return (
                    <Fragment>
                        <div>
                            <h1>Hey, {this.state.username}!</h1>
                            <h2>Your code is: {this.state.playerCode}</h2>
                        </div>
                        <div>
                            <h2>Enter a friend's code here</h2>
                            <input type="text" id="code" autoComplete="off"></input>
                            <button onClick={this.tryCode}>Try Code</button>
                        </div>
                    </Fragment>
                );
            case "Lobby":
                return (
                    <div className="lobby">
                        <h1>You are connected to {this.state.otherUsername}!</h1>

                        {this.state.leader ? <button onClick={this.emitStart}>Start Game</button> : null}
                    </div>
                );
            case "OpponentReconnecting":
                return <h1>Your opponent is reconnecting... <span role="img" aria-label="ANXIOUS!">😰</span></h1>;
            default:
                return <h1>Oopsie whoopsie, unknown state <span role="img" aria-label="SAD!">😔</span></h1>;
        }
    }

    render() {
        return (
            <div className="main-page">
                {this.getCurrentView()}
            </div>
        );
    }
}

export default withRouter(Main);