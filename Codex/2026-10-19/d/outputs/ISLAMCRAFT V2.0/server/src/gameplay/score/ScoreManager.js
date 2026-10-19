export class ScoreManager {

    constructor(options = {}) {

        this.scores = new Map();

        this.multipliers = new Map();

        this.defaultMultiplier =
            Number(
                options.defaultMultiplier ?? 1
            );

    }

    getScore(playerId) {

        return (
            this.scores.get(playerId) ?? 0
        );

    }

    setScore(playerId, score) {

        const value =
            Math.max(
                0,
                Number(score) || 0
            );

        this.scores.set(
            playerId,
            value
        );

        return value;

    }

    addScore(playerId, amount, source = null) {

        const multiplier =
            this.getMultiplier(
                playerId,
                source
            );

        const value =
            Number(amount) *
            multiplier;

        const score =
            this.getScore(playerId) +
            Math.max(0, value);

        return this.setScore(
            playerId,
            score
        );

    }

    subtractScore(playerId, amount) {

        const score =
            Math.max(
                0,
                this.getScore(playerId) -
                Math.max(
                    0,
                    Number(amount) || 0
                )
            );

        return this.setScore(
            playerId,
            score
        );

    }

    setMultiplier(
        playerId,
        multiplier
    ) {

        const value =
            Math.max(
                0,
                Number(multiplier)
            );

        this.multipliers.set(
            playerId,
            value
        );

        return value;

    }

    getMultiplier(
        playerId,
        source = null
    ) {

        if (source) {

            const sourceMultiplier =
                this.multipliers.get(
                    `${playerId}:${source}`
                );

            if (
                sourceMultiplier !== undefined
            ) {

                return sourceMultiplier;

            }

        }

        return (
            this.multipliers.get(
                playerId
            ) ??
            this.defaultMultiplier
        );

    }

    reset(playerId) {

        this.scores.set(
            playerId,
            0
        );

        return 0;

    }

    remove(playerId) {

        this.multipliers.delete(
            playerId
        );

        return this.scores.delete(
            playerId
        );

    }

    getAll() {

        return [
            ...this.scores.entries()
        ].map(
            ([playerId, score]) => ({
                playerId,
                score
            })
        );

    }

    clear() {

        this.scores.clear();
        this.multipliers.clear();

    }

}