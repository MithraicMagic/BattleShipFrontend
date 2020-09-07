import React, { Component, Fragment } from 'react'
import socket from '../socket';

import '../scss/main.scss';
import autobind from 'class-autobind';
import rensalert from '../rensAlert/rensAlert';
import { withRouter } from 'react-router-dom';

import { DEFAULT_STYLE } from '../rensAlertStyles';

class Main extends Component {
    constructor(props) {
        super(props);
        autobind(this);
    
        this.state = {};
        this.copyPopupTimeout = null;
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

            const joinCode = new URL(window.location.href).searchParams.get('code');
            if (joinCode != null) {
                document.getElementById('code').value = joinCode;
                this.tryCode();
            }

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
            rensalert.popup({ 
                title: "Oh no!", 
                text: "Your opponent has disconnected 😭", 
                ...DEFAULT_STYLE
            });
        });

        socket.on('setupStarted', () => this.props.history.push('/setup'));
    }

    componentWillUnmount() {
        socket.removeListeners();
        if (this.copyPopupTimeout) clearTimeout(this.copyPopupTimeout);
    }

    submitUsername() {
        const name = document.getElementById('username').value.trimLeft().trimRight();
        if (!name || name.length < 4) {
            rensalert.popup({ 
                title: 'Oopsie!', 
                text: 'Please enter a username that is longer than 4 characters', 
                ...DEFAULT_STYLE
            });
            return;
        }
        if (name.length > 20) {
            rensalert.popup({ 
                title: 'Oopsie!',
                text: 'Please enter a username that is shorter than 20 characters', 
                ...DEFAULT_STYLE
            });
            return;
        }
        socket.emit('inputUsername', document.getElementById('username').value);
    }

    tryCode() {
        socket.emit('tryCode', document.getElementById('code').value);
    }

    emitStart() {
        socket.emit('startSetup', this.state.lobbyId);
    }

    async onCodeClick() {
        await navigator.clipboard.writeText(
            `${process.env.REACT_APP_BASE_URL}/?code=${this.state.playerCode}`
        );

        document.querySelector('.copyPopup').classList.add('visible');
        this.copyPopupTimeout = setTimeout(() => {
            const copyPopup = document.querySelector('.copyPopup');
            if (copyPopup) copyPopup.classList.remove('visible');
        }, 2000);
    }

    getCurrentView() {
        switch (socket.state) {
            case "EnterName":
                return (
                    <div>
                        <h2>Enter your desired username!</h2>
                        <input type="text" id="username" autoComplete="off" data-lpignore="true" onKeyDown={(k) => k.key === 'Enter' ? this.submitUsername() : null}></input>
                        <button onClick={this.submitUsername}>Submit</button>
                    </div>
                );
            case "Available":
                return (
                    <Fragment>
                        <div className="top">
                            <h1>Hey, {this.state.username}!</h1>
                            <h2>
                                Your code is: <span className="code" onClick={this.onCodeClick}>{this.state.playerCode}</span>
                                <div className="copyPopup"><p>Code copied to clipboard</p></div>
                            </h2>
                        </div>
                        <div>
                            <h2>Enter a friend's code here</h2>
                            <input type="text" id="code" autoComplete="off" onKeyDown={(k) => k.key === 'Enter' ? this.tryCode() : null}></input>
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