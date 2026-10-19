export class AnswerButton {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.visible = true;

        this.answer = null;

    }

    async initialize() {

        console.log("AnswerButton initialisé.");

    }

    setAnswer(answer) {

        this.answer = answer;

    }

    getAnswer() {

        return this.answer;

    }

    click() {

        if (!this.enabled || !this.visible) {

            return;

        }

        this.game.eventBus?.emit(

            "quiz:answer-selected",

            this.answer

        );

    }

    enable() {

        this.enabled = true;

    }

    disable() {

        this.enabled = false;

    }

    show() {

        this.visible = true;

    }

    hide() {

        this.visible = false;

    }

    isEnabled() {

        return this.enabled;

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