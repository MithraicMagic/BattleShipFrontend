import React, { Component } from 'react';
import socket from '../socket';
import rensalert from '../rensAlert/rensAlert';
import '../scss/game.scss';
import Boat, {BOATTYPE} from '../Components/Boat';
import Grid from '../Components/Grid';

const State = {
    YOUR_TURN: 1,
    OPPONENT_TURN: 2,
    SETUP: 3,
    OPPONENT_RECONNECTING: 4
};

export default class Game extends Component {
    constructor(props) {
        super(props);

        const mainState = this.props.location.state;
        mainState.current = State.SETUP;
        this.state = mainState;
    }

    componentDidMount() {
        socket.on('reconnect', (data) => {
            this.setState({
                current: data.gameState,
                lobbyId: data.lobbyId,
                username: data.me,
                otherUsername: data.opponent,
                leader: data.leader
            });
        });

        socket.on('opponentReconnecting', () => {
            this.setState({previous: this.state.current, current: State.OPPONENT_RECONNECTING});
        });

        socket.on('opponentReconnected', () => {
            this.setState({current: this.state.previous});
        });

        socket.on('opponentLeft', () => {
            rensalert.accept({ title: "Oh no!", text: "Your opponent has disconnected 😭", accept: 'Oke :(', onAccept: () => this.props.history.push('/')});
        });
    }

    getCurrentView() {
        switch (this.state.current) {
            case State.SETUP:
                return (
                    <div className="game-page">
                        <div className="info">
                            <h1>Setup Phase</h1>
                            <h2>Put all of your boats on the grid and press the button</h2>
                        </div>
                        <div className="setup-area">
                            <Grid />
                            <div className="boats">
                                <Boat boatType={BOATTYPE.AIRCRAFT_CARRIER}></Boat>
                                <Boat boatType={BOATTYPE.BATTLESHIP}></Boat>
                                <Boat boatType={BOATTYPE.CRUISER}></Boat>
                                <Boat boatType={BOATTYPE.MINESWEEPER}></Boat>
                                <Boat boatType={BOATTYPE.SUBMARINE}></Boat>
                            </div>
                        </div>
                    </div>
                )
            case State.OPPONENT_RECONNECTING:
                return <h1>Your opponent is reconnecting... <span role="img" aria-label="ANXIOUS!">😰</span></h1>;
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