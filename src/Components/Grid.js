import React, { Component } from 'react';
import Cell from './Cell';

export default class Grid extends Component {
    getCells(amount) {
        const cells = [];
        for (let i = 0; i < amount; i++) {
            cells.push(<Cell key={i}/>);
        }
        return cells;
    }

    render() {
        return (
            <div id={this.props.id} className="grid">
                {this.getCells(100)}
            </div>
        )
    }
}
