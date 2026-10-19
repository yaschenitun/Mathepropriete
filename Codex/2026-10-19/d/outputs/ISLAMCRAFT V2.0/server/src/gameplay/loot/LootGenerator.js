export class LootGenerator {

    constructor(options = {}) {

        this.seed = Number(
            options.seed ?? 0
        );

    }

    random() {

        const value =
            Math.sin(
                this.seed * 12.9898
            ) * 43758.5453123;

        this.seed =
            Math.trunc(
                value * 1000000
            );

        return (
            Math.abs(this.seed) %
            1000000
        ) / 1000000;

    }

    randomFromSeed(seed) {

        const value =
            Math.sin(
                Number(seed) * 12.9898
            ) * 43758.5453123;

        return (
            value -
            Math.floor(value)
        );

    }

    rollTable(table, context = {}) {

        if (!table || table.isEmpty()) {

            return [];

        }

        const results = [];

        const entries =
            table.getEntries();

        const rolls =
            Math.max(
                1,
                Number(table.rolls ?? 1)
            );

        for (let i = 0; i < rolls; i++) {

            const totalWeight =
                entries.reduce(
                    (total, entry) =>
                        total +
                        Math.max(
                            0,
                            Number(entry.weight ?? 1)
                        ),
                    0
                );

            if (totalWeight <= 0) {

                continue;

            }

            const roll =
                this.random() *
                totalWeight;

            let cursor = 0;

            for (const entry of entries) {

                const weight =
                    Math.max(
                        0,
                        Number(entry.weight ?? 1)
                    );

                cursor += weight;

                if (roll <= cursor) {

                    const chance =
                        Number(entry.chance ?? 1);

                    if (
                        chance >= 1 ||
                        this.random() <= chance
                    ) {

                        const min =
                            Math.max(
                                1,
                                Number(entry.min ?? 1)
                            );

                        const max =
                            Math.max(
                                min,
                                Number(entry.max ?? min)
                            );

                        const amount =
                            min +
                            Math.floor(
                                this.random() *
                                (max - min + 1)
                            );

                        results.push({

                            item:
                                entry.item,

                            amount,

                            metadata:
                                entry.metadata
                                    ? {
                                        ...entry.metadata
                                    }
                                    : {},

                            source:
                                context.source ?? null

                        });

                    }

                    break;

                }

            }

        }

        return results;

    }

}