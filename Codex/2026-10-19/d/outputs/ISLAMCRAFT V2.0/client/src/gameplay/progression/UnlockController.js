export class UnlockController {

    constructor(game) {

        this.game = game;

        this.unlockedFeatures = new Set();

    }

    async initialize() {

        console.log("UnlockController initialisé.");

    }

    onLevelUp(level) {

        const unlocks = this.getUnlocksForLevel(level);

        for (const unlock of unlocks) {

            this.unlock(unlock);

        }

    }

    unlock(featureId) {

        if (this.unlockedFeatures.has(featureId)) {

            return false;

        }

        this.unlockedFeatures.add(featureId);

        this.game.eventBus?.emit(

            "progression:unlock",

            {

                featureId

            }

        );

        return true;

    }

    lock(featureId) {

        this.unlockedFeatures.delete(featureId);

    }

    isUnlocked(featureId) {

        return this.unlockedFeatures.has(featureId);

    }

    getUnlocksForLevel(level) {

        const unlockTable =

            this.game.gameData?.progression?.unlockTable

            ?? {};

        return unlockTable[level] ?? [];

    }

    getUnlockedFeatures() {

        return [

            ...this.unlockedFeatures

        ];

    }

    reset() {

        this.unlockedFeatures.clear();

    }

    update(deltaTime) {

        // Extensions futures :
        // Déblocages temporaires
        // Événements spéciaux
        // Pass saisonnier
        // Succès

    }

}