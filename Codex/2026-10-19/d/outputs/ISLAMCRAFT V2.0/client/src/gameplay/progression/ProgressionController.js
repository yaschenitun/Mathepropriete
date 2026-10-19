export class ProgressionController {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.initialized = false;

    }

    async initialize() {

        this.initialized = true;

        console.log("ProgressionController initialisé.");

    }

    addXP(amount) {

        if (!this.enabled || amount <= 0) {

            return false;

        }

        const xpController = this.game.xpController;

        const levelController = this.game.levelController;

        if (!xpController || !levelController) {

            return false;

        }

        xpController.addXP(amount);

        while (levelController.canLevelUp()) {

            levelController.levelUp();

        }

        return true;

    }

    getLevel() {

        return this.game.levelController?.getLevel() ?? 1;

    }

    getCurrentXP() {

        return this.game.xpController?.getCurrentXP() ?? 0;

    }

    getRequiredXP() {

        return this.game.levelController?.getRequiredXP() ?? 0;

    }

    getProgress() {

        return this.game.levelController?.getProgress() ?? 0;

    }

    reset() {

        this.game.xpController?.reset();

        this.game.levelController?.reset();

    }

    update(deltaTime) {

        // Réservé :
        // Bonus temporaires
        // Multiplicateurs d'XP
        // Événements saisonniers
        // Synchronisation réseau

    }

}