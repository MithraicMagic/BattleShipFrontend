import io from 'socket.io-client';
import RensAlert from './rensAlert/rensAlert';
import { DEFAULT_STYLE, NON_TIMED } from './rensAlertStyles';
import React from 'react';

import MusicPlayer from './musicPlayer';

class Socket {
    constructor() {
        this.socket = io(process.env.REACT_APP_SOCKET_URL, { path: '/sockets' });
        this.uid = sessionStorage.getItem('userId');
        
        this.state = "EnterName";
        this.onStateSwitch = null;
        this.onStateSwitchTaunt = null;

        this.username = "";
        this.opponent = "";

        this.musicPlayer = new MusicPlayer();
        this.videoPlayer = React.createRef();

        this.listeners = [];
        this.init();
    }

    init() {
        this.socket.on('newUid', (data) => sessionStorage.setItem('userId', data.data));

        this.socket.on('errorEvent', (data) => {
            if (process.env.REACT_APP_CATCH_ERROR_EVENTS === 'true') {
                console.log(`[ErrorEvent Received: ${data.event} ${data.reason}]`);
            }

            if (data.event !== 'getNameData') {
                RensAlert.popup({
                    title: 'Oopsie!',
                    text: data.reason,
                });
            }
        });

        this.socket.on('opponentReconnected', () => {
            RensAlert.popup({
                title: 'Yay!',
                text: 'Your opponent is back!',
            });
        });

        this.socket.on('playerState', (data) => {
            if (process.env.REACT_APP_CATCH_PLAYERSTATE_EVENTS === 'true') {
                console.log(`[PlayerState Received: ${data.state}]`);
            }

            this.state = data.state;
            if (this.onStateSwitch) this.onStateSwitch();
            if (this.onStateSwitchTaunt) this.onStateSwitchTaunt();
        });

        this.socket.emit('lastUid', { uid: this.uid });

        this.socket.on('command', (data) => {
            if (process.env.REACT_APP_CATCH_COMMAND_EVENTS === 'true') {
                console.log(`[Command Received: ${data.commandName} with sender: ${data.sender} and params: ${data.params.toString()}]`)
            }

            var success = false;

            switch (data.commandName) {
                case 'play':
                    success = this.musicPlayer.play(data.params)
                    break;
                case 'stop':
                    success = this.musicPlayer.stop();
                    break;
                case 'volume':
                    success = this.musicPlayer.volume(data.params);
                    break;
                case 'youtube':
                    success = this.videoPlayer.current.control(data.params);
                    break;
                default:
                    success = false;
                    break;
            }

            if (success) {
                if (data.sender !== this.username) {
                    RensAlert.popup({
                        title: "Wow",
                        text: `${this.opponent} used the following command: ${data.commandName} ${data.params.toString().replace(',', ' ')}`
                    }, DEFAULT_STYLE);
                }
            } 
            else {
                if (data.sender === this.username) {
                    RensAlert.popup({
                        title: "Oops",
                        text: "Failed to parse your command",
                    }, DEFAULT_STYLE);
                }
            }
        });
    }

    setUid(uid) {
        this.uid = uid;
        sessionStorage.setItem('userId', this.uid);
    }

    emit(msg, ...data) {
        if (process.env.REACT_APP_DEBUG === 'true') {
            const lg = `[SOCKET] Emitting '${msg}'` + (process.env.REACT_APP_LOG_PAYLOAD === 'true' ? ` with payload: ${JSON.stringify(data)}` : '');
            console.log(lg);
        }
        this.socket.emit(msg, ...data);
    }

    on(msg, func) {
        this.listeners.push({ event: msg, func });

        this.socket.on(msg, (...data) => {
            if (process.env.REACT_APP_DEBUG === 'true') {
                const lg = `[SOCKET] Receiving '${msg}'` + (process.env.REACT_APP_LOG_PAYLOAD === 'true' ? ` with payload: ${JSON.stringify(data)}` : '');
                console.log(lg);
            }
            if (func) {
                data.forEach((d) => {
                    const username = Object.entries(d).find(([key, value]) => key === "me");
                    const opponent = Object.entries(d).find(([key, value]) => key === "opponent" || key === "otherName");

                    if (username) this.username = username[1];
                    if (opponent) this.opponent = opponent[1];
                });

                func(...data);
            }
        });
    }

    submitLeave(lobbyId) {
        RensAlert.confirm({
            title: "Are you sure",
            text: "That you want to leave the lobby?",
            accept: "Yes",
            decline: "No",
            onAccept: () => {
                this.socket.emit('leaveLobby', { uid: this.uid, lobbyId });
            },
        }, NON_TIMED);
    }

    removeListeners() {
        this.listeners.forEach((l) => {
            this.socket.off(l.event);
        });

        this.listeners = [];
    }
}

const socket = new Socket();
export default socket;