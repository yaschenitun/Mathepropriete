export class VictorySounds {

    constructor(game) {

        this.game = game;

        this.enabled = true;

    }

    async initialize() {

        console.log("VictorySounds initialisé.");

    }

    playVictory() {

        if (!this.enabled) {

            return;

        }

        this.game.audioManager?.playSFX?.(

            "victory"

        );

    }

    playDefeat() {

        if (!this.enabled) {

            return;

        }

        this.game.audioManager?.playSFX?.(

            "defeat"

        );

    }

    playLevelComplete() {

        if (!this.enabled) {

            return;

        }

        this.game.audioManager?.playSFX?.(

            "level_complete"

        );

    }

    setEnabled(enabled) {

        this.enabled = Boolean(enabled);

    }

    isEnabled() {

        return this.enabled;

    }

}