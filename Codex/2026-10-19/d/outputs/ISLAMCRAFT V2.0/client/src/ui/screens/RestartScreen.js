export class RestartScreen {

    constructor(game) {

        this.game = game;

        this.visible = false;

        this.remainingTime = 0;

    }

    async initialize() {

        console.log("RestartScreen initialisé.");

    }

    show(remainingTime = 0) {

        this.remainingTime = Math.max(

            0,

            Number(remainingTime) || 0

        );

        this.visible = true;

        this.game.eventBus?.emit(

            "screen:restart-shown",

            this.remainingTime

        );

    }

    hide() {

        this.visible = false;

        this.remainingTime = 0;

        this.game.eventBus?.emit(

            "screen:restart-hidden"

        );

    }

    setRemainingTime(seconds) {

        this.remainingTime = Math.max(

            0,

            Number(seconds) || 0

        );

    }

    getRemainingTime() {

        return this.remainingTime;

    }

    isVisible() {

        return this.visible;

    }

    update(deltaTime) {

        if (!this.visible) {

            return;

        }

        this.remainingTime = Math.max(

            0,

            this.remainingTime - deltaTime

        );

    }

}