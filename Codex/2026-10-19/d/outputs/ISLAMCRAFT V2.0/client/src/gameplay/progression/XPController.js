export class XPController {

    constructor(game) {

        this.game = game;

        this.currentXP = 0;

        this.totalXP = 0;

    }

    async initialize() {

        console.log("XPController initialisé.");

    }

    addXP(amount) {

        if (amount <= 0) {

            return;

        }

        this.currentXP += amount;

        this.totalXP += amount;

        this.game.eventBus?.emit(

            "xp:added",

            {

                amount,

                currentXP: this.currentXP,

                totalXP: this.totalXP

            }

        );

    }

    consumeXP(amount) {

        this.currentXP = Math.max(

            0,

            this.currentXP - amount

        );

    }

    getCurrentXP() {

        return this.currentXP;

    }

    getTotalXP() {

        return this.totalXP;

    }

    setCurrentXP(amount) {

        this.currentXP = Math.max(

            0,

            amount

        );

    }

    reset() {

        this.currentXP = 0;

        this.totalXP = 0;

    }

    update(deltaTime) {

        // Extensions futures :
        // Bonus XP temporaires
        // Multiplicateurs
        // Double XP
        // Synchronisation réseau

    }

}