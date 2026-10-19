export class PlayerDataStore {

    constructor(options = {}) {

        this.players = new Map();

        this.maxEntries =
            Math.max(
                1,
                Number(options.maxEntries ?? 10000)
            );

    }

    create(playerId, data = {}) {

        if (!playerId) {

            return {
                success: false,
                reason: "missing_player_id"
            };

        }

        if (this.players.has(playerId)) {

            return {
                success: false,
                reason: "player_already_exists"
            };

        }

        const record = {

            id: playerId,

            data: {
                ...data
            },

            createdAt:
                Date.now(),

            updatedAt:
                Date.now()

        };

        this.players.set(
            playerId,
            record
        );

        this._enforceLimit();

        return {

            success: true,

            player:
                this._clone(record)

        };

    }

    save(playerId, data = {}) {

        const existing =
            this.players.get(playerId);

        if (!existing) {

            return this.create(
                playerId,
                data
            );

        }

        existing.data = {

            ...existing.data,

            ...data

        };

        existing.updatedAt =
            Date.now();

        return {

            success: true,

            player:
                this._clone(existing)

        };

    }

    set(playerId, path, value) {

        const existing =
            this.players.get(playerId);

        if (!existing) {

            return {

                success: false,

                reason:
                    "player_not_found"

            };

        }

        const parts =
            String(path)
                .split(".")
                .filter(Boolean);

        if (parts.length === 0) {

            return {

                success: false,

                reason:
                    "invalid_path"

            };

        }

        let target =
            existing.data;

        for (
            let index = 0;
            index < parts.length - 1;
            index++
        ) {

            const key =
                parts[index];

            if (
                !target[key] ||
                typeof target[key] !== "object"
            ) {

                target[key] = {};

            }

            target =
                target[key];

        }

        target[
            parts[parts.length - 1]
        ] = value;

        existing.updatedAt =
            Date.now();

        return {

            success: true,

            player:
                this._clone(existing)

        };

    }

    get(playerId) {

        const record =
            this.players.get(playerId);

        return record
            ? this._clone(record)
            : null;

    }

    getData(playerId) {

        const record =
            this.players.get(playerId);

        return record
            ? this._clone(record.data)
            : null;

    }

    has(playerId) {

        return this.players.has(
            playerId
        );

    }

    delete(playerId) {

        return this.players.delete(
            playerId
        );

    }

    list() {

        return [
            ...this.players.values()
        ].map(
            player =>
                this._clone(player)
        );

    }

    count() {

        return this.players.size;

    }

    clear() {

        this.players.clear();

    }

    _enforceLimit() {

        while (
            this.players.size >
            this.maxEntries
        ) {

            const oldestId =
                this.players.keys().next().value;

            this.players.delete(
                oldestId
            );

        }

    }

    _clone(value) {

        return JSON.parse(
            JSON.stringify(value)
        );

    }

}