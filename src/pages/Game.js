import React, { Component } from 'react';
import socket from '../socket';

export default class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    getCurrentView() {
        switch(socket.state) {
            case "YourTurn":
                return (
                    <div>It's your turn!</div>
                )
            case "OpponentTurn":
                return (
                    <div>It's your opponent's turn</div>
                )
            default:
                return <h1>Oopsie whoopsie, unknown state <span role="img" aria-label="SAD!">😔</span></h1>;
        }
    }

    render() {
        return (
            <div className="game-page">
                {this.getCurrentView()}
            </div>
        )
    }
}
