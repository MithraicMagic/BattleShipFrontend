import cat from './sounds/cat.mp3';
import sweden from './sounds/sweden.mp3';

export default class MusicPlayer {
    constructor() {
        this.song = null;
        this.defaultVolume = 0.3;
    }

    play(params) {
        var success = false;

        if (params.length >= 2) {
            const type = params[0];
            const name = params[1];
            
            switch (type) {
                case "minecraft":
                    success = this.playMinecraft(name);
                    break;
                default:
                    success = false;
            }
        }

        return success;
    }

    playMinecraft(name) {
        switch (name) {
            case "cat":
                this.pause();
                this.song = new Audio(cat);
                break;
            case "sweden":
                this.pause();
                this.song = new Audio(sweden);
                break;
            default:
                return false;
        }

        this.song.volume = this.defaultVolume;
        this.song.play();
        return true;
    }

    pause() {
        if (this.song === null) return;

        this.song.pause();
    }

    stop() {
        if (this.song === null) return true;

        this.song.pause();
        this.song = null;
        return true;
    }

    volume(params) {
        console.log(params);

        if (params.length !== 1) return false;
        const vol = params[0];

        if (isNaN(vol) || vol === "" || vol < 0 || vol > 1.0) return false;
        if (this.song === null) return true;

        this.song.volume = vol;
        return true;
    }

    setDefaultVolume(vol) {
        if (isNaN(vol) || vol < 0 || vol > 1.0) return;
        this.defaultVolume = vol;
    }
}