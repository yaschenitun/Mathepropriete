export class RewardPopup {

    constructor(game) {

        this.game = game;

        this.visible = false;

        this.reward = null;

        this.elapsedTime = 0;

        this.duration = 3000;

    }

    async initialize() {

        console.log("RewardPopup initialisé.");

    }

    show(reward) {

        this.reward = reward;

        this.elapsedTime = 0;

        this.visible = true;

        this.game.eventBus?.emit(

            "reward-popup:shown",

            reward

        );

    }

    hide() {

        this.visible = false;

        this.reward = null;

        this.elapsedTime = 0;

    }

    update(deltaTime) {

        if (!this.visible) {

            return;

        }

        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.duration) {

            this.hide();

        }

    }

    setDuration(duration) {

        this.duration = Math.max(

            0,

            duration

        );

    }

    getReward() {

        return this.reward;

    }

    isVisible() {

        return this.visible;

    }

}