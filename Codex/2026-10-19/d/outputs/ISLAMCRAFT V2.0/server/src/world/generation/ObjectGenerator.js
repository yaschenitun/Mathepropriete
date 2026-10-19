export class ObjectGenerator {

    constructor(options = {}) {

        this.seed = Number(options.seed ?? 0);

        this.biomeManager =
            options.biomeManager ?? null;

        this.defaultDensity =
            Number(options.defaultDensity ?? 0.02);

    }

    initialize(biomeManager) {

        this.biomeManager = biomeManager ?? this.biomeManager;

        return this;

    }

    hash(x, z, salt = 0) {

        const value =
            Math.sin(
                x * 127.1 +
                z * 311.7 +
                salt * 74.3 +
                this.seed
            ) * 43758.5453123;

        return value - Math.floor(value);

    }

    generateForColumn(x, z, biome = null) {

        const selectedBiome =
            biome ??
            this.biomeManager?.get(
                "plains"
            );

        if (!selectedBiome) {

            return [];

        }

        const objects = [];

        const definitions =
            selectedBiome.getObjects?.() ??
            selectedBiome.objects ??
            [];

        for (let index = 0; index < definitions.length; index++) {

            const definition = definitions[index];

            const rarity =
                Number(
                    definition.rarity ??
                    this.defaultDensity
                );

            const roll =
                this.hash(
                    x,
                    z,
                    index + 100
                );

            if (roll > rarity) {

                continue;

            }

            objects.push({

                type: definition.type,

                x,

                z,

                rotation:
                    this.hash(
                        x,
                        z,
                        index + 500
                    ) * Math.PI * 2

            });

        }

        return objects;

    }

    generateChunk(chunkX, chunkZ, chunkSize = 16) {

        const objects = [];

        const biomeManager =
            this.biomeManager;

        for (
            let localX = 0;
            localX < chunkSize;
            localX++
        ) {

            for (
                let localZ = 0;
                localZ < chunkSize;
                localZ++
            ) {

                const worldX =
                    chunkX * chunkSize +
                    localX;

                const worldZ =
                    chunkZ * chunkSize +
                    localZ;

                let biome = null;

                if (biomeManager) {

                    biome =
                        biomeManager
                            .selectFromTemperatureAndHumidity(
                                (
                                    this.hash(
                                        worldX,
                                        worldZ,
                                        1000
                                    ) + 1
                                ) / 2,
                                (
                                    this.hash(
                                        worldX,
                                        worldZ,
                                        2000
                                    ) + 1
                                ) / 2
                            );

                }

                objects.push(
                    ...this.generateForColumn(
                        worldX,
                        worldZ,
                        biome
                    )
                );

            }

        }

        return objects;

    }

}