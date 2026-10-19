export class LootPanel {

    constructor(game) {

        this.game = game;

        this.visible = false;

        this.rewards = [];

    }

    async initialize() {

        console.log("LootPanel initialisé.");

    }

    show(rewards = []) {

        this.rewards = Array.isArray(rewards)

            ? [...rewards]

            : [];

        this.visible = true;

        this.game.eventBus?.emit(

            "loot:panel-opened",

            this.rewards

        );

    }

    hide() {

        this.visible = false;

        this.game.eventBus?.emit(

            "loot:panel-closed"

        );

    }

    setRewards(rewards) {

        this.rewards = Array.isArray(rewards)

            ? [...rewards]

            : [];

    }

    getRewards() {

        return [...this.rewards];

    }

    isVisible() {

        return this.visible;

    }

    update(deltaTime) {

        if (!this.visible) {

            return;

        }

        // Mise à jour de l'affichage du contenu du coffre.

    }

}