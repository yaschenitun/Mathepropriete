export class MatchEndManager {

    constructor(options = {}) {

        this.victoryManager =
            options.victoryManager ?? null;

        this.rewardManager =
            options.rewardManager ?? null;

        this.progressionManager =
            options.progressionManager ?? null;

        this.ended = false;

        this.result = null;

        this.callbacks = new Set();

    }

    initialize(services = {}) {

        if (services.victoryManager) {

            this.victoryManager =
                services.victoryManager;

        }

        if (services.rewardManager) {

            this.rewardManager =
                services.rewardManager;

        }

        if (services.progressionManager) {

            this.progressionManager =
                services.progressionManager;

        }

        return this;

    }

    onMatchEnd(callback) {

        if (
            typeof callback !==
            "function"
        ) {

            throw new TypeError(
                "Match end callback must be a function."
            );

        }

        this.callbacks.add(callback);

        return () =>
            this.callbacks.delete(callback);

    }

    endMatch(data = {}) {

        if (this.ended) {

            return {

                success: false,

                reason:
                    "match_already_ended",

                result:
                    this.getResult()

            };

        }

        const winnerId =
            data.winnerId ??
            this.victoryManager?.getWinnerId() ??
            null;

        const result = {

            winnerId,

            reason:
                data.reason ??
                "match_completed",

            conditionId:
                data.conditionId ??
                null,

            players:
                Array.isArray(data.players)
                    ? [...data.players]
                    : [],

            rewards:
                data.rewards
                    ? {
                        ...data.rewards
                    }
                    : {},

            metadata:
                data.metadata
                    ? {
                        ...data.metadata
                    }
                    : {},

            timestamp:
                Date.now()

        };

        this.result =
            result;

        this.ended = true;

        for (
            const callback
            of this.callbacks
        ) {

            try {

                callback(
                    this.getResult()
                );

            } catch {

                // A callback must not
                // interrupt match finalization.

            }

        }

        return {

            success: true,

            result:
                this.getResult()

        };

    }

    awardWinner(
        playerId,
        reward = {}
    ) {

        if (!playerId) {

            return {

                success: false,

                reason:
                    "missing_player"

            };

        }

        if (
            this.progressionManager
        ) {

            const xp =
                Number(
                    reward.xp ?? 0
                );

            if (xp > 0) {

                return {

                    success: true,

                    progression:
                        this.progressionManager.addXP(
                            playerId,
                            xp,
                            {
                                source:
                                    "match_victory"
                            }
                        )

                };

            }

        }

        return {

            success: true,

            reward: {
                ...reward
            }

        };

    }

    isEnded() {

        return this.ended;

    }

    getResult() {

        if (!this.result) {

            return null;

        }

        return {

            ...this.result,

            players: [
                ...this.result.players
            ],

            rewards: {
                ...this.result.rewards
            },

            metadata: {
                ...this.result.metadata
            }

        };

    }

    reset() {

        this.ended = false;

        this.result = null;

        return this;

    }

    serialize() {

        return {

            ended:
                this.ended,

            result:
                this.getResult()

        };

    }

}