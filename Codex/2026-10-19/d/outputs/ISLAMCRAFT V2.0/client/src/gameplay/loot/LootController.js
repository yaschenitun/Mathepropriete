export class LootController {

    constructor(game) {

        this.game = game;

        this.pendingRewards = [];

        this.autoCollect = true;

    }


    async initialize() {

        console.log(
            "LootController initialisé."
        );

    }


    generateLoot(source) {

        if (!source) {
            return [];
        }

        const rewards =
            this.game.lootTable?.generate(
                source
            ) ?? [];

        if (
            !Array.isArray(rewards) ||
            rewards.length === 0
        ) {
            return [];
        }

        this.pendingRewards.push(
            ...rewards
        );

        this.game.rewardAnimation?.play(
            rewards,
            source.position
        );

        this.game.lootPresentation?.show(
            rewards
        );

        this.game.eventBus?.emit(
            "loot:generated",
            {
                source,
                rewards
            }
        );

        return rewards;

    }


    collectReward(
        player,
        reward,
        amount = 1
    ) {

        if (!reward) {
            return false;
        }

        const numericAmount =
            Number(amount);

        const finalAmount =
            Number.isFinite(numericAmount) &&
            numericAmount > 0
                ? numericAmount
                : 1;

        let collected = false;

        switch (reward.type) {

            case "xp":

                if (
                    this.game.playerProfile?.addExperience
                ) {

                    this.game.playerProfile.addExperience(
                        finalAmount
                    );

                    collected = true;

                }

                break;


            case "coins":

                if (
                    this.game.playerInventory?.addCoins
                ) {

                    this.game.playerInventory.addCoins(
                        finalAmount
                    );

                    collected = true;

                }

                break;


            case "item":

                if (
                    reward.id &&
                    this.game.playerInventory?.addItem
                ) {

                    this.game.playerInventory.addItem(
                        reward.id,
                        finalAmount
                    );

                    collected = true;

                }

                break;


            default:

                console.warn(
                    "Récompense inconnue :",
                    reward
                );

                return false;

        }


        if (!collected) {
            return false;
        }


        const pendingIndex =
            this.pendingRewards.indexOf(
                reward
            );

        if (pendingIndex !== -1) {

            this.pendingRewards.splice(
                pendingIndex,
                1
            );

        }


        const collectionData = {

            player,

            reward,

            amount: finalAmount

        };


        this.game.eventBus?.emit(
            "loot:collected",
            collectionData
        );


        this.game.eventBus?.emit(
            "reward:collected",
            collectionData
        );


        return true;

    }


    collectPendingReward(
        player,
        reward,
        amount = 1
    ) {

        if (!reward) {
            return false;
        }

        if (
            !this.pendingRewards.includes(
                reward
            )
        ) {
            return false;
        }

        return this.collectReward(
            player,
            reward,
            amount
        );

    }


    getPendingRewards() {

        return [
            ...this.pendingRewards
        ];

    }


    getPendingRewardCount() {

        return this.pendingRewards.length;

    }


    clear() {

        this.pendingRewards.length = 0;

        this.game.eventBus?.emit(
            "loot:cleared"
        );

    }


    update(deltaTime) {

        if (
            !Number.isFinite(deltaTime) ||
            deltaTime <= 0
        ) {
            return;
        }

        /*
         * Réservé aux extensions du système :
         *
         * - AutoCollect
         * - Loot magnétique
         * - Expiration
         * - Synchronisation réseau
         */

    }

}