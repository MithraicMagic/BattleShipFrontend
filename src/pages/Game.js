import React, { Component, Fragment } from 'react';
import socket from '../socket';
import { BOATDATA } from '../Components/Boat';
import Grid from '../Components/Grid';
import autobind from 'class-autobind';
import '../scss/game.scss';
import rensAlert from '../rensAlert/rensAlert';
import { DEFAULT_STYLE, NON_TIMED } from '../rensAlertStyles';

export default class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            boats: []
        }

        autobind(this);
    }

    componentDidMount() {
        socket.onStateSwitch = () => {
            if (socket.state === "OpponentReconnecting") {
                rensAlert.popup({
                    title: "Oh Noes!",
                    text: "Your opponent is reconnecting... 😰",
                    ...DEFAULT_STYLE
                });
                return;
            }
            this.forceUpdate();
        }

        socket.emit('getGameData', socket.uid)
        socket.on('gameData', (data) => {
            this.setState({
                lobbyId: data.lobbyId,
                username: data.me,
                otherUsername: data.opponent,
                leader: data.leader
            });
            this.placeBoats(data.boatData);
            this.setTiles(data.hitData, data.missData);
        });

        socket.on('shotFired', data => {
            if (data.hitShip) {
                this.registerShot(true, true, data.pos);
                if (data.destroyedShip) {
                    rensAlert.popup({title: 'WOOHOO!', text: 'You hit and destroyed a ship! 🔥🚢🔥', ...DEFAULT_STYLE});
                    return;
                }
                rensAlert.popup({title: 'Yay!', text:'You hit a ship! 🔥🚢', ...DEFAULT_STYLE})
            } else {
                this.registerShot(true, false, data.pos);
                rensAlert.popup({title: 'Aww...', text:'You missed 😢', ...DEFAULT_STYLE});              
            }
        });

        socket.on('gotShot', data => {
            if (data.hitShip) {
                this.registerShot(false, true, data.pos);
                if (data.destroyedShip) {
                    rensAlert.popup({title: 'OH MY FUKCING GOD! JESUS CHRIST!', text: 'One of your ships was hit and destroyed! 😭', ...DEFAULT_STYLE});
                    return;
                }
                rensAlert.popup({title: 'Oh no!', text:'One of your ships was hit.. 😢', ...DEFAULT_STYLE})
            } else {
                this.registerShot(false, false, data.pos);
                rensAlert.popup({title: 'Hehehe', text:'Your opponent missed! 😈', ...DEFAULT_STYLE})
            }
        });

        socket.on('lobbyLeft', () => {
            this.props.history.push('/');
        });

        socket.on('opponentLeft', () => {
            rensAlert.accept({
                title: "Oh no!", text: "Your opponent has disconnected 😭", accept: 'Okay :(',
                onAccept: () => this.props.history.push('/'), ...NON_TIMED
            });
        });
    }

    placeBoats(data) {
        data.forEach(boat => {
            const localBoat = boat;

            BOATDATA.forEach((k, v) => k.class === localBoat.name ? localBoat.type = v : null);
            let boatData = BOATDATA.get(localBoat.type);

            localBoat.orientation = boat.horizontal ? 0 : 1;

            const startX = localBoat.orientation === 1 ? boat.pos.i : boat.pos.i - Math.floor((boatData.size - .01) / 2);
            const startY = localBoat.orientation === 0 ? boat.pos.j : boat.pos.j - Math.floor((boatData.size - .01) / 2);

            for (let i = 0; i < boatData.size; i++) {
                const cell = document.getElementById('player-x:' + (localBoat.orientation === 1 ? startX : startX + i) + '-y:' + (localBoat.orientation === 0 ? startY : startY + i));

                //Check if there is already another boat active on this tile
                if (cell) {
                    cell.classList.add(boatData.class);
                }
            }

            this.setState({ boats: [...this.state.boats, localBoat] });
        });
    }

    setTiles(hits, misses) {
        hits.player.forEach(hit => this.registerShot(true, true, hit));
        hits.opponent.forEach(hit => this.registerShot(false, true, hit));
        misses.player.forEach(miss => this.registerShot(true, false, miss));
        misses.opponent.forEach(miss => this.registerShot(false, false, miss));
    }

    registerShot(myShot, hit, location) {
        const cellId = (myShot ? 'opponent-' : 'player-') + 'x:' + location.i + '-y:' + location.j;
        const cell = document.getElementById(cellId);

        if (myShot) {
            if (hit) {
                cell.classList.add('hit');
            } else {
                cell.classList.add('missed');
            }
        } else {
            cell.innerHTML = '<svg viewBox="0 0 500 500"><path d="M 0 50 L 0 0 L 50 0 L 250 200 L 450 0 L 500 0 L 500 50 L 300 250 L 500 450 L 500 500 L 450 500 L 250 300 L 50 500 L 0 500 L 0 450 L 200 250 Z" /></svg> ';
        }
    }

    getCurrentView() {
        switch (socket.state) {
            case "YourTurn":
                return (
                    <div className="info">
                        <h1>It's your turn!</h1>
                        <h2>Click on a tile on the opponent grid to fire</h2>
                    </div>
                )
            case "OpponentTurn":
                return (
                    <div className="info">
                        <h1>It's the opponent's turn</h1>
                        <h2>Waiting for opponent to shoot one of your tiles...</h2>
                    </div>
                )
            case "GameWon": 
                return(
                    <div className="info">
                        <h1>You won the game!</h1>
                        <h2>You destroyed all of the opponent's ships!</h2>
                    </div>
                )
            case "GameLost": 
                return(
                    <div className="info">
                        <h1>You lost <span role="img" aria-label="ULTRASAD!">😭</span></h1>
                        <h2>Your opponent destroyed all of your ships...</h2>
                    </div>
                )
            default:
                return <h1>Oopsie whoopsie, unknown state <span role="img" aria-label="SAD!">😔</span></h1>;
        }
    }

    showGrid() {
        return (
            <Fragment>
                <div className="game-area">
                    <Grid id="player-grid" gridPlayer={'player'} />
                    <Grid id="opponent-grid" className={socket.state === "YourTurn" ? 'active' : ''} gridPlayer={'opponent'} lobbyId={this.state.lobbyId} />
                </div>
            </Fragment>
        )
    }

    render() {
        return (
            <div className="game-page">
                <button onClick={() => socket.submitLeave(this.state.lobbyId)}>Leave</button>
                {this.getCurrentView()}
                {this.showGrid()}
                <div></div>
            </div>
        )
    }
}
