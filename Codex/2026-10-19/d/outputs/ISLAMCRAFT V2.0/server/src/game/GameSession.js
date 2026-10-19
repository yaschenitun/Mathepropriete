export class GameSession {

    constructor(data = {}) {

        this.id =
            data.id ?? null;

        this.status =
            data.status ?? "waiting";

        this.players = new Map();

        this.createdAt =
            Number(
                data.createdAt ?? Date.now()
            );

        this.startedAt =
            Number(
                data.startedAt ?? 0
            );

        this.endedAt =
            Number(
                data.endedAt ?? 0
            );

        this.metadata = {

            ...(data.metadata ?? {})

        };

    }

    addPlayer(player) {

        if (!player || !player.id) {

            return false;

        }

        if (this.players.has(player.id)) {

            return false;

        }

        this.players.set(
            player.id,
            player
        );

        return true;

    }

    removePlayer(playerId) {

        return this.players.delete(
            playerId
        );

    }

    getPlayer(playerId) {

        return (
            this.players.get(playerId) ??
            null
        );

    }

    hasPlayer(playerId) {

        return this.players.has(
            playerId
        );

    }

    getPlayers() {

        return [
            ...this.players.values()
        ];

    }

    start(timestamp = Date.now()) {

        if (
            this.status !== "waiting"
        ) {

            return false;

        }

        this.status = "active";

        this.startedAt = timestamp;

        return true;

    }

    finish(timestamp = Date.now()) {

        if (
            this.status === "finished"
        ) {

            return false;

        }

        this.status = "finished";

        this.endedAt = timestamp;

        return true;

    }

    setStatus(status) {

        if (!status) {

            return false;

        }

        this.status = status;

        return true;

    }

    setMetadata(key, value) {

        if (!key) {

            return false;

        }

        this.metadata[key] = value;

        return true;

    }

    getMetadata(key, fallback = null) {

        return (
            this.metadata[key] ??
            fallback
        );

    }

    clearPlayers() {

        this.players.clear();

    }

    serialize() {

        return {

            id: this.id,

            status: this.status,

            players: this.getPlayers().map(
                player =>
                    typeof player.serialize === "function"
                        ? player.serialize()
                        : player
            ),

            createdAt:
                this.createdAt,

            startedAt:
                this.startedAt,

            endedAt:
                this.endedAt,

            metadata:
                { ...this.metadata }

        };

    }

}