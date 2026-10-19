export class ChestSounds {

    constructor(game) {

        this.game = game;

        this.enabled = true;

    }

    async initialize() {

        console.log("ChestSounds initialisé.");

    }

    playOpen() {

        if (!this.enabled) {

            return;

        }

        this.game.audioManager?.playSFX?.(

            "chest_open"

        );

    }

    playClose() {

        if (!this.enabled) {

            return;

        }

        this.game.audioManager?.playSFX?.(

            "chest_close"

        );

    }

    playReward() {

        if (!this.enabled) {

            return;

        }

        this.game.audioManager?.playSFX?.(

            "chest_reward"

        );

    }

    setEnabled(enabled) {

        this.enabled = Boolean(enabled);

    }

    isEnabled() {

        return this.enabled;

    }

}