import React, { Component } from 'react'
import Cell from './Cell';

export const BOATTYPE = {
    AIRCRAFT_CARRIER: 1,
    BATTLESHIP: 2,
    CRUISER: 3,
    SUBMARINE: 4,
    MINESWEEPER: 5
}

const BOATDATA = new Map([
    [BOATTYPE.AIRCRAFT_CARRIER, { size: 5, class: 'carrier' }],
    [BOATTYPE.BATTLESHIP, { size: 4, class: 'battleship' }],
    [BOATTYPE.CRUISER, { size: 3, class: 'cruiser' }],
    [BOATTYPE.SUBMARINE, { size: 3, class: 'submarine' }],
    [BOATTYPE.MINESWEEPER, { size: 2, class: 'minesweeper' }]
])

export default class Boat extends Component {
    constructor(props) {
        super(props);

        this.state = { boatType: this.props.boatType }
    }

    getCells(amount) {
        const cells = [];
        for (let i = 0; i < amount; i++) {
            cells.push(<Cell key={i}/>);
        }
        return cells;
    }

    render() {
        const boatData = BOATDATA.get(this.state.boatType);
        return <div boattype={this.props.boatType} className={'boat ' + boatData.class} onClick={this.props.onClick}>{this.getCells(boatData.size)}</div>
    }
}
