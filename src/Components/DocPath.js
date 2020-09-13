
import autobind from 'class-autobind';
import React, { Component } from 'react'

import DocFields from '../Components/DocFields';

export default class DocPath extends Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            inputs: [], outputs: [], onError: []
        };
    }

    componentDidMount() {
        const inputs = <DocFields fields={this.props.doc.input.fields}/>;
        const outputs = <DocFields fields={this.props.doc.output.fields}/>;
        const onError = <DocFields fields={this.props.doc.onError.fields}/>

        this.setState({ inputs, outputs, onError });
    }

    render() {
        return (
            <div className="event">
                <h3 className="path">{this.props.doc.path}</h3>

                <div className="inputs">
                    <h4>Inputs</h4>
                    {this.state.inputs}
                </div>

                <div className="outputs">
                    <h4>Returns</h4>
                    {this.state.outputs}
                </div>

                <div className="errors">
                    <h4>OnError</h4>
                    {this.state.onError}
                </div>
            </div>
        )
    }
}
