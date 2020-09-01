import React, { Component } from 'react'
import io from 'socket.io-client';

const socket = io('https://bs.cesarpulles.nl/sockets');

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
