
import React, { Component } from 'react'

export default class Message extends Component {
    render() {
        return (
            <div style={{ textAlign: this.props.sent ? "right" : "left"}} className={"message " + (this.props.sent ? "right" : "left")}>
                {this.props.message}
            </div>
        )
    }
}
