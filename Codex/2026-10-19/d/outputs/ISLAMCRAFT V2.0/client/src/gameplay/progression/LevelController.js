export class LevelController {

    constructor(game) {

        this.game = game;

        this.level = 1;

        this.maxLevel = 100;

        this.baseXP = 100;

        this.growthFactor = 1.25;

    }

    async initialize() {

        console.log("LevelController initialisé.");

    }

    getLevel() {

        return this.level;

    }

    setLevel(level) {

        this.level = Math.max(

            1,

            Math.min(level, this.maxLevel)

        );

    }

    canLevelUp() {

        const xpController = this.game.xpController;

        if (!xpController) {

            return false;

        }

        return (

            xpController.getCurrentXP() >=

            this.getRequiredXP()

        );

    }

    levelUp() {

        if (!this.canLevelUp()) {

            return false;

        }

        const xpController = this.game.xpController;

        xpController.consumeXP(

            this.getRequiredXP()

        );

        this.level++;

        this.game.unlockController?.onLevelUp(

            this.level

        );

        this.game.eventBus?.emit(

            "player:level-up",

            {

                level: this.level

            }

        );

        return true;

    }

    getRequiredXP() {

        return Math.floor(

            this.baseXP *

            Math.pow(

                this.growthFactor,

                this.level - 1

            )

        );

    }

    getProgress() {

        const xpController = this.game.xpController;

        if (!xpController) {

            return 0;

        }

        return (

            xpController.getCurrentXP() /

            this.getRequiredXP()

        );

    }

    reset() {

        this.level = 1;

    }

}