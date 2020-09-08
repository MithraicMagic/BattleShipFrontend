
import { RensAlertSpawnType } from './rensAlert/rensAlert';

/*
export const DEFAULT_STYLE = {
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
}*/

export const DEFAULT_STYLE = {
    spawn: RensAlertSpawnType.PUSH,
    style: {
        alignSelf: 'flex-end',
        position: 'relative',
        transition: '0.3s all ease-out',
        marginTop: '-80px',
        marginRight: '25px'
    },
    transition: {
        open: {
            style: {
                marginTop: '25px'
            }
        },
        close: {
            time: 300,
            startAfter: 4000,
            style: {
                transform: 'translateY(30px)',
                opacity: '0',
            }
        }
    }
}

export const MESSAGE_STYLE = {
    spawn: RensAlertSpawnType.PUSH,
    style: {
        alignSelf: 'flex-end',
        position: 'relative',
        transition: '0.3s all ease-out',
        marginTop: '-80px',
        marginRight: '25px'
    },
    transition: {
        open: {
            style: {
                marginTop: '25px'
            }
        },
        close: {
            time: 300,
            startAfter: 8000,
            style: {
                transform: 'translateY(30px)',
                opacity: '0',
            }
        }
    }
};

export const NON_TIMED = {
    spawn: RensAlertSpawnType.REPLACE_SAME_TYPE,
    style: {
        alignSelf: 'flex-end',
        position: 'relative',
        transition: '0.3s all ease-out',
        marginTop: '-80px',
        marginRight: '25px'
    },
    transition: {
        open: {
            style: {
                marginTop: '25px'
            }
        }
    }
}