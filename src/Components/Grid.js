import React, { Component } from 'react';
import Cell from './Cell';
import socket from '../socket';

export default class Grid extends Component {
    getCells(amount) {
        const cells = [];
        for (let i = 0; i < amount; i++) {
            const xTile = i % 10;
            const yTile = Math.floor(i / 10);
            cells.push(<Cell key={i} class="grid-cell" id={(this.props.gridPlayer ? this.props.gridPlayer + '-' : '') + 'x:' + xTile + '-y:' + yTile} onClick={this.props.lobbyId ? () => this.shootCell(xTile, yTile) : null} />);
        }
        return cells;
    }

    shootCell(i, j) {
        socket.emit('shoot', {
            uid: socket.uid,
            lobbyId: this.props.lobbyId,
            i, j
        });
    }

    render() {
        return (
            <div id={this.props.id} className={'grid' + (this.props.className ? ' ' + this.props.className : '')}>
                {this.getCells(100)}
            </div>
        )
    }
}
