import React, { Component } from 'react'
import Socket from '../../socket';

import '../../scss/main.scss';
import autobind from 'class-autobind';

const State = {
    ENTER_USERNAME: 0,
    ENTER_CODE: 1,
    IN_LOBBY: 2
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
                otherUsername: data.otherName
            });
        });

        Socket.on('reconnect', (data) => {
            this.setState({
                current: State.IN_LOBBY,
                lobbyId: data.lobbyId,
                username: data.me,
                otherUsername: data.opponent
            });
        });
    }

    onSubmitUsername() {
        Socket.emit('inputUsername', document.getElementById('username').value);
    }

    onSumbitCode() {
        Socket.emit('tryCode', document.getElementById('code').value);
    }

    render() {
        if (!this.state.username) {
            return (
                <div className="main-page">
                    <div>
                        <h2>Enter your desired username!</h2>
                        <input type="text" id="username"></input>
                        <button onClick={this.onSubmitUsername}>Submit</button>
                    </div>
                </div>
            )
        }
        if (this.state.lobbyId) {
            return (
                <div className="main-page">
                    {this.state.otherUsername ? <h1>You are connected to {this.state.otherUsername}!</h1> : <h1>You are connected to someone!</h1>}
                </div>
            )
        }
        return (
            <div className="main-page">
                {this.state.lobbyCode ? <h1>Your code is: {this.state.lobbyCode}</h1> : <h1>Uhmm.. awkward (waiting for code)</h1>}
                <div>
                    <h2>Enter a friend's code here!</h2>
                    <input type="text" id="code"></input>
                    <button onClick={this.onSumbitCode}>Try Code</button>
                </div>
            </div>
        )
    }
}
