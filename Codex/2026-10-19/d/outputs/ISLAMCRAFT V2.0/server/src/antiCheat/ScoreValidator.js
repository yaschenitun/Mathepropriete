export class ScoreValidator {

    constructor(options = {}) {

        this.maxRewardPerAction =
            options.maxRewardPerAction ?? 1000;

        this.players = new Map();

    }

    validate(playerId, reward, reason = "") {

        if (!playerId || !Number.isFinite(reward)) {

            return {
                valid: false,
                reason: "invalid_score"
            };

        }

        if (reward < 0) {

            return {
                valid: false,
                reason: "negative_reward"
            };

        }

        if (reward > this.maxRewardPerAction) {

            return {
                valid: false,
                reason: "reward_exceeded"
            };

        }

        const previous =

            this.players.get(playerId) ?? 0;

        const total = previous + reward;

        this.players.set(playerId, total);

        return {
            valid: true,
            reason: null,
            reward,
            total,
            source: reason
        };

    }

    getTotal(playerId) {

        return this.players.get(playerId) ?? 0;

    }

    resetPlayer(playerId) {

        this.players.delete(playerId);

    }

    clear() {

        this.players.clear();

    }

}