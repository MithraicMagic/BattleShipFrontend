import autobind from 'class-autobind';
import React, { Component } from 'react'

export default class RestDocBasePath extends Component {
    constructor(props) {
        super(props);

        autobind(this);
        this.state = {
            paths: []
        };
    }

    render() {
        return (
            <div>
                
            </div>
        )
    }
}
