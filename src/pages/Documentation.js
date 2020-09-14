
import React, { Component } from 'react'
import RestDocBasePath from '../Components/RestDocBasePath';
import SocketDocPath from '../Components/SocketDocPath';
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
        const socketResult = await fetch(process.env.REACT_APP_API_URL + '/documentation/sockets');
        if (socketResult.ok) {
            const docs = await socketResult.json();

            const paths = [];
            docs.entries.forEach((p, i) => {
                paths.push(<SocketDocPath key={i} doc={p} />)
            });

            this.setState({ socketPaths: paths });
        }

        const apiResult = await fetch(process.env.REACT_APP_API_URL + '/documentation/rest');
        if (apiResult.ok) {
            const docs = await apiResult.json();

            const paths = [];
            docs.entries.forEach((p, i) => {
                paths.push(<RestDocBasePath key={i} doc={p} />);
            })

            this.setState({ apiPaths: paths });
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
                <div className="entries">
                    {this.getContent()}
                </div>
            </div>
        )
    }
}
