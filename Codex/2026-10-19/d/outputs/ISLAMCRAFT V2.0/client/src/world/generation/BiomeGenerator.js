import { NoiseGenerator } from "./NoiseGenerator.js";

export class BiomeGenerator {

    constructor(game) {

        this.game = game;

        this.noise = null;

        this.moistureFrequency = 0.003;

        this.temperatureFrequency = 0.002;

    }

    async initialize() {

        this.noise =
            new NoiseGenerator(
                this.game
            );

        await this.noise.initialize();

        this.moistureFrequency =
            Number(
                this.game.config?.world?.moistureFrequency ?? 0.003
            );

        this.temperatureFrequency =
            Number(
                this.game.config?.world?.temperatureFrequency ?? 0.002
            );

        if (
            !Number.isFinite(this.moistureFrequency) ||
            this.moistureFrequency <= 0
        ) {

            this.moistureFrequency = 0.003;

        }

        if (
            !Number.isFinite(this.temperatureFrequency) ||
            this.temperatureFrequency <= 0
        ) {

            this.temperatureFrequency = 0.002;

        }

        console.log(
            "BiomeGenerator initialisé."
        );

    }

    generate(chunk) {

        if (!chunk) {

            return "plains";

        }

        const chunkSize =
            Number(
                this.game.config?.world?.chunkSize
            );

        if (
            !Number.isFinite(chunkSize) ||
            chunkSize <= 0
        ) {

            return "plains";

        }

        const worldX =
            chunk.chunkX *
            chunkSize;

        const worldZ =
            chunk.chunkZ *
            chunkSize;

        return this.getBiome(
            worldX,
            worldZ
        );

    }

    getBiome(worldX, worldZ) {

        if (!this.noise) {

            return "plains";

        }

        /*
         * NoiseGenerator.sample() applique déjà
         * sa fréquence interne.
         *
         * On compense cette fréquence ici afin
         * que les fréquences spécifiques aux biomes
         * soient appliquées exactement une seule fois.
         */

        const noiseFrequency =
            Number(
                this.noise.frequency
            );

        const baseFrequency =
            Number.isFinite(noiseFrequency) &&
            noiseFrequency > 0
                ? noiseFrequency
                : 0.01;

        const moistureX =
            (
                worldX *
                this.moistureFrequency
            ) / baseFrequency;

        const moistureZ =
            (
                worldZ *
                this.moistureFrequency
            ) / baseFrequency;

        const temperatureX =
            (
                worldX *
                this.temperatureFrequency +
                5000
            ) / baseFrequency;

        const temperatureZ =
            (
                worldZ *
                this.temperatureFrequency +
                5000
            ) / baseFrequency;

        const moisture =
            this.noise.sample(
                moistureX,
                moistureZ
            );

        const temperature =
            this.noise.sample(
                temperatureX,
                temperatureZ
            );

        if (
            temperature > 0.65 &&
            moisture < 0.35
        ) {

            return "desert";

        }

        if (
            moisture > 0.60
        ) {

            return "forest";

        }

        return "plains";

    }

}