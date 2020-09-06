import React, { Component, Fragment } from 'react';
import socket from '../socket';
import rensalert from '../rensAlert/rensAlert';
import '../scss/game.scss';
import Boat, {BOATTYPE} from '../Components/Boat';
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
        const gridPos = document.getElementById('grid').getBoundingClientRect();
        if (this.state.currentBoat && m.pageY > gridPos.top && m.pageX > gridPos.left && m.pageY < gridPos.top + gridPos.height && m.pageX < gridPos.left + gridPos.width) {
            const el = this.state.currentBoat.element;
            let y = Math.round((m.pageY - el.offsetHeight/2 - gridPos.top)/50);
            let x = Math.round((m.pageX - el.offsetWidth/2 - gridPos.left)/50);

            console.log(x,y);

            el.style.top = gridPos.top + (50 * y) - 4 + 'px';
            el.style.left = gridPos.left + (50 * x) - 4 + 'px';
        }
    }

    onMouseDown(m, boatType = 0) {
        if (this.state.currentBoat) {
            const el = this.state.currentBoat.element;
            el.classList.remove('active');

            this.setState({currentBoat: null});
        } else {
            if (!m.target.classList.contains('cell') || !m.target.parentElement.classList.contains('boat')) {
                return;
            }
            if (this.state.currentBoat) {
                this.state.currentBoat.element.classList.remove('active');
            }
            this.setState({ currentBoat: { element: m.target.parentElement, type: boatType, orientation: 0 } });
            m.target.parentElement.classList.add('active');
            m.target.parentElement.classList.add('moved');
        }
    }

    rotateShip(k) {
        if (k.key === 'r' && this.state.currentBoat) {
            this.state.currentBoat.element.classList.toggle('rotated');
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