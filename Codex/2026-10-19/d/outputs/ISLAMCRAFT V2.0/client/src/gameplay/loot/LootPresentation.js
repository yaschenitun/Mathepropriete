export class LootPresentation {

    constructor(game) {

        this.game = game;

        this.queue = [];

        this.displayDuration = 3;

        this.currentDisplay = null;

        this.displayTimer = 0;

    }

    async initialize() {

        console.log("LootPresentation initialisé.");

    }

    show(rewards) {

        if (!Array.isArray(rewards) || rewards.length === 0) {

            return;

        }

        this.queue.push(...rewards);

    }

    display(reward) {

        this.currentDisplay = reward;

        this.displayTimer = this.displayDuration;

        this.game.uiManager?.showLootReward?.(

            reward

        );

    }

    hide() {

        this.currentDisplay = null;

        this.game.uiManager?.hideLootReward?.();

    }

    update(deltaTime) {

        if (!this.currentDisplay && this.queue.length > 0) {

            this.display(

                this.queue.shift()

            );

        }

        if (!this.currentDisplay) {

            return;

        }

        this.displayTimer -= deltaTime;

        if (this.displayTimer <= 0) {

            this.hide();

        }

    }

    clear() {

        this.queue.length = 0;

        this.hide();

    }

}