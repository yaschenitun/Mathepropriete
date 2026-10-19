export class SuspiciousActivityDetector {

    constructor(options = {}) {

        this.threshold =
            options.threshold ?? 3;

        this.windowMs =
            options.windowMs ?? 10000;

        this.activities = new Map();

    }

    record(playerId, type, details = {}, timestamp = Date.now()) {

        if (!playerId || !type) {

            return {
                suspicious: false,
                reason: "invalid_activity"
            };

        }

        let playerActivities =
            this.activities.get(playerId);

        if (!playerActivities) {

            playerActivities = [];

            this.activities.set(

                playerId,

                playerActivities

            );

        }

        const windowStart =
            timestamp - this.windowMs;

        const recent =
            playerActivities.filter(

                activity =>
                    activity.timestamp >= windowStart

            );

        recent.push({

            type,

            details,

            timestamp

        });

        this.activities.set(

            playerId,

            recent

        );

        const sameTypeCount =
            recent.filter(

                activity =>
                    activity.type === type

            ).length;

        const suspicious =
            sameTypeCount >= this.threshold;

        return {

            suspicious,

            reason: suspicious

                ? "repeated_activity"

                : null,

            type,

            count: sameTypeCount

        };

    }

    getRecent(playerId, timestamp = Date.now()) {

        const activities =
            this.activities.get(playerId) ?? [];

        const windowStart =
            timestamp - this.windowMs;

        return activities.filter(

            activity =>
                activity.timestamp >= windowStart

        );

    }

    clearPlayer(playerId) {

        this.activities.delete(playerId);

    }

    clear() {

        this.activities.clear();

    }

}