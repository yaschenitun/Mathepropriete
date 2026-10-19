export class ClientPrediction {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.pendingInputs = [];

    }

    async initialize() {

        console.log("ClientPrediction initialisé.");

    }

    addInput(input) {

        if (!this.enabled) {

            return;

        }

        this.pendingInputs.push(input);

    }

    predict(player, deltaTime) {

        if (!this.enabled || !player) {

            return;

        }

        for (const input of this.pendingInputs) {

            player.applyInput?.(

                input,

                deltaTime

            );

        }

    }

    acknowledge(sequence) {

        this.pendingInputs = this.pendingInputs.filter(

            input => input.sequence > sequence

        );

    }

    clear() {

        this.pendingInputs.length = 0;

    }

    update(deltaTime) {

        // La prédiction est exécutée
        // lors de la simulation locale.

    }

    setEnabled(enabled) {

        this.enabled = enabled;

    }

    isEnabled() {

        return this.enabled;

    }

}