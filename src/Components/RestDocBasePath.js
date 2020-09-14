import autobind from 'class-autobind';
import React, { Component } from 'react'
import RestDocPath from './RestDocPath';

export default class RestDocBasePath extends Component {
    constructor(props) {
        super(props);

        autobind(this);
        this.state = {
            paths: []
        };
    }

    componentDidMount() {
        const paths = [];
        this.props.doc.entries.forEach((path, i) => {
            paths.push(<RestDocPath key={i} doc={path}></RestDocPath>)
        });
        this.setState({paths})
    }

    render() {
        return (
            <div>
                <span className="base-path">{this.props.doc.basePath}</span>
                <div className="paths">
                    {this.state.paths}
                </div>
            </div>
        )
    }
}
