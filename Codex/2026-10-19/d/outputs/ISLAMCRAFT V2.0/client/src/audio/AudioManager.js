export class AudioManager {

    constructor(game) {

        this.game = game;

        this.context = null;

        this.masterVolume = 1;

        this.musicVolume = 1;

        this.sfxVolume = 1;

        this.muted = false;

        this.initialized = false;

    }

    async initialize() {

        if (

            typeof window !== "undefined" &&

            window.AudioContext

        ) {

            this.context = new AudioContext();

        }

        this.initialized = true;

        console.log("AudioManager initialisé.");

    }

    async resume() {

        if (

            this.context &&

            this.context.state === "suspended"

        ) {

            await this.context.resume();

        }

    }

    setMasterVolume(volume) {

        this.masterVolume = Math.max(

            0,

            Math.min(

                1,

                Number(volume) || 0

            )

        );

    }

    setMusicVolume(volume) {

        this.musicVolume = Math.max(

            0,

            Math.min(

                1,

                Number(volume) || 0

            )

        );

    }

    setSfxVolume(volume) {

        this.sfxVolume = Math.max(

            0,

            Math.min(

                1,

                Number(volume) || 0

            )

        );

    }

    setMuted(muted) {

        this.muted = Boolean(muted);

    }

    toggleMute() {

        this.muted = !this.muted;

        return this.muted;

    }

    getMasterVolume() {

        return this.masterVolume;

    }

    getMusicVolume() {

        return this.musicVolume;

    }

    getSfxVolume() {

        return this.sfxVolume;

    }

    isMuted() {

        return this.muted;

    }

    getEffectiveVolume(volume) {

        if (this.muted) {

            return 0;

        }

        return volume * this.masterVolume;

    }

    async destroy() {

        if (this.context) {

            await this.context.close();

            this.context = null;

        }

        this.initialized = false;

    }

}