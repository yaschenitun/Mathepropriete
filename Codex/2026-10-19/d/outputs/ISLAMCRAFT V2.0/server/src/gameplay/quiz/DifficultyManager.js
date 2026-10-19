export class DifficultyManager {

    constructor(options = {}) {

        this.difficulties = new Map();

        this.defaultDifficulty =
            options.defaultDifficulty ?? "easy";

        if (options.difficulties) {

            this.load(
                options.difficulties
            );

        }

    }

    register(id, definition = {}) {

        if (!id) {

            throw new TypeError(
                "Difficulty id is required."
            );

        }

        this.difficulties.set(
            id,
            {
                id,
                multiplier:
                    Number(
                        definition.multiplier ?? 1
                    ),
                timeLimit:
                    Number(
                        definition.timeLimit ?? 30
                    ),
                xpMultiplier:
                    Number(
                        definition.xpMultiplier ?? 1
                    ),
                ...definition
            }
        );

        return this;

    }

    load(definitions) {

        if (Array.isArray(definitions)) {

            for (const definition of definitions) {

                if (definition?.id) {

                    this.register(
                        definition.id,
                        definition
                    );

                }

            }

        } else if (
            definitions &&
            typeof definitions === "object"
        ) {

            for (
                const [id, definition]
                of Object.entries(definitions)
            ) {

                this.register(
                    id,
                    definition
                );

            }

        }

        return this;

    }

    get(id = this.defaultDifficulty) {

        return (
            this.difficulties.get(id) ??
            this.difficulties.get(
                this.defaultDifficulty
            ) ??
            null
        );

    }

    has(id) {

        return this.difficulties.has(id);

    }

    getIds() {

        return [
            ...this.difficulties.keys()
        ];

    }

    getXP(baseXP, difficulty) {

        const definition =
            this.get(difficulty);

        if (!definition) {

            return Math.max(
                0,
                Number(baseXP) || 0
            );

        }

        return Math.floor(
            Math.max(
                0,
                Number(baseXP) || 0
            ) *
            definition.xpMultiplier
        );

    }

    getTimeLimit(difficulty) {

        return this.get(
            difficulty
        )?.timeLimit ?? 30;

    }

}