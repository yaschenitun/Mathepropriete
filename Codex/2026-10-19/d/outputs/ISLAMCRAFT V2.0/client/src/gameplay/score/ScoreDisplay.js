export class ScoreDisplay {

    constructor(game) {

        this.game = game;

        this.visible = true;

        this.lastScore = -1;

        this.lastBestScore = -1;

    }

    async initialize() {

        console.log("ScoreDisplay initialisé.");

    }

    update(deltaTime) {

        if (!this.visible) {

            return;

        }

        const scoreController = this.game.scoreController;

        if (!scoreController) {

            return;

        }

        const score = scoreController.getScore();

        const bestScore = scoreController.getBestScore();

        if (

            score !== this.lastScore ||

            bestScore !== this.lastBestScore

        ) {

            this.lastScore = score;

            this.lastBestScore = bestScore;

            this.refresh();

        }

    }

    refresh() {

        this.game.uiManager?.updateScore?.(

            this.lastScore,

            this.lastBestScore

        );

    }

    show() {

        this.visible = true;

        this.refresh();

    }

    hide() {

        this.visible = false;

    }

    isVisible() {

        return this.visible;

    }

}