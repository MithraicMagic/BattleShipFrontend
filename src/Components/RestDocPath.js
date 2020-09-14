import autobind from 'class-autobind';
import React, { Component } from 'react'

export default class RestDocPath extends Component {
    constructor(props) {
        super(props);

        autobind(this);
        this.state = {
            inputs: [], outputs: [], onError: []
        };
    }

    render() {
        return (
            <div>
                
            </div>
        )
    }
}
