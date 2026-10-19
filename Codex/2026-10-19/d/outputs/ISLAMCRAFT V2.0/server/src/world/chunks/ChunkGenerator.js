import { Chunk } from "./Chunk.js";

export class ChunkGenerator {

    constructor(options = {}) {

        this.chunkSize = Number(

            options.chunkSize ?? 16

        );

        this.worldHeight = Number(

            options.worldHeight ?? 128

        );

        this.biomeManager =

            options.biomeManager ?? null;

        this.seed =

            Number(options.seed ?? 0);

    }

    initialize(world) {

        this.world = world;

        if (!this.biomeManager) {

            this.biomeManager =

                world?.biomeManager ?? null;

        }

        return this;

    }

    generate(x, z) {

        const chunk = new Chunk({

            x,

            z,

            size: this.chunkSize,

            height: this.worldHeight

        });

        const biome =

            this.selectBiome(x, z);

        chunk.biomeId = biome?.id ?? "plains";

        const baseHeight =

            biome?.terrain?.baseHeight ?? 4;

        const variation =

            biome?.terrain?.heightVariation ?? 3;

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

                    x * this.chunkSize +

                    localX;

                const worldZ =

                    z * this.chunkSize +

                    localZ;

                const noise =

                    this.noise(worldX, worldZ);

                const terrainHeight = Math.max(

                    1,

                    Math.min(

                        this.worldHeight - 1,

                        Math.floor(

                            baseHeight +

                            noise * variation

                        )

                    )

                );

                for (

                    let y = 0;

                    y <= terrainHeight;

                    y++

                ) {

                    let block;

                    if (y === terrainHeight) {

                        block =

                            biome?.terrain

                                ?.surfaceBlock ??

                            "grass";

                    } else if (

                        y >= terrainHeight - 3

                    ) {

                        block =

                            biome?.terrain

                                ?.undergroundBlock ??

                            "dirt";

                    } else {

                        block = "stone";

                    }

                    chunk.setBlock(

                        localX,

                        y,

                        localZ,

                        block

                    );

                }

            }

        }

        chunk.markGenerated();

        return chunk;

    }

    selectBiome(x, z) {

        if (!this.biomeManager) {

            return null;

        }

        const temperature =

            this.noise(x + 10000, z + 10000);

        const humidity =

            this.noise(x - 10000, z - 10000);

        return this.biomeManager

            .selectFromTemperatureAndHumidity(

                (temperature + 1) / 2,

                (humidity + 1) / 2

            );

    }

    noise(x, z) {

        let value =

            Math.sin(

                x * 12.9898 +

                z * 78.233 +

                this.seed

            ) *

            43758.5453;

        value -= Math.floor(value);

        return value * 2 - 1;

    }

}