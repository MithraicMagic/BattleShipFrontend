
import React, { Component } from 'react'
import DocPath from '../Components/DocPath';

export default class Documentation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            paths: []
        };
    }

    async componentDidMount() {
        const result = await fetch(process.env.REACT_APP_API_URL + '/documentation');
        if (result.ok) {
            const docs = await result.json();
            console.log(docs);

            const paths = [];
            docs.forEach((p, i) => {
                console.log(p);
                paths.push(<DocPath key={i} doc={p}/>)
            });

            this.setState({ paths });
        }
    }

    render() {
        return (
            <div className="docs">
                {this.state.paths}
            </div>
        )
    }
}
