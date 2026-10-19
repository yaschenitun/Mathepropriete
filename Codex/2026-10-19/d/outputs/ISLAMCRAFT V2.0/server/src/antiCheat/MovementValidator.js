export class MovementValidator {

    constructor(options = {}) {

        this.maxDistancePerSecond =
            options.maxDistancePerSecond ?? 12;

        this.players = new Map();

    }

    validate(playerId, position, timestamp = Date.now()) {

        if (

            !playerId ||

            !position ||

            !Number.isFinite(position.x) ||

            !Number.isFinite(position.y) ||

            !Number.isFinite(position.z)

        ) {

            return {
                valid: false,
                reason: "invalid_position"
            };

        }

        const previous = this.players.get(playerId);

        this.players.set(playerId, {

            x: position.x,

            y: position.y,

            z: position.z,

            timestamp

        });

        if (!previous) {

            return {
                valid: true,
                reason: null,
                distance: 0,
                speed: 0
            };

        }

        const elapsed =

            Math.max(

                (timestamp - previous.timestamp) / 1000,

                0.001

            );

        const dx = position.x - previous.x;

        const dy = position.y - previous.y;

        const dz = position.z - previous.z;

        const distance = Math.sqrt(

            dx * dx +

            dy * dy +

            dz * dz

        );

        const speed = distance / elapsed;

        if (speed > this.maxDistancePerSecond) {

            return {
                valid: false,
                reason: "movement_speed_exceeded",
                distance,
                speed
            };

        }

        return {
            valid: true,
            reason: null,
            distance,
            speed
        };

    }

    clearPlayer(playerId) {

        this.players.delete(playerId);

    }

    clear() {

        this.players.clear();

    }

}