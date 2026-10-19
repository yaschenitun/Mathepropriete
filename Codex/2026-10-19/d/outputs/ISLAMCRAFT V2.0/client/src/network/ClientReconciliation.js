export class ClientReconciliation {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.lastAcknowledgedSequence = 0;

    }

    async initialize() {

        console.log("ClientReconciliation initialisé.");

    }

    reconcile(serverState) {

        if (!this.enabled || !serverState) {

            return;

        }

        this.lastAcknowledgedSequence =

            serverState.lastProcessedInput ?? 0;

        this.game.localPlayer?.setTransform?.(

            serverState.position,

            serverState.rotation

        );

        this.game.clientPrediction?.acknowledge(

            this.lastAcknowledgedSequence

        );

    }

    getLastAcknowledgedSequence() {

        return this.lastAcknowledgedSequence;

    }

    reset() {

        this.lastAcknowledgedSequence = 0;

    }

    update(deltaTime) {

        // Les corrections sont appliquées
        // à la réception des snapshots serveur.

    }

    setEnabled(enabled) {

        this.enabled = enabled;

    }

    isEnabled() {

        return this.enabled;

    }

}