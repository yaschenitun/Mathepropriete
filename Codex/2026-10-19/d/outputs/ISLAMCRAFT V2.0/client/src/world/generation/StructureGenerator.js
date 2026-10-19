import * as THREE from "three";

export class StructureGenerator {

    constructor(game) {

        this.game = game;

        this.chunkSize = 0;

        this.spawnChance = 0.08;

        this.seed = 987654;

    }

    async initialize() {

        this.chunkSize =

            this.game.config.world.chunkSize;

        this.spawnChance =

            this.game.config.world.structureChance ?? 0.08;

        console.log("StructureGenerator initialisé.");

    }

    generate(chunk, terrain, biome) {

        if (!terrain) {

            chunk.structures = [];

            return;

        }

        const structures = [];

        if (!this.shouldGenerate(chunk, biome)) {

            chunk.structures = structures;

            return;

        }

        const localX = Math.floor(this.chunkSize * 0.5);
        const localZ = Math.floor(this.chunkSize * 0.5);

        const height =

            terrain[
                Math.min(localZ, terrain.length - 1)
            ][
                Math.min(localX, terrain[0].length - 1)
            ];

        structures.push({

            id: `structure_${chunk.key}`,

            type: this.getStructureType(biome),

            biome,

            position: new THREE.Vector3(

                chunk.chunkX * this.chunkSize + localX,

                height,

                chunk.chunkZ * this.chunkSize + localZ

            ),

            rotation:

                this.random(chunk) * Math.PI * 2,

            generated: true

        });

        chunk.structures = structures;

    }

    shouldGenerate(chunk, biome) {

        if (biome === "desert") {

            return this.random(chunk) < this.spawnChance * 0.5;

        }

        if (biome === "forest") {

            return this.random(chunk) < this.spawnChance * 1.2;

        }

        return this.random(chunk) < this.spawnChance;

    }

    getStructureType(biome) {

        switch (biome) {

            case "forest":
                return "forest_ruins";

            case "desert":
                return "desert_ruins";

            case "plains":
                return "camp";

            default:
                return "structure";

        }

    }

    random(chunk) {

        const n = Math.sin(

            chunk.chunkX * 92821 +

            chunk.chunkZ * 68917 +

            this.seed

        ) * 43758.5453123;

        return n - Math.floor(n);

    }

}