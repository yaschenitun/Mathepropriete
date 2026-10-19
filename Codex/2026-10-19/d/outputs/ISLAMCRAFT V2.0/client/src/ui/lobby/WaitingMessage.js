export class WaitingMessage {

    constructor(game) {

        this.game = game;

        this.visible = false;

        this.message = "En attente des joueurs...";

    }

    async initialize() {

        console.log("WaitingMessage initialisé.");

    }

    show(message = this.message) {

        this.message = message;

        this.visible = true;

    }

    hide() {

        this.visible = false;

    }

    setMessage(message) {

        this.message = String(message ?? "");

        this.game.eventBus?.emit(

            "lobby:waiting-message-changed",

            this.message

        );

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