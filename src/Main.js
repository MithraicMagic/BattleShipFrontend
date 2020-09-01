import React, { Component } from 'react'
import io from 'socket.io-client';

import './main.scss';

const socket = io(process.env.REACT_APP_URL, {path: '/sockets'});

export default class Main extends Component {
    componentDidMount() {
        socket.emit('chatevent', {username: 'henk', message: 'henk'});
        socket.on('chatevent', (data) => console.log(data));
    }
    
    render() {
        return (
            <div>
                hallo
            </div>
        )
    }
}
