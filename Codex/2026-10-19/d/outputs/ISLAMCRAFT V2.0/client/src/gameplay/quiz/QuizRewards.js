export class QuizRewards {

    constructor(game) {

        this.game = game;

        this.rewardMultiplier = 1;

    }

    async initialize() {

        console.log("QuizRewards initialisé.");

    }

    grant(result) {

        if (!result) {

            return;

        }

        const xp = this.calculateXP(result);

        const coins = this.calculateCoins(result);

        this.game.playerProfile?.addExperience(

            xp

        );

        this.game.playerInventory?.addCoins(

            coins

        );

        this.game.achievementManager?.checkQuizAchievements(

            result

        );

        this.game.eventBus?.emit(

            "quiz:reward",

            {

                xp,

                coins,

                score: result.score

            }

        );

        return {

            xp,

            coins

        };

    }

    calculateXP(result) {

        const baseXP =

            result.score * 10;

        return Math.round(

            baseXP * this.rewardMultiplier

        );

    }

    calculateCoins(result) {

        const baseCoins =

            result.score * 5;

        return Math.round(

            baseCoins * this.rewardMultiplier

        );

    }

    setMultiplier(multiplier) {

        this.rewardMultiplier =

            Math.max(

                0,

                multiplier

            );

    }

    reset() {

        this.rewardMultiplier = 1;

    }

}