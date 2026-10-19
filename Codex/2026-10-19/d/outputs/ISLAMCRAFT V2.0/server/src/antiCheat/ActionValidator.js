export class ActionValidator {

    constructor(options = {}) {

        this.maxActionsPerSecond =
            options.maxActionsPerSecond ?? 20;

        this.history = new Map();

    }

    validate(playerId, action, timestamp = Date.now()) {

        if (!playerId || !action) {

            return {
                valid: false,
                reason: "invalid_action"
            };

        }

        let playerHistory = this.history.get(playerId);

        if (!playerHistory) {

            playerHistory = [];

            this.history.set(playerId, playerHistory);

        }

        const windowStart = timestamp - 1000;

        while (

            playerHistory.length > 0 &&

            playerHistory[0] < windowStart

        ) {

            playerHistory.shift();

        }

        if (

            playerHistory.length >=

            this.maxActionsPerSecond

        ) {

            return {
                valid: false,
                reason: "action_rate_exceeded"
            };

        }

        playerHistory.push(timestamp);

        return {
            valid: true,
            reason: null
        };

    }

    clearPlayer(playerId) {

        this.history.delete(playerId);

    }

    clear() {

        this.history.clear();

    }

}