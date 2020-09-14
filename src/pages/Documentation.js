
import React, { Component } from 'react'
import DocPath from '../Components/DocPath';
import '../scss/documentation.scss';

export default class Documentation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            socketPaths: [],
            apiPaths: [],
            socketApi: true
        };
    }

    async componentDidMount() {
        const result = await fetch(process.env.REACT_APP_API_URL + '/documentation');
        if (result.ok) {
            const docs = await result.json();

            const paths = [];
            docs.forEach((p, i) => {
                paths.push(<DocPath key={i} doc={p} />)
            });

            this.setState({ socketPaths: paths });
        }
    }

    getContent() {
        if (this.state.socketApi) {
            return this.state.socketPaths;
        } else {
            return this.state.apiPaths;
        }
    }

    render() {
        return (
            <div className="documentation">
                <div className="header">
                    <div className="back-button-container">
                        <div className="back-button" onClick={() => this.props.history.push('/')}><div></div></div>
                    </div>
                    <div className="buttons">
                        <button className={this.state.socketApi ? 'active' : ''} onClick={() => this.setState({ socketApi: true })}>Sockets<div></div></button>
                        <button className={this.state.socketApi ? '' : 'active'} onClick={() => this.setState({ socketApi: false })}>REST<div></div></button>
                    </div>
                    <div></div>
                </div>
                <div className="events">
                    {this.getContent()}
                </div>
            </div>
        )
    }
}
