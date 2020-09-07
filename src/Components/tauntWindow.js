
import React, { Component } from 'react'

import '../scss/taunt.scss';
import autobind from 'class-autobind';

const State = { DOWN: 0, UP: 1 };

export default class tauntWindow extends Component {
    constructor(props) {
        super(props);
        autobind(this);
    
        this.state = {
            current: State.DOWN
        };
    }


    changeTo(state) {
        if (this.state.current === state) return;

        document.querySelector('.tauntWindow').classList.toggle('extended');
        this.setState({ current: state });
    }

    render() {
        return (
            <div className="tauntWindow" onClick={() => this.changeTo(State.UP)}>
                <div className="close" onClick={() => this.changeTo(State.DOWN)}><span>Close</span></div>
                <div className="open">Click to Taunt</div>
            </div>
        )
    }
}
