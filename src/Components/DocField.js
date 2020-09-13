
import React, { Component } from 'react'

export default class DocField extends Component {
    render() {
        return (
            <div className="field">
                <span className="type">{this.props.type} </span>
                <span className="name">{this.props.name} </span>
                <span className="description">{this.props.desc}</span>
            </div>
        )
    }
}
