
import io from 'socket.io-client';
import RensAlert from './rensAlert/rensAlert';

class Socket {
    constructor() {
        this.socket = io(process.env.REACT_APP_URL, { path: '/sockets' });
        this.uid = sessionStorage.getItem('userId');

        this.init();
    }

    init() {
        if (this.uid) this.emit('lastUid', this.uid);
        this.on('newUid', (data) => sessionStorage.setItem('userId', data.data));

        this.on('message');
        this.on('errorEvent', (data) => {
            RensAlert.popup({
                title: 'Oops',
                text: data.reason,
                time: 5000
            });
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
        this.socket.on(msg, (...data) => {
            if (process.env.REACT_APP_DEBUG === 'true') {
                const lg = `[SOCKET] Receiving '${msg}'` + (process.env.REACT_APP_LOG_PAYLOAD === 'true' ? ` with payload: ${JSON.stringify(data)}` : '');
                console.log(lg);
            }
            if (func) func(...data);
        });
    }
}

const socket = new Socket();
export default socket;