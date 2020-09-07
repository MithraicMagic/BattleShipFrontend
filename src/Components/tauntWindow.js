
import React, { Component } from 'react'
import RensAlert from '../rensAlert/rensAlert';

import '../scss/taunt.scss';
import autobind from 'class-autobind';
import { DEFAULT_STYLE, MESSAGE_STYLE } from '../rensAlertStyles';
import socket from '../socket';

const State = { DOWN: 0, UP: 1 };

export default class tauntWindow extends Component {
    constructor(props) {
        super(props);
        autobind(this);
    
        this.state = {
            current: State.DOWN,
            sent: [],
            received: []
        };
    }

    componentDidMount() {
        socket.emit('getMessages');
        socket.on('messages', (data) => {
            this.setState({
                sent: data.sent,
                received: data.received
            });
        });

        socket.on('messageReceived', (msg) => {
            RensAlert.popup({ 
                title: 'Message Received',
                text: msg,
                ...MESSAGE_STYLE
            });
            received.push(msg);
        });
    }

    changeTo(state) {
        if (this.state.current === state) return;

        document.querySelector('.tauntWindow').classList.toggle('extended');
        this.setState({ current: state });
    }

    sendMessage() {
        const textBox = document.querySelector('form .tauntText');
        const msg = textBox.value;
        if (msg.length < 3 || msg.length > 100) {
            RensAlert.popup({
                title: 'Oops',
                text: 'Your message should be between 3 and 100 characters',
                ...DEFAULT_STYLE
            });
            return;
        } 

        socket.emit('sendMessage', { lobbyId: this.props.lobbyId, uid: socket.uid, message: msg });
        sent.push(msg);
        textBox.value = "";
    }

    render() {
        return (
            <div className="tauntWindow" onClick={() => this.changeTo(State.UP)}>
                <div className="close" onClick={() => this.changeTo(State.DOWN)}><span>Close</span></div>
                <div className="open">Click to Taunt</div>

                <form onSubmit={this.sendMessage}>
                    <input className="tauntText" type="text" placeholder="Taunt your opponent"/>
                    <input type="submit" value="Send"/>
                </form>
            </div>
        )
    }
}
