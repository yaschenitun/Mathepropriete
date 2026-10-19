export class DifficultyController {

    constructor(game) {

        this.game = game;

        this.currentDifficulty = "easy";

        this.thresholds = {

            easy: 0,

            medium: 10,

            hard: 25,

            expert: 50

        };

    }

    async initialize() {

        console.log("DifficultyController initialisé.");

    }

    update() {

        const level =

            this.game.playerProfile?.level ?? 1;

        const successRate =

            this.game.playerStats?.getSuccessRate?.() ?? 0;

        if (level >= this.thresholds.expert && successRate >= 90) {

            this.currentDifficulty = "expert";

            return;

        }

        if (level >= this.thresholds.hard && successRate >= 75) {

            this.currentDifficulty = "hard";

            return;

        }

        if (level >= this.thresholds.medium && successRate >= 60) {

            this.currentDifficulty = "medium";

            return;

        }

        this.currentDifficulty = "easy";

    }

    getDifficulty() {

        return this.currentDifficulty;

    }

    setDifficulty(difficulty) {

        this.currentDifficulty = difficulty;

    }

    reset() {

        this.currentDifficulty = "easy";

    }

}