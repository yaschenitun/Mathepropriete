export class MatchDataStore {

    constructor(options = {}) {

        this.matches = new Map();

        this.maxEntries =
            Math.max(
                1,
                Number(options.maxEntries ?? 1000)
            );

    }

    create(matchId, data = {}) {

        if (!matchId) {

            return {
                success: false,
                reason: "missing_match_id"
            };

        }

        if (this.matches.has(matchId)) {

            return {
                success: false,
                reason: "match_already_exists"
            };

        }

        const record = {

            id: matchId,

            data: {
                ...data
            },

            createdAt:
                Date.now(),

            updatedAt:
                Date.now()

        };

        this.matches.set(
            matchId,
            record
        );

        this._enforceLimit();

        return {

            success: true,

            match:
                this._clone(record)

        };

    }

    save(matchId, data = {}) {

        const existing =
            this.matches.get(matchId);

        if (!existing) {

            return this.create(
                matchId,
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

            match:
                this._clone(existing)

        };

    }

    get(matchId) {

        const record =
            this.matches.get(matchId);

        return record
            ? this._clone(record)
            : null;

    }

    has(matchId) {

        return this.matches.has(
            matchId
        );

    }

    delete(matchId) {

        return this.matches.delete(
            matchId
        );

    }

    list(options = {}) {

        let records = [
            ...this.matches.values()
        ];

        if (options.limit !== undefined) {

            records =
                records.slice(
                    0,
                    Math.max(
                        0,
                        Number(options.limit)
                    )
                );

        }

        return records.map(
            record =>
                this._clone(record)
        );

    }

    clear() {

        this.matches.clear();

    }

    count() {

        return this.matches.size;

    }

    _enforceLimit() {

        while (
            this.matches.size >
            this.maxEntries
        ) {

            const oldestId =
                this.matches.keys().next().value;

            this.matches.delete(
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