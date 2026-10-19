import { DesertBiome } from "./DesertBiome.js";
import { PlainsBiome } from "./PlainsBiome.js";
import { ForestBiome } from "./ForestBiome.js";

export class BiomeManager {

    constructor(game) {

        this.game = game;

        this.biomes = new Map();

    }

    async initialize() {

        const desert = new DesertBiome(this.game);
        await desert.initialize();

        const plains = new PlainsBiome(this.game);
        await plains.initialize();

        const forest = new ForestBiome(this.game);
        await forest.initialize();

        this.biomes.set(

            desert.id,

            desert

        );

        this.biomes.set(

            plains.id,

            plains

        );

        this.biomes.set(

            forest.id,

            forest

        );

        console.log("BiomeManager initialisé.");

    }

    get(id) {

        return this.biomes.get(id);

    }

    has(id) {

        return this.biomes.has(id);

    }

    getAll() {

        return [

            ...this.biomes.values()

        ];

    }

    getBiomeData(id) {

        const biome = this.get(id);

        if (!biome) {

            return null;

        }

        return biome.getData();

    }

}