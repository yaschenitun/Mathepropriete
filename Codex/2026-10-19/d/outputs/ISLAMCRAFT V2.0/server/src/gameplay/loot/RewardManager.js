export class RewardManager {

    constructor(options = {}) {

        this.inventoryService =
            options.inventoryService ?? null;

        this.rewards = [];

        this.maxHistory =
            Number(
                options.maxHistory ?? 1000
            );

    }

    initialize(services = {}) {

        if (services.inventoryService) {

            this.inventoryService =
                services.inventoryService;

        }

        return this;

    }

    give(player, rewards = []) {

        if (!player) {

            return {
                success: false,
                reason: "missing_player"
            };

        }

        const granted = [];

        for (const reward of rewards) {

            if (
                !reward ||
                !reward.item
            ) {

                continue;

            }

            const amount =
                Math.max(
                    1,
                    Number(reward.amount ?? 1)
                );

            let accepted = true;

            if (
                this.inventoryService &&
                typeof this.inventoryService.addItem ===
                    "function"
            ) {

                accepted =
                    this.inventoryService.addItem(
                        player,
                        reward.item,
                        amount,
                        reward.metadata ?? {}
                    );

            } else if (
                typeof player.addItem ===
                    "function"
            ) {

                accepted =
                    player.addItem(
                        reward.item,
                        amount,
                        reward.metadata ?? {}
                    );

            }

            if (accepted === false) {

                continue;

            }

            const grantedReward = {

                playerId:
                    player.id ?? null,

                item:
                    reward.item,

                amount,

                metadata:
                    reward.metadata
                        ? {
                            ...reward.metadata
                        }
                        : {},

                timestamp:
                    Date.now()

            };

            granted.push(
                grantedReward
            );

            this.rewards.push(
                grantedReward
            );

        }

        this.trimHistory();

        return {

            success: true,

            rewards: granted

        };

    }

    trimHistory() {

        while (
            this.rewards.length >
            this.maxHistory
        ) {

            this.rewards.shift();

        }

    }

    getHistory(playerId = null) {

        if (playerId === null) {

            return [
                ...this.rewards
            ];

        }

        return this.rewards.filter(
            reward =>
                reward.playerId === playerId
        );

    }

    clearHistory() {

        this.rewards.length = 0;

    }

}