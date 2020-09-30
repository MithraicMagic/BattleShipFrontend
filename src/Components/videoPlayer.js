import React, { Component } from 'react';
import '../scss/player.scss';

export default class videoPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = { video: null }
    }

    control(params) {
        if (params === 'stop') {
            this.setState({video: null});
        } else {
            this.setState({
                video: <iframe title="YouTube Player" src={params} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
            });
        }

        return true;
    }

    render() {
        if (this.state.video) {
            return (
                <div id="player" className="youtube-player closed" onClick={(e) => e.target === document.getElementById('close-button') ? null : document.getElementById('player').classList.remove('closed')}>
                    <h1>Open Youtube Player</h1>
                    <button id="close-button" onClick={() => document.getElementById('player').classList.add('closed')}>Close</button>
                    {this.state.video}
                </div>
            )
        }

        return null;
    }
}