export class SFXManager {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.volume = 1;

    }

    async initialize() {

        console.log("SFXManager initialisé.");

    }

    play(sound) {

        if (!this.enabled || !sound) {

            return;

        }

        this.game.eventBus?.emit(

            "audio:sfx-play",

            {

                sound,

                volume: this.volume

            }

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

    stopAll() {

        this.game.eventBus?.emit(

            "audio:sfx-stop-all"

        );

    }

    getVolume() {

        return this.volume;

    }

    isEnabled() {

        return this.enabled;

    }

}