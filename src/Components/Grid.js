import React, { Component } from 'react';
import Cell from './Cell';

export default class Grid extends Component {
    getCells(amount) {
        const cells = [];
        for (let i = 0; i < amount; i++) {
            const xTile = i % 10;
            const yTile = Math.floor(i / 10);
            cells.push(<Cell key={i} class="grid-cell" id={'x:' + xTile + '-y:' + yTile} />);
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
