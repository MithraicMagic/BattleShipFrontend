import React, { Component, Fragment } from 'react'
import Socket from '../socket';

import '../scss/main.scss';
import autobind from 'class-autobind';
import rensalert from '../rensAlert/rensAlert';

const State = {
    ENTER_USERNAME: 0,
    ENTER_CODE: 1,
    IN_LOBBY: 2,
    OPPONENT_RECONNECTING: 3
};

export default class Main extends Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            current: State.ENTER_USERNAME,
        };
    }

    componentDidMount() {
        Socket.on('nameAccepted', (data) => {
            Socket.setUid(data.uid);
            this.setState({
                current: State.ENTER_CODE,
                lobbyCode: data.code,
                username: data.name
            });
        });

        Socket.on('lobbyJoined', (data) => {
            this.setState({
                current: State.IN_LOBBY,
                lobbyId: data.id,
                otherUsername: data.otherName,
                leader: data.leader
            });
        });

        Socket.on('reconnect', (data) => {
            this.setState({
                current: State.IN_LOBBY,
                lobbyId: data.lobbyId,
                username: data.me,
                otherUsername: data.opponent,
                leader: data.leader
            });
        });

        Socket.on('opponentReconnecting', () => {
            this.setState({ current: State.OPPONENT_RECONNECTING });
        });

        Socket.on('opponentReconnected', () => {
            this.setState({ current: State.IN_LOBBY });
        });
    }

    onSubmitUsername() {
        const name = document.getElementById('username').value.trimLeft().trimRight();
        if (!name || name.length < 4) {
            rensalert.popup({title: 'Oopsie!', text: 'Please enter a username that is longer than 4 characters', time: 4000});
            return;
        }
        if (name.length > 20) {
            rensalert.popup({title: 'Oopsie!', text: 'Please enter a username that is shorter than 20 characters', time: 4000});
            return;
        }
        Socket.emit('inputUsername', document.getElementById('username').value);
    }

    onSumbitCode() {
        Socket.emit('tryCode', document.getElementById('code').value);
    }

    getCurrentView() {
        switch(this.state.current) {
            case State.ENTER_USERNAME:
                return (
                    <div>
                        <h2>Enter your desired username!</h2>
                        <input type="text" id="username" autoComplete="off" data-lpignore="true"></input>
                        <button onClick={this.onSubmitUsername}>Submit</button>
                    </div>
                );
            case State.ENTER_CODE:
                return (
                    <Fragment>
                        <div>
                            <h1>Hey, {this.state.username}!</h1>
                            <h2>Your code is: {this.state.lobbyCode}</h2>
                        </div>
                        <div>
                            <h2>Enter a friend's code here</h2>
                            <input type="text" id="code" autoComplete="off"></input>
                            <button onClick={this.onSumbitCode}>Try Code</button>
                        </div>
                    </Fragment>
                );
            case State.IN_LOBBY:
                return (
                    <div className="lobby">
                        <h1>You are connected to {this.state.otherUsername}!</h1>

                        {this.state.leader ? <button>Start Game</button> : ''}
                    </div>
                );
            case State.OPPONENT_RECONNECTING:
                return <h1>Your opponent is reconnecting...</h1>;
            default:
                return <h1>Oops unknown state :(</h1>;
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
