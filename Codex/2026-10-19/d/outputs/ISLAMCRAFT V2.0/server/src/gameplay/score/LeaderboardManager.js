export class LeaderboardManager {

    constructor(options = {}) {

        this.entries = new Map();

        this.maxEntries =
            Number(options.maxEntries ?? 100);

        this.sortDescending =
            options.sortDescending !== false;

    }

    setScore(playerId, score, metadata = {}) {

        if (!playerId) {
            return false;
        }

        const numericScore =
            Number(score);

        if (!Number.isFinite(numericScore)) {
            return false;
        }

        this.entries.set(playerId, {
            playerId,
            score: numericScore,
            metadata: { ...metadata },
            updatedAt: Date.now()
        });

        return true;
    }

    addScore(playerId, amount, metadata = {}) {

        const current =
            this.entries.get(playerId);

        const currentScore =
            current?.score ?? 0;

        return this.setScore(
            playerId,
            currentScore + Number(amount || 0),
            {
                ...(current?.metadata ?? {}),
                ...metadata
            }
        );
    }

    getSortedEntries() {

        const entries = [
            ...this.entries.values()
        ];

        entries.sort((a, b) =>
            this.sortDescending
                ? b.score - a.score
                : a.score - b.score
        );

        return entries;
    }

    getTop(limit = this.maxEntries) {

        return this.getSortedEntries()
            .slice(
                0,
                Math.max(0, Number(limit))
            )
            .map((entry, index) => ({
                rank: index + 1,
                ...entry
            }));

    }

    getPlayerRank(playerId) {

        const entries =
            this.getSortedEntries();

        const index =
            entries.findIndex(
                entry =>
                    entry.playerId === playerId
            );

        if (index === -1) {
            return null;
        }

        return index + 1;
    }

    getPlayer(playerId) {

        return (
            this.entries.get(playerId) ??
            null
        );

    }

    removePlayer(playerId) {

        return this.entries.delete(
            playerId
        );

    }

    clear() {

        this.entries.clear();

    }

    serialize() {

        return this.getSortedEntries()
            .slice(0, this.maxEntries)
            .map((entry, index) => ({
                rank: index + 1,
                ...entry
            }));

    }

}