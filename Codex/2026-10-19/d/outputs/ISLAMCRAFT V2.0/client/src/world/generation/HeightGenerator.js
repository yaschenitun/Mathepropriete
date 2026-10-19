import { NoiseGenerator } from "./NoiseGenerator.js";

export class HeightGenerator {

    constructor(game) {

        this.game = game;

        this.noise = null;

        this.chunkSize = 0;

        this.baseHeight = 0;

        this.heightScale = 4;

        this.frequency = 0.01;

    }

    async initialize() {

        this.chunkSize =
            this.game.config?.world?.chunkSize ?? 16;

        this.baseHeight =
            this.game.config?.world?.baseHeight ?? 0;

        this.heightScale =
            this.game.config?.world?.heightScale ?? 4;

        this.frequency =
            this.game.config?.world?.terrainFrequency ?? 0.005;

        this.noise =
            new NoiseGenerator(this.game);

        await this.noise.initialize();

        console.log(
            "HeightGenerator initialisé."
        );

    }

    generate(chunk) {

        if (!chunk || !this.noise) {

            return [];

        }

        const terrain = [];

        const worldStartX =
            chunk.chunkX * this.chunkSize;

        const worldStartZ =
            chunk.chunkZ * this.chunkSize;

        for (
            let z = 0;
            z < this.chunkSize;
            z++
        ) {

            const row = [];

            for (
                let x = 0;
                x < this.chunkSize;
                x++
            ) {

                const worldX =
                    worldStartX + x;

                const worldZ =
                    worldStartZ + z;

                const noise =
                    this.noise.sample(
                        worldX * this.frequency,
                        worldZ * this.frequency
                    );

                const height =
                    this.baseHeight +
                    noise * this.heightScale;

                row.push(height);

            }

            terrain.push(row);

        }

        return terrain;

    }

    getHeight(terrain, localX, localZ) {

        if (
            !Array.isArray(terrain) ||
            terrain.length === 0
        ) {

            return 0;

        }

        const z =
            Math.max(
                0,
                Math.min(
                    terrain.length - 1,
                    Math.floor(localZ)
                )
            );

        const row = terrain[z];

        if (
            !Array.isArray(row) ||
            row.length === 0
        ) {

            return 0;

        }

        const x =
            Math.max(
                0,
                Math.min(
                    row.length - 1,
                    Math.floor(localX)
                )
            );

        return row[x];

    }

}