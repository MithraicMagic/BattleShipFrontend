import autobind from 'class-autobind';
import React, { Component } from 'react'
import DocFields from './DocFields';

export default class RestDocPath extends Component {
    constructor(props) {
        super(props)
        autobind(this);
    }

    render() {
        console.log(this.props.doc);

        return (
            <div>
                <span className="path">{this.props.doc.path}</span>

                <div className="attributes">
                        {this.props.doc.pathVariables ? (
                            <>
                                <div className="variables">
                                    <h4>Path Variables</h4>
                                    <DocFields fields={this.props.doc.pathVariables.fields} />
                                </div>
                                <hr />
                            </>
                        ) : ''}

                        {this.props.doc.body ? (
                            <>
                                <div className="inputs">
                                    <h4>Expects</h4>
                                    <DocFields fields={this.props.doc.input.fields} />
                                </div>
                                <hr />
                            </>
                        ) : ''}
                        
                        <div className="outputs">
                            <h4>Returns</h4>
                            <DocFields fields={this.props.doc.output.fields} />
                        </div>
                        
                        {this.props.doc.body ? (
                            <>
                                <hr />
                                <div className="inputs">
                                    <h4>On Error</h4>
                                    <DocFields fields={this.props.doc.onError.fields} />
                                </div>
                            </>
                        ) : ''}
                    </div>
            </div>
        )
    }
}
