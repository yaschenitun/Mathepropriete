export class LoadingScreen {

    constructor(game) {

        this.game = game;

        this.visible = false;

        this.progress = 0;

        this.message = "";

    }

    async initialize() {

        console.log("LoadingScreen initialisé.");

    }

    show(message = "") {

        this.message = String(message ?? "");

        this.visible = true;

        this.game.eventBus?.emit(

            "screen:loading-shown",

            {

                message: this.message,

                progress: this.progress

            }

        );

    }

    hide() {

        this.visible = false;

        this.game.eventBus?.emit(

            "screen:loading-hidden"

        );

    }

    setProgress(progress) {

        this.progress = Math.max(

            0,

            Math.min(

                1,

                Number(progress) || 0

            )

        );

        this.game.eventBus?.emit(

            "screen:loading-progress",

            this.progress

        );

    }

    setMessage(message) {

        this.message = String(message ?? "");

    }

    getProgress() {

        return this.progress;

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