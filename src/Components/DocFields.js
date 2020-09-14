
import autobind from 'class-autobind';
import React, { Component } from 'react'
import DocField from './DocField';

export default class DocFields extends Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = { fields: [] };
    }

    componentDidMount() {
        const data = this.props.fields;
        const fields = [];

        data.forEach((d, i) => {
            fields.push(<DocField key={i} type={d.type} name={d.name} desc={d.description}/>)
        });

        this.setState({ fields });
    }

    render() {
        return (
            <div className="fields">
                {this.state.fields}
            </div>
        )
    }
}
