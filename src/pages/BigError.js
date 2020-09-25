import React, { Component } from 'react'
import '../scss/bigError.scss';
import autobind from 'class-autobind';
import rensAlert from './../rensAlert/rensAlert';

export default class BigError extends Component {
    constructor(props) {
        super(props);

        this.state = { secondsLeft: 0, interval: null };
        autobind(this);
    }

    doIt() {
        if (this.state.interval) {
            clearInterval(this.state.interval);
        }

        this.setState({ secondsLeft: 10 });
        this.setState({ interval: setInterval(this.countDown, 1000) });
    }

    countDown() {
        if (this.state.secondsLeft - 1 === 0) {
            this.props.history.push('/');
        }
        this.setState({ secondsLeft: this.state.secondsLeft - 1 });
    }

    render() {
        return (
            <div className="big-error">
                <h1>JIJ HEBT EEN GROTE FOUT GEMAAKT, JONGEMAN!</h1>
                <hr/>
                {this.state.secondsLeft ? '' : <h2 className="apologize" onClick={this.doIt}>Oh Nee <span aria-label="GROTE SAD!" role="img">😟</span></h2>}
                {this.state.secondsLeft ? '' : <h2 className="scam" onClick={() => rensAlert.popup({title: "Lol", text: "ok 🤷🏼‍♂️"})}>Hehehe, dat was lekker de bedoeling <span aria-label="GROTE BOOS!" role="img">😈</span></h2>}
                {this.state.secondsLeft ? <h3>{this.state.secondsLeft} seconds until lift off!</h3> : ''}
            </div>
        )
    }
}
