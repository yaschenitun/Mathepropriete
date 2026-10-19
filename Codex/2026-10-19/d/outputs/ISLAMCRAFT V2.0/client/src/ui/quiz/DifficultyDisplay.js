export class DifficultyDisplay {

    constructor(game) {

        this.game = game;

        this.visible = true;

        this.difficulty = null;

    }

    async initialize() {

        console.log("DifficultyDisplay initialisé.");

    }

    setDifficulty(difficulty) {

        this.difficulty = difficulty;

        this.game.eventBus?.emit(

            "quiz:difficulty-changed",

            difficulty

        );

    }

    getDifficulty() {

        return this.difficulty;

    }

    show() {

        this.visible = true;

    }

    hide() {

        this.visible = false;

    }

    isVisible() {

        return this.visible;

    }

    update(deltaTime) {

        if (!this.visible) {

            return;

        }

    }

}