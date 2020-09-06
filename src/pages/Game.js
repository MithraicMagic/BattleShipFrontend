import React, { Component, Fragment } from 'react';
import socket from '../socket';
import rensalert from '../rensAlert/rensAlert';
import '../scss/game.scss';
import Boat, {BOATTYPE, BOATDATA} from '../Components/Boat';
import Grid from '../Components/Grid';
import autobind from 'class-autobind';

export default class Game extends Component {
    constructor(props) {
        super(props);

        const mainState = this.props.location.state;
        this.state = {
            ...mainState, 
            setBoats: [],
            currentBoat: null
        };

        autobind(this);
    }

    componentDidMount() {
        socket.onStateSwitch = () => { this.forceUpdate(); }

        socket.on('reconnect', (data) => {
            this.setState({
                lobbyId: data.lobbyId,
                username: data.me,
                otherUsername: data.opponent,
                leader: data.leader
            });
        });

        socket.on('opponentLeft', () => {
            rensalert.accept({ title: "Oh no!", text: "Your opponent has disconnected 😭", accept: 'Okay :(', onAccept: () => this.props.history.push('/')});
        });

        document.addEventListener('mousemove', this.updateMousePos);
        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('keydown', this.rotateShip);
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.updateMousePos);
        document.removeEventListener('mousedown', this.onMouseDown);
        document.removeEventListener('keydown', this.rotateShip);
    }

    updateMousePos(m) {
        if (this.state.currentBoat) {
            const gridPos = document.getElementById('grid').getBoundingClientRect();
            if (m.pageY > gridPos.top && m.pageX > gridPos.left && m.pageY < gridPos.top + gridPos.height && m.pageX < gridPos.left + gridPos.width) {
                const yCell = Math.floor((m.pageY - gridPos.top)/50);
                const xCell = Math.floor((m.pageX - gridPos.left)/50);

                const boat = this.state.currentBoat;
                const boatData = BOATDATA.get(this.state.currentBoat.type);

                const startX = boat.orientation === 1 ? xCell : xCell - Math.floor((boatData.size-.01)/2);
                const startY = boat.orientation === 0 ? yCell : yCell - Math.floor((boatData.size-.01)/2);

                document.querySelectorAll('.grid-cell').forEach(cell => {
                    cell.classList.remove(boatData.class);
                });

                for (let i = 0; i < boatData.size; i++) {
                    console.log('x:' + (boat.orientation === 1 ? startX : startX + i) + '-y:' + (boat.orientation === 0 ? startY : startY + i));
                    const cell = document.getElementById('x:' + (boat.orientation === 1 ? startX : startX + i) + '-y:' + (boat.orientation === 0 ? startY : startY + i));
                    if (cell) cell.classList.add(boatData.class);
                }
            }
        }
    }

    onMouseDown(m) {
        if (this.state.currentBoat) {
            const el = this.state.currentBoat.element;

            if (m.button === 2) {
                el.classList.remove('active');
                this.setState({currentBoat: null});
            }

            el.classList.remove('active');
            this.setState({currentBoat: null});
        } else {
            if (!m.target.classList.contains('cell') || !m.target.parentElement.classList.contains('boat')) return;
            this.setState({ currentBoat: { element: m.target.parentElement, type: Number(m.target.parentElement.getAttribute('boattype')), orientation: 1 } });
            m.target.parentElement.classList.add('active');
        }
    }

    rotateShip(k) {
        if (k.key === 'r' && this.state.currentBoat) {
            this.setState({currentBoat: {...this.state.currentBoat, orientation: this.state.currentBoat.orientation === 0 ? 1 : 0}});
        }
    }

    submitSetup() {

    }

    getCurrentView() {
        switch (socket.state) {
            case "Setup":
                return (
                    <Fragment>
                        <div className="info">
                            <h1>Setup Phase</h1>
                            <h2>Put all of your boats on the grid and press the button</h2>
                        </div>
                        <div className="setup-area" onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}>
                            <Grid id="grid"/>
                            <div className="boats">
                                <Boat boatType={BOATTYPE.AIRCRAFT_CARRIER}></Boat>
                                <Boat boatType={BOATTYPE.BATTLESHIP}></Boat>
                                <Boat boatType={BOATTYPE.CRUISER}></Boat>
                                <Boat boatType={BOATTYPE.SUBMARINE}></Boat>
                                <Boat boatType={BOATTYPE.MINESWEEPER}></Boat>
                            </div>
                        </div>
                        <button onClick={this.submitSetup}>Submit</button>
                    </Fragment>
                )
            case "OpponentReconnecting":
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