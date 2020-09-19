import React, { Component } from 'react'
import DocFields from './DocFields';

export default class ErrorField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: []
        }
    }

    componentDidMount() {
        const errors = [];
        this.props.fields.forEach((error, i) => {
            errors.push(
                <div key={i} className="error">
                    <h4>{error.responseCode} - {error.description}</h4>
                    <DocFields fields={error.fields}/>
                </div>
            )
        });
        this.setState({ errors });
    }

    render() {
        return (
            <div className="fields">
                {this.state.errors}
            </div>
        )
    }
}
