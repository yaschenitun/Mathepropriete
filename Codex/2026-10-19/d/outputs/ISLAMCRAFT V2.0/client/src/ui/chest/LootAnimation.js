export class LootAnimation {

    constructor(game) {

        this.game = game;

        this.active = false;

        this.elapsedTime = 0;

        this.duration = 1000;

        this.reward = null;

    }

    async initialize() {

        console.log("LootAnimation initialisée.");

    }

    play(reward = null) {

        this.reward = reward;

        this.elapsedTime = 0;

        this.active = true;

        this.game.eventBus?.emit(

            "loot:animation-started",

            reward

        );

    }

    update(deltaTime) {

        if (!this.active) {

            return;

        }

        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.duration) {

            this.finish();

        }

    }

    finish() {

        if (!this.active) {

            return;

        }

        this.active = false;

        this.game.eventBus?.emit(

            "loot:animation-finished",

            this.reward

        );

    }

    stop() {

        this.active = false;

        this.elapsedTime = 0;

        this.reward = null;

    }

    isPlaying() {

        return this.active;

    }

    getProgress() {

        if (this.duration <= 0) {

            return 1;

        }

        return Math.min(

            this.elapsedTime / this.duration,

            1

        );

    }

}