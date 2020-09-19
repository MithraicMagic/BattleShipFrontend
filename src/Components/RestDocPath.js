import autobind from 'class-autobind';
import React, { Component } from 'react'
import DocFields from './DocFields';
import ErrorField from './ErrorField';

export default class RestDocPath extends Component {
    constructor(props) {
        super(props)
        autobind(this);
    }

    expand(e) {
        document.querySelectorAll('.path').forEach(ele => {
            if (ele !== e.currentTarget.parentElement) {
                ele.classList.add('hidden');
            }
        });
        e.currentTarget.parentElement.classList.toggle('hidden');
    }

    render() {
        return (
            <div className="path hidden">
                <span className="route" onClick={(e) => this.expand(e)}>{this.props.doc.path}</span>

                <div className="attributes">
                    {this.props.doc.pathVariables.fields.length > 0 ? (
                        <div className="variables">
                            <h4>Path Variables</h4>
                            <DocFields fields={this.props.doc.pathVariables.fields} />
                        </div>
                    ) : ''}

                    {this.props.doc.body.fields.length > 0 ? (
                        <div className="inputs">
                            <h4>Expects</h4>
                            <DocFields fields={this.props.doc.body.fields} />
                        </div>
                    ) : ''}

                    {this.props.doc.output.fields.length > 0 ? (
                        <div className="outputs">
                            <h4>Returns</h4>
                            <DocFields fields={this.props.doc.output.fields} />
                        </div>
                    ) : ''}

                    {this.props.doc.onError.length > 0 ? (
                        <div className="errors">
                            <h4>On Error</h4>
                            <ErrorField fields={this.props.doc.onError} />
                        </div>
                    ) : ''}
                </div>
            </div>
        )
    }
}
