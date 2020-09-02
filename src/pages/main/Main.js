import React, { Component } from 'react'
import io from 'socket.io-client';

import './main.scss';

const socket = io(process.env.REACT_APP_URL, {path: '/sockets'});

export default class Main extends Component {
    constructor(props) {
        super();

        this.state = {};
    }

    componentDidMount() {
        socket.on('playerCode', (data) => this.setState({lobbyCode: data.data}));
        socket.on('lobbyId', (data) => this.setState({lobbyId: data.data}));
        socket.on('otherUsername', (data) => this.setState({otherUsername: data.data}));
        socket.on('message', (message) => console.log(message));
    }
    
    render() {
        if (!this.state.username) {
            return (
                <div className="main-page">
                    <h2>Enter your desired username!</h2>
                    <input type="text" id="username"></input>
                    <button onClick={() => {
                        socket.emit('inputUsername', document.getElementById('username').value);
                        this.setState({username: document.getElementById('username').value});
                    }}>Submit</button>
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
                    <button onClick={() => socket.emit('tryCode', document.getElementById('code').value)}>Try Code</button>
                </div>
            </div>
        )
    }
}
