export class SpeedValidator {

    constructor(options = {}) {

        this.maxSpeed =
            options.maxSpeed ?? 12;

        this.tolerance =
            options.tolerance ?? 1.25;

        this.players = new Map();

    }

    validate(playerId, velocity, timestamp = Date.now()) {

        if (

            !playerId ||

            !velocity ||

            !Number.isFinite(velocity.x) ||

            !Number.isFinite(velocity.y) ||

            !Number.isFinite(velocity.z)

        ) {

            return {
                valid: false,
                reason: "invalid_velocity"
            };

        }

        const speed = Math.sqrt(

            velocity.x * velocity.x +

            velocity.y * velocity.y +

            velocity.z * velocity.z

        );

        const allowedSpeed =

            this.maxSpeed * this.tolerance;

        const result = {

            valid: speed <= allowedSpeed,

            reason:

                speed <= allowedSpeed

                    ? null

                    : "speed_exceeded",

            speed,

            allowedSpeed,

            timestamp

        };

        this.players.set(playerId, {

            speed,

            timestamp

        });

        return result;

    }

    getLastSpeed(playerId) {

        return (

            this.players.get(playerId)?.speed ?? 0

        );

    }

    clearPlayer(playerId) {

        this.players.delete(playerId);

    }

    clear() {

        this.players.clear();

    }

}