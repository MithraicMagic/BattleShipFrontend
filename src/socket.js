import io from 'socket.io-client';
import RensAlert from './rensAlert/rensAlert';

class Socket {
    constructor() {
        this.socket = io(process.env.REACT_APP_URL, { path: '/sockets' });
        this.uid = sessionStorage.getItem('userId');
        
        this.state = "EnterName";
        this.onStateSwitch = null;

        this.listeners = [];
        this.init();
    }

    init() {
        this.on('newUid', (data) => sessionStorage.setItem('userId', data.data));

        this.on('message');
        this.on('errorEvent', (data) => {
            RensAlert.popup({
                title: 'Oopsie!',
                text: data.reason,
                style: {
                    top: '-80px',
                    right: '20px',
                    transition: '0.3s all ease-out',
                    opacity: '0'
                },
                transition: {
                    time: 5000,
                    style: {
                        top: '25px',
                        opacity: '1'
                    }
                }
            });
        });

        this.on('playerState', (state) => {
            this.state = state;
            if (this.onStateSwitch) this.onStateSwitch();
        });

        this.emit('lastUid', this.uid);
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
            if (func) func(...data);
        });
    }

    removeListeners() {
        this.listeners.forEach((l) => {
            this.socket.removeListener(l.event, l.func);
        });
        this.listeners = [];
    }
}

const socket = new Socket();
export default socket;