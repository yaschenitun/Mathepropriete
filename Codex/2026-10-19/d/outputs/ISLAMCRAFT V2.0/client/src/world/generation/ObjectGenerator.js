import * as THREE from "three";

export class ObjectGenerator {

    constructor(game) {

        this.game = game;

        this.chunkSize = 0;

        this.seed = 0;

    }

    async initialize() {

        this.chunkSize =
            this.game.config?.world?.chunkSize ?? 16;

        this.seed =
            this.game.worldSeed?.getSeed?.() ??
            this.game.config?.world?.seed ??
            12345;

        console.log(
            "ObjectGenerator initialisé."
        );

    }

    generate(chunk, terrain, biomeId) {

        if (!chunk || !terrain || !biomeId) {

            return;

        }

        const biome =
            this.game.worldManager
                ?.getBiomeManager?.()
                ?.get?.(biomeId);

        /*
         * Pour l'instant, on récupère les données
         * directement depuis la configuration
         * du biome si le BiomeManager n'est pas
         * exposé par WorldManager.
         */

        let biomeData = null;

        if (biome?.getData) {

            biomeData = biome.getData();

        }

        if (!biomeData) {

            biomeData =
                this.getFallbackBiomeData(
                    biomeId
                );

        }

        const objects = [];

        const objectConfig =
            biomeData.objects;

        if (
            !objectConfig ||
            !Array.isArray(objectConfig.types)
        ) {

            chunk.objects = objects;

            return;

        }

        const density =
            Number(objectConfig.density) || 0;

        if (density <= 0) {

            chunk.objects = objects;

            return;

        }

        const attempts =
            Math.max(
                0,
                Math.floor(
                    this.chunkSize *
                    this.chunkSize *
                    density
                )
            );

        for (
            let i = 0;
            i < attempts;
            i++
        ) {

            const random =
                this.random(
                    chunk,
                    i
                );

            const localX =
                Math.floor(
                    random.x *
                    this.chunkSize
                );

            const localZ =
                Math.floor(
                    random.z *
                    this.chunkSize
                );

            const height =
                terrain[
                    Math.min(
                        localZ,
                        terrain.length - 1
                    )
                ]?.[
                    Math.min(
                        localX,
                        terrain[0].length - 1
                    )
                ];

            if (!Number.isFinite(height)) {

                continue;

            }

            const typeIndex =
                Math.floor(
                    random.type *
                    objectConfig.types.length
                );

            const type =
                objectConfig.types[
                    Math.min(
                        typeIndex,
                        objectConfig.types.length - 1
                    )
                ];

            objects.push({

                id:
                    `object_${chunk.key}_${i}`,

                type,

                biome: biomeId,

                position:
                    new THREE.Vector3(

                        chunk.chunkX *
                            this.chunkSize +
                            localX,

                        height,

                        chunk.chunkZ *
                            this.chunkSize +
                            localZ

                    ),

                generated: true

            });

        }

        chunk.objects = objects;

    }

    getFallbackBiomeData(biomeId) {

        switch (biomeId) {

            case "desert":

                return {

                    objects: {

                        density: 0.08,

                        types: [
                            "rock",
                            "deadBush",
                            "cactus"
                        ]

                    }

                };

            case "forest":

                return {

                    objects: {

                        density: 0.35,

                        types: [
                            "tree",
                            "rock",
                            "bush",
                            "log"
                        ]

                    }

                };

            case "plains":

                return {

                    objects: {

                        density: 0.15,

                        types: [
                            "bush",
                            "rock",
                            "smallTree"
                        ]

                    }

                };

            default:

                return {

                    objects: {

                        density: 0,

                        types: []

                    }

                };

        }

    }

    random(chunk, index) {

        const base =
            chunk.chunkX * 928371 +
            chunk.chunkZ * 689917 +
            index * 421;

        const x =
            this.hash(base + 1);

        const z =
            this.hash(base + 2);

        const type =
            this.hash(base + 3);

        return {

            x,
            z,
            type

        };

    }

    hash(value) {

        const n =
            Math.sin(
                value +
                this.seed * 0.0001
            ) *
            43758.5453123;

        return (
            n -
            Math.floor(n)
        );

    }

}