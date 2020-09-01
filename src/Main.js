import React, { Component } from 'react'
import io from 'socket.io-client';

import './main.scss';

const socket = io('https://bs.cesarpulles.nl', {path: '/sockets'});
// const socket = io('http://localhost:6003', {path: '/sockets'});

export default class Main extends Component {
    componentDidMount() {
        socket.on('connect', () => console.log('suck'));
        socket.on('error', (error) => console.error(error));
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
