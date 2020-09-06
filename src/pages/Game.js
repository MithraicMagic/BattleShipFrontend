import React, { Component, Fragment } from 'react';
import socket from '../socket';
import rensalert from '../rensAlert/rensAlert';
import '../scss/game.scss';
import Boat, { BOATTYPE, BOATDATA } from '../Components/Boat';
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
            rensalert.accept({ title: "Oh no!", text: "Your opponent has disconnected 😭", accept: 'Okay :(', onAccept: () => this.props.history.push('/') });
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

            //Check if mouse is on the grid
            if (m.pageY > gridPos.top && m.pageX > gridPos.left && m.pageY < gridPos.top + gridPos.height && m.pageX < gridPos.left + gridPos.width) {

                //If boat was not on board yet, now it is
                if (!this.state.currentBoat.onBoard) {
                    this.setState({ currentBoat: { ...this.state.currentBoat, onBoard: true } });
                }

                //Calculate on which tile the mouse is currently hovering
                const yCell = Math.floor((m.pageY - gridPos.top) / 50);
                const xCell = Math.floor((m.pageX - gridPos.left) / 50);

                const boat = this.state.currentBoat;
                const boatData = BOATDATA.get(boat.type);

                const startX = boat.orientation === 1 ? xCell : xCell - Math.floor((boatData.size - .01) / 2);
                const startY = boat.orientation === 0 ? yCell : yCell - Math.floor((boatData.size - .01) / 2);

                //Remove boat from other tiles on the grid
                document.querySelectorAll('.grid-cell').forEach(cell => {
                    if (cell.classList.contains(boatData.class)) {
                        cell.classList.remove(boatData.class, 'active');
                        if (cell.getAttribute('boattype') === boatData.class) cell.removeAttribute('boattype');
                    }
                });

                //Add the boat to tiles on the grid
                for (let i = 0; i < boatData.size; i++) {
                    const cell = document.getElementById('x:' + (boat.orientation === 1 ? startX : startX + i) + '-y:' + (boat.orientation === 0 ? startY : startY + i));

                    //Check if there is already another boat active on this tile
                    if (cell && !cell.classList.contains('active')) {
                        cell.classList.add(boatData.class, 'active');
                        cell.setAttribute('boattype', boatData.class);
                    }
                }
            } else {
                //If the boat was on board, now it is not anymore
                if (this.state.currentBoat.onBoard) {
                    this.setState({ currentBoat: { ...this.state.currentBoat, onBoard: false } });
                }

                //Remove boat from grid
                const boatData = BOATDATA.get(this.state.currentBoat.type);
                document.querySelectorAll('.grid-cell').forEach(cell => {
                    cell.classList.remove(boatData.class);
                    if (cell.getAttribute('boattype') === boatData.class) cell.removeAttribute('boattype');
                });
            }
        }
    }

    onMouseDown(m) {
        if (this.state.currentBoat) {
            const el = this.state.currentBoat.element;

            //If the right mouse button was clicked, or if the boat was placed outside of the board
            if (m.button === 2 || !this.state.currentBoat.onBoard) {
                el.classList.remove('active', 'placed');

                //Remove boat from the grid
                document.querySelectorAll('.grid-cell').forEach(cell => {
                    cell.classList.remove(BOATDATA.get(this.state.currentBoat.type).class);
                    if (cell.getAttribute('boattype') === BOATDATA.get(this.state.currentBoat.type).class) cell.removeAttribute('boattype');
                });

                this.setState({ currentBoat: null });
                return;
            }

            el.classList.remove('active');
            el.classList.add('placed');

            //Add placed boat to setBoats
            this.setState({ currentBoat: null, setBoats: [...this.state.setBoats, this.state.currentBoat] });
        } else {
            //If the clicked element is a boat that is on the grid
            if (m.target.parentElement.classList.contains('grid') && m.target.getAttribute('boattype')) {
                //Get boat from setBoats
                const boat = this.state.setBoats.find((b) => BOATDATA.get(b.type).class === m.target.getAttribute('boattype'));

                //Revert styling of boat in boat area
                boat.element.classList.add('active');
                boat.element.classList.remove('placed');

                //Set boat as currently editing boat and remove from setBoats
                this.setState({ currentBoat: boat, setBoats: this.state.setBoats.filter((b) => BOATDATA.get(b.type).class !== m.target.getAttribute('boattype')) });
                return;
            }

            //If one of the boats in the boat area is clicked
            if (m.target.classList.contains('cell') || m.target.parentElement.classList.contains('boat') || !m.target.parentElement.classList.contains('placed')) {
                //Get information from boat element that was clicked
                this.setState({ currentBoat: { element: m.target.parentElement, type: Number(m.target.parentElement.getAttribute('boattype')), orientation: 1, onBoard: false } });
                m.target.parentElement.classList.add('active');
            }
        }
    }

    rotateShip(k) {
        //If the R button is pressed, rotate currently editing boat
        if (k.key === 'r' && this.state.currentBoat) {
            this.setState({ currentBoat: { ...this.state.currentBoat, orientation: this.state.currentBoat.orientation === 0 ? 1 : 0 } });
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
                            <h1>Setup Fase</h1>
                            <h2>Put all of your boats on the grid and press the button</h2>
                        </div>
                        <div className="setup-area" onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}>
                            <Grid id="grid" />
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