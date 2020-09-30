import React, { Component } from 'react';
import '../scss/player.scss';

export default class videoPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = { video: null }
    }

    play(link) {
        this.setState({
            video: <iframe title="YouTube Player" width="1280" height="720" src={link} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
        });
        return true;
    }

    render() {
        return (
            <div className="youtube-player">
                {this.state.video}
            </div>
        )
    }
}