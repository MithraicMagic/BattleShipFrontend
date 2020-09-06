import React, { Component } from 'react'

export default class Cell extends Component {
    render() {
        return <div id={this.props.id} className={'cell' + (this.props.class ? ' ' + this.props.class : '')}></div>
    }
}
