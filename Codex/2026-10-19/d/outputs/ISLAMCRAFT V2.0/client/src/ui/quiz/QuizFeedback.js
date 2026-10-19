export class QuizFeedback {

    constructor(game) {

        this.game = game;

        this.visible = false;

        this.correct = false;

        this.message = "";

    }

    async initialize() {

        console.log("QuizFeedback initialisé.");

    }

    show(correct, message = "") {

        this.correct = Boolean(correct);

        this.message = String(message ?? "");

        this.visible = true;

        this.game.eventBus?.emit(

            "quiz:feedback-shown",

            {

                correct: this.correct,

                message: this.message

            }

        );

    }

    hide() {

        this.visible = false;

        this.message = "";

    }

    isCorrect() {

        return this.correct;

    }

    getMessage() {

        return this.message;

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