export class MusicManager {

    constructor(game) {

        this.game = game;

        this.currentTrack = null;

        this.playing = false;

        this.volume = 1;

        this.enabled = true;

    }

    async initialize() {

        console.log("MusicManager initialisé.");

    }

    play(track) {

        if (!this.enabled || !track) {

            return;

        }

        this.currentTrack = track;

        this.playing = true;

        this.game.eventBus?.emit(

            "audio:music-play",

            track

        );

    }

    stop() {

        if (!this.playing) {

            return;

        }

        this.playing = false;

        this.game.eventBus?.emit(

            "audio:music-stop",

            this.currentTrack

        );

        this.currentTrack = null;

    }

    pause() {

        if (!this.playing) {

            return;

        }

        this.playing = false;

        this.game.eventBus?.emit(

            "audio:music-pause",

            this.currentTrack

        );

    }

    resume() {

        if (!this.currentTrack) {

            return;

        }

        this.playing = true;

        this.game.eventBus?.emit(

            "audio:music-resume",

            this.currentTrack

        );

    }

    setVolume(volume) {

        this.volume = Math.max(

            0,

            Math.min(

                1,

                Number(volume) || 0

            )

        );

    }

    setEnabled(enabled) {

        this.enabled = Boolean(enabled);

    }

    getCurrentTrack() {

        return this.currentTrack;

    }

    getVolume() {

        return this.volume;

    }

    isPlaying() {

        return this.playing;

    }

    isEnabled() {

        return this.enabled;

    }

}