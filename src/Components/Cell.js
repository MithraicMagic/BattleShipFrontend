import React, { Component } from 'react'
import autobind from 'class-autobind';

export default class Cell extends Component {
    constructor(props) {
        super(props);
        autobind(this);
    }

    render() {
        return <div id={this.props.id} className={'cell' + (this.props.class ? ' ' + this.props.class : '')} onClick={this.onClick}></div>
    }

    onClick() {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }
}
