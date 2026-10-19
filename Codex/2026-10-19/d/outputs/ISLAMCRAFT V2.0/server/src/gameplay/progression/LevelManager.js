export class LevelManager {

    constructor(options = {}) {

        this.xpManager =
            options.xpManager ?? null;

        this.maxLevel =
            Number(options.maxLevel ?? 100);

        this.rewards = new Map();

        if (options.rewards) {

            this.loadRewards(
                options.rewards
            );

        }

    }

    initialize(xpManager) {

        this.xpManager = xpManager;

        return this;

    }

    setReward(level, reward) {

        level = Math.max(
            1,
            Math.floor(Number(level))
        );

        this.rewards.set(
            level,
            reward
        );

        return this;

    }

    loadRewards(rewards) {

        if (Array.isArray(rewards)) {

            for (const entry of rewards) {

                if (
                    entry &&
                    entry.level !== undefined
                ) {

                    this.setReward(
                        entry.level,
                        entry.reward
                    );

                }

            }

            return this;

        }

        if (
            rewards &&
            typeof rewards === "object"
        ) {

            for (const [level, reward] of
                Object.entries(rewards)
            ) {

                this.setReward(
                    Number(level),
                    reward
                );

            }

        }

        return this;

    }

    getLevel(totalXP) {

        if (!this.xpManager) {

            return 1;

        }

        return this.xpManager.getLevelFromXP(
            totalXP
        );

    }

    getReward(level) {

        return (
            this.rewards.get(
                Number(level)
            ) ?? null
        );

    }

    getRewardsBetween(
        previousLevel,
        currentLevel
    ) {

        const rewards = [];

        const start =
            Math.max(
                1,
                Number(previousLevel) + 1
            );

        const end =
            Math.min(
                this.maxLevel,
                Number(currentLevel)
            );

        for (
            let level = start;
            level <= end;
            level++
        ) {

            const reward =
                this.getReward(level);

            if (reward !== null) {

                rewards.push({

                    level,

                    reward

                });

            }

        }

        return rewards;

    }

    getAllRewards() {

        return [
            ...this.rewards.entries()
        ].map(
            ([level, reward]) => ({
                level,
                reward
            })
        );

    }

}