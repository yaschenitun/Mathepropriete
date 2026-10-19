export class MovementReconciliation {

    constructor(options = {}) {

        this.maxHistory =
            Number(options.maxHistory ?? 32);

        this.tolerance =
            Number(options.tolerance ?? 0.1);

        this.history = new Map();

    }

    getPlayerHistory(playerId) {

        if (!this.history.has(playerId)) {

            this.history.set(
                playerId,
                []
            );

        }

        return this.history.get(
            playerId
        );

    }

    record(
        playerId,
        state
    ) {

        if (!playerId || !state) {

            return false;

        }

        const history =
            this.getPlayerHistory(
                playerId
            );

        history.push({

            ...state,

            timestamp:
                state.timestamp ??
                Date.now()

        });

        while (
            history.length >
            this.maxHistory
        ) {

            history.shift();

        }

        return true;

    }

    getLatest(playerId) {

        const history =
            this.getPlayerHistory(
                playerId
            );

        return (
            history[
                history.length - 1
            ] ?? null
        );

    }

    compare(
        authoritative,
        client
    ) {

        if (
            !authoritative ||
            !client
        ) {

            return {

                matching: false,

                reason:
                    "missing_state"

            };

        }

        const dx =
            Number(client.x ?? 0) -
            Number(authoritative.x ?? 0);

        const dy =
            Number(client.y ?? 0) -
            Number(authoritative.y ?? 0);

        const dz =
            Number(client.z ?? 0) -
            Number(authoritative.z ?? 0);

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy +
                dz * dz
            );

        return {

            matching:
                distance <= this.tolerance,

            distance,

            difference: {
                x: dx,
                y: dy,
                z: dz
            }

        };

    }

    reconcile(
        playerId,
        authoritative,
        client
    ) {

        const comparison =
            this.compare(
                authoritative,
                client
            );

        this.record(
            playerId,
            authoritative
        );

        if (comparison.matching) {

            return {

                corrected: false,

                state:
                    client,

                comparison

            };

        }

        return {

            corrected: true,

            state: {
                ...authoritative
            },

            comparison

        };

    }

    clear(playerId = null) {

        if (playerId === null) {

            this.history.clear();

            return;

        }

        this.history.delete(
            playerId
        );

    }

}