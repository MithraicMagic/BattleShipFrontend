import React, { Component, Fragment } from 'react';
import socket from '../socket';
import rensAlert from '../rensAlert/rensAlert';
import '../scss/setup.scss';
import Boat, { BOATTYPE, BOATDATA } from '../Components/Boat';

import Grid from '../Components/Grid';
import autobind from 'class-autobind';
import { withRouter } from 'react-router-dom';

import { NON_TIMED } from '../rensAlertStyles';

class Setup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            availableBoats: [],
            setBoats: [],
            currentBoat: null,
            lastBoat: null,
            opponentReady: false
        };
        socket.state = 'Setup';

        autobind(this);
    }

    componentDidMount() {
        socket.onStateSwitch = () => {
            if (socket.state === "OpponentReconnecting") {
                rensAlert.popup({
                    title: "Oh Noes!",
                    text: "Your opponent is reconnecting... 😰",
                });
                return;
            }
            this.forceUpdate();
        }

        socket.emit('getSetupData', { uid: socket.uid });
        socket.on('setupData', (data) => {
            this.setState({
                lobbyId: data.lobbyId,
                username: data.me,
                otherUsername: data.opponent,
                leader: data.leader
            });
            this.placeBoats(data.boatData);
        });

        socket.on('autoPlaceShipsAccepted', (data) => {
            this.placeBoats(data.ships);
            rensAlert.popup({
                title: 'Yay',
                text: 'Your ships have been automatically placed on the board'
            });
        });

        socket.on('opponentLeft', () => {
            rensAlert.accept({
                title: "Oh no!", text: "Your opponent has disconnected 😭", accept: 'Okay :(',
                onAccept: () => this.props.history.push('/')
            }, NON_TIMED);
        });

        socket.on('lobbyLeft', () => {
            this.props.history.push('/');
        });

        socket.socket.on('errorEvent', (data) => {
            if (this.state.pendingBoat && data.event === 'placeShip') {
                this.state.pendingBoat.element.classList.remove('placed');
            }
            if (data.event === 'submitSetup') {
                rensAlert.popup({ title: 'LOOOOLLL DOM EN SLECHT 👨🏼‍🦳', text: 'JE DACHT IK DOE DIT EVEN SNEL, MAAR NEE, JE IQ IS VEEEEEEL TE LAAG (doe je setup even opnieuw)' });
                document.getElementById('sub-btn').disabled = false;
            }

            this.setState({ pendingBoat: null, currentBoat: this.state.pendingBoat });
        });

        socket.on('placeShipAccepted', () => {
            this.state.pendingBoat.element.classList.remove('active');
            this.setState({ setBoats: [...this.state.setBoats, this.state.pendingBoat], pendingBoat: null });
        });

        socket.on('opponentSubmitted', () => {
            if (socket.state !== "SetupComplete") {
                rensAlert.popup({ title: 'Hurry up!', text: 'Your opponent is ready' });
            }
            this.setState({ opponentReady: true });
        });

        socket.on('gameStarted', () => {
            setTimeout(() => {
                this.props.history.push('/game');
            }, 3000)
        });

        document.addEventListener('mousemove', this.updateMousePos);
        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('keydown', this.rotateShip);

        const availableBoats = [];
        [BOATTYPE.AIRCRAFT_CARRIER, BOATTYPE.BATTLESHIP, BOATTYPE.CRUISER, BOATTYPE.MINESWEEPER, BOATTYPE.SUBMARINE].forEach((b) => {
            const data = BOATDATA.get(b);
            availableBoats.push({ element: document.getElementById(data.class), type: b, orientation: 1, onBoard: false });
        });
        this.setState({ availableBoats });
    }

    componentWillUnmount() {
        socket.removeListeners();

        document.removeEventListener('mousemove', this.updateMousePos);
        document.removeEventListener('mousedown', this.onMouseDown);
        document.removeEventListener('keydown', this.rotateShip);
    }

    placeBoats(data) {
        data.forEach(boat => {
            const localBoat = this.state.availableBoats.find(b => BOATDATA.get(Number(b.element.getAttribute('boattype'))).class === boat.name);
            if (localBoat) {
                const boatData = BOATDATA.get(localBoat.type);

                localBoat.orientation = boat.horizontal ? 0 : 1;

                const startX = localBoat.orientation === 1 ? boat.pos.i : boat.pos.i - Math.floor((boatData.size - .01) / 2);
                const startY = localBoat.orientation === 0 ? boat.pos.j : boat.pos.j - Math.floor((boatData.size - .01) / 2);

                for (let i = 0; i < boatData.size; i++) {
                    const cell = document.getElementById('x:' + (localBoat.orientation === 1 ? startX : startX + i) + '-y:' + (localBoat.orientation === 0 ? startY : startY + i));

                    //Check if there is already another boat active on this tile
                    if (cell && !cell.classList.contains('active')) {
                        cell.classList.add(boatData.class, 'active');
                        cell.setAttribute('boattype', boatData.class);
                    }
                }

                localBoat.element.classList.add('placed');
                this.setState({ setBoats: [...this.state.setBoats, localBoat], availableBoats: this.state.availableBoats.filter(b => b.type !== localBoat.type) });
            }
        });
    }

    calculateTile(m) {
        const gridPos = document.getElementById('grid').getBoundingClientRect();

        const yCell = Math.floor((m.pageY - gridPos.top) / 50);
        const xCell = Math.floor((m.pageX - gridPos.left) / 50);

        return { xCell, yCell };
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

                const boat = this.state.currentBoat;
                const boatData = BOATDATA.get(boat.type);

                //Calculate on which tile the mouse is currently hovering
                const tile = this.calculateTile(m);
                const startX = boat.orientation === 1 ? tile.xCell : tile.xCell - Math.floor((boatData.size - .01) / 2);
                const startY = boat.orientation === 0 ? tile.yCell : tile.yCell - Math.floor((boatData.size - .01) / 2);

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
                    if (cell.classList.contains(boatData.class)) {
                        cell.classList.remove(boatData.class, 'active');
                        if (cell.getAttribute('boattype') === boatData.class) cell.removeAttribute('boattype');
                    }
                });
            }
        }
    }

    onMouseDown(m) {
        if (this.state.pendingBoat) return;
        if (this.state.currentBoat) {
            //If the right mouse button was clicked, or if the boat was placed outside of the board
            if (m.button === 2 || !this.state.currentBoat.onBoard) {
                this.removeBoatFromGrid(this.state.currentBoat);
                this.setState({ availableBoats: [...this.state.availableBoats, this.state.currentBoat], currentBoat: null });
                return;
            }

            this.state.currentBoat.element.classList.add('placed');

            //Add placed boat to setBoats
            const tile = this.calculateTile(m);
            socket.emit('placeShip', {
                lobbyId: this.state.lobbyId,
                i: tile.xCell,
                j: tile.yCell,
                uid: socket.uid,
                ship: BOATDATA.get(this.state.currentBoat.type).class,
                horizontal: this.state.currentBoat.orientation === 0
            });
            this.setState({ currentBoat: null, pendingBoat: this.state.currentBoat });
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
            if (m.target.classList.contains('cell') && m.target.parentElement.classList.contains('boat') && !m.target.parentElement.classList.contains('placed')) {
                //Get information from boat element that was clicked
                const boat = this.state.availableBoats.find(b => b.type === Number(m.target.parentElement.getAttribute('boattype')));
                this.setState({ currentBoat: boat, availableBoats: this.state.availableBoats.filter(b => b.type !== boat.type) });
                this.state.currentBoat.element.classList.add('active');
            }
        }
    }

    rotateShip(k) {
        //If the R button is pressed, rotate currently editing boat
        if (k.key === 'r' && this.state.currentBoat) {
            this.setState({ currentBoat: { ...this.state.currentBoat, orientation: this.state.currentBoat.orientation === 0 ? 1 : 0 } });
            document.dispatchEvent(new Event("mousemove"));
        }
    }

    removeBoatFromGrid(boat) {
        const boatData = BOATDATA.get(boat.type);
        boat.element.classList.remove('active', 'placed');

        //Remove boat from the grid
        document.querySelectorAll('.grid-cell').forEach(cell => {
            if (cell.classList.contains(boatData.class)) {
                cell.classList.remove(boatData.class, 'active');
                if (cell.getAttribute('boattype') === boatData.class) cell.removeAttribute('boattype');
            }
        });

        socket.emit('removeShip', {
            lobbyId: this.state.lobbyId,
            uid: socket.uid,
            ship: boatData.class
        });
    }

    clearBoats() {
        if (this.state.setBoats.length < 1) {
            rensAlert.popup({ title: "Cleared Grid", text: "There were no boats on the grid though" });
            return;
        }

        this.state.setBoats.forEach(boat => {
            this.removeBoatFromGrid(boat);
        });

        this.setState({ availableBoats: [...this.state.availableBoats, ...this.state.setBoats], setBoats: [] });

        rensAlert.popup({ title: "Cleared Grid", text: "Your grid has been cleared!" });
    }

    submitSetup() {
        if (this.state.availableBoats.length < 1 && !this.state.currentBoat && !this.state.pendingBoat) {
            socket.emit('submitSetup', { lobbyId: this.state.lobbyId, uid: socket.uid });
            document.getElementById('sub-btn').disabled = true;
        } else {
            rensAlert.popup({ title: 'WHOA!', text: 'You have to place all of your ships before submitting!' });
        }
    }

    autoPlace() {
        if (this.state.availableBoats.length > 0) {
            socket.emit('autoPlaceShips', {
                lobbyId: this.state.lobbyId,
                uid: socket.uid
            });
        }
        else {
            rensAlert.popup({
                title: "Oopsie",
                text: 'All your boats are already on the board.'
            });
        }
    }

    getCurrentView() {
        switch (socket.state) {
            case "Setup":
            case "OpponentReconnecting":
            case "SetupComplete":
                return (
                    <Fragment>
                        <button onClick={() => socket.submitLeave(this.state.lobbyId)}>Leave</button>
                        <div className="info">
                            <h1>Setup Fase</h1>
                            <h2>Put all of your boats on the grid and press the button</h2>
                        </div>
                        <div className="setup-area" onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}>
                            <Grid id="grid" />
                            <div className="dock">
                                <button onClick={this.clearBoats}>Clear Grid</button>
                                <div className="boats">
                                    <Boat id="carrier" boatType={BOATTYPE.AIRCRAFT_CARRIER}></Boat>
                                    <Boat id="battleship" boatType={BOATTYPE.BATTLESHIP}></Boat>
                                    <Boat id="cruiser" boatType={BOATTYPE.CRUISER}></Boat>
                                    <Boat id="submarine" boatType={BOATTYPE.SUBMARINE}></Boat>
                                    <Boat id="minesweeper" boatType={BOATTYPE.MINESWEEPER}></Boat>
                                </div>
                            </div>
                        </div>
                        <div className="bottom">
                            <button id="sub-btn" onClick={this.submitSetup}>Submit</button>
                            <button id="auto-btn" onClick={this.autoPlace}>Auto-Place Ships</button>
                        </div>
                    </Fragment>
                )
            case "OpponentTurn":
            case "YourTurn":
                return <h1>Game is about to start...</h1>
            default:
                return <h1>Oopsie whoopsie, unknown state <span role="img" aria-label="SAD!">😔</span></h1>;
        }
    }

    getOverlayContent() {
        return (
            <div>
                {this.state.opponentReady ? <h1>{this.state.otherUsername} is ready! <span role="img" aria-label="Done">✅</span></h1> : <h1>Waiting for {this.state.otherUsername}...<span role="img" aria-label="Waiting">⛔</span></h1>}
            </div>
        )
    }

    render() {
        const hidden = socket.state !== "SetupComplete" && socket.state !== "YourTurn" && socket.state !== "OpponentTurn";

        return (
            <Fragment>
                <div className="setup-page">
                    {this.getCurrentView()}
                </div>
                <div className={`overlay${(hidden ? " hidden" : "")}`} id="overlay">
                    <div className='overlay-content'>
                        {this.getOverlayContent()}
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default withRouter(Setup);