export class QuizSounds {

    constructor(game) {

        this.game = game;

        this.enabled = true;

    }

    async initialize() {

        console.log("QuizSounds initialisé.");

    }

    playCorrect() {

        if (!this.enabled) {

            return;

        }

        this.game.audioManager?.playSFX?.(

            "quiz_correct"

        );

    }

    playIncorrect() {

        if (!this.enabled) {

            return;

        }

        this.game.audioManager?.playSFX?.(

            "quiz_incorrect"

        );

    }

    playTick() {

        if (!this.enabled) {

            return;

        }

        this.game.audioManager?.playSFX?.(

            "quiz_tick"

        );

    }

    playComplete() {

        if (!this.enabled) {

            return;

        }

        this.game.audioManager?.playSFX?.(

            "quiz_complete"

        );

    }

    setEnabled(enabled) {

        this.enabled = Boolean(enabled);

    }

    isEnabled() {

        return this.enabled;

    }

}