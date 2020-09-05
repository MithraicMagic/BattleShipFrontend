import React, {Component} from 'react';

const State = {
    SETUP: 0,
    YOUR_TURN: 1,
    OPPONENT_TURN: 2    
};

export default class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            current: null
        }
    }

    render() {
        return (
            <div className="game">
                Jaa we zitten in een game JOEPIE!
            </div>
        );
    }
}