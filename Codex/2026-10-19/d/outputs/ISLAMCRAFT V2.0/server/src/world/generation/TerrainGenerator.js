export class TerrainGenerator {

    constructor(options = {}) {

        this.heightGenerator =
            options.heightGenerator ?? null;

        this.biomeGenerator =
            options.biomeGenerator ?? null;

        this.chunkSize = Number(
            options.chunkSize ?? 16
        );

        this.worldHeight = Number(
            options.worldHeight ?? 128
        );

    }

    initialize({

        heightGenerator,

        biomeGenerator

    } = {}) {

        if (heightGenerator) {

            this.heightGenerator =
                heightGenerator;

        }

        if (biomeGenerator) {

            this.biomeGenerator =
                biomeGenerator;

        }

        return this;

    }

    generateColumn(worldX, worldZ) {

        const biome =
            this.biomeGenerator?.getBiome(
                worldX,
                worldZ
            );

        const height =
            this.heightGenerator
                ? this.heightGenerator.getHeight(
                    worldX,
                    worldZ
                )
                : 1;

        const surfaceBlock =
            biome?.terrain?.surfaceBlock ??
            "grass";

        const undergroundBlock =
            biome?.terrain?.undergroundBlock ??
            "dirt";

        const blocks = [];

        for (
            let y = 0;
            y <= height && y < this.worldHeight;
            y++
        ) {

            let block;

            if (y === height) {

                block = surfaceBlock;

            } else if (
                y >= height - 3
            ) {

                block = undergroundBlock;

            } else {

                block = "stone";

            }

            blocks.push({

                x: worldX,

                y,

                z: worldZ,

                block

            });

        }

        return {

            height,

            biomeId:
                biome?.id ?? "plains",

            blocks

        };

    }

    generateChunk(chunkX, chunkZ) {

        const columns = [];

        for (
            let localX = 0;
            localX < this.chunkSize;
            localX++
        ) {

            for (
                let localZ = 0;
                localZ < this.chunkSize;
                localZ++
            ) {

                const worldX =
                    chunkX *
                    this.chunkSize +
                    localX;

                const worldZ =
                    chunkZ *
                    this.chunkSize +
                    localZ;

                columns.push(
                    this.generateColumn(
                        worldX,
                        worldZ
                    )
                );

            }

        }

        return {

            x: chunkX,

            z: chunkZ,

            size: this.chunkSize,

            columns

        };

    }

}