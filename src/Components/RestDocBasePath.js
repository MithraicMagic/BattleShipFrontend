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

    expand(e) {
        document.querySelectorAll('.base-path').forEach(ele => {
            if (ele !== e.currentTarget.parentElement) {
                ele.classList.add('hidden');
            }
        });
        e.currentTarget.parentElement.classList.toggle('hidden');
    }

    render() {
        return (
            <div className="base-path hidden">
                <h3 className="base-route" onClick={(e) => this.expand(e)}>{this.props.doc.basePath}</h3>
                {this.state.paths}
            </div>
        )
    }
}
