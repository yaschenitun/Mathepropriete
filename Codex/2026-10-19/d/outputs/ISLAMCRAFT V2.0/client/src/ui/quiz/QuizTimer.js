export class QuizTimer {

    constructor(game) {

        this.game = game;

        this.visible = true;

        this.duration = 0;

        this.remaining = 0;

        this.running = false;

    }

    async initialize() {

        console.log("QuizTimer initialisé.");

    }

    start(duration) {

        this.duration = Math.max(

            0,

            Number(duration) || 0

        );

        this.remaining = this.duration;

        this.running = true;

        this.game.eventBus?.emit(

            "quiz:timer-started",

            this.remaining

        );

    }

    stop() {

        this.running = false;

    }

    reset() {

        this.remaining = this.duration;

        this.running = false;

    }

    update(deltaTime) {

        if (!this.running) {

            return;

        }

        this.remaining = Math.max(

            0,

            this.remaining - deltaTime

        );

        this.game.eventBus?.emit(

            "quiz:timer-updated",

            this.remaining

        );

        if (this.remaining <= 0) {

            this.running = false;

            this.game.eventBus?.emit(

                "quiz:timer-finished"

            );

        }

    }

    getRemaining() {

        return this.remaining;

    }

    getDuration() {

        return this.duration;

    }

    isRunning() {

        return this.running;

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

}