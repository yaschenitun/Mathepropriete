export class ScoreController {

    constructor(game) {

        this.game = game;

        this.score = 0;

        this.bestScore = 0;

        this.multiplier = 1;

    }

    async initialize() {

        console.log("ScoreController initialisé.");

    }

    addScore(points) {

        if (points <= 0) {

            return;

        }

        const finalScore = Math.floor(

            points * this.multiplier

        );

        this.score += finalScore;

        if (this.score > this.bestScore) {

            this.bestScore = this.score;

        }

        this.game.leaderboardController?.addEntry(

            this.game.localPlayer?.id,

            this.game.localPlayer?.name,

            this.score

        );

        this.game.eventBus?.emit(

            "score:changed",

            {

                score: this.score,

                bestScore: this.bestScore,

                added: finalScore

            }

        );

    }

    removeScore(points) {

        if (points <= 0) {

            return;

        }

        this.score = Math.max(

            0,

            this.score - points

        );

    }

    setMultiplier(multiplier) {

        this.multiplier = Math.max(

            1,

            multiplier

        );

    }

    resetMultiplier() {

        this.multiplier = 1;

    }

    getScore() {

        return this.score;

    }

    getBestScore() {

        return this.bestScore;

    }

    reset() {

        this.score = 0;

        this.multiplier = 1;

    }

    update(deltaTime) {

        // Réservé :
        // Bonus temporaires
        // Combo
        // Multiplicateurs
        // Synchronisation réseau

    }

}