import { HeightGenerator } from "./HeightGenerator.js";
import { BiomeGenerator } from "./BiomeGenerator.js";
import { ObjectGenerator } from "./ObjectGenerator.js";
import { StructureGenerator } from "./StructureGenerator.js";

export class TerrainGenerator {

    constructor(game) {

        this.game = game;

        this.heightGenerator = null;
        this.biomeGenerator = null;
        this.objectGenerator = null;
        this.structureGenerator = null;

        this.initialized = false;

    }

    async initialize() {

        this.heightGenerator = new HeightGenerator(this.game);
        await this.heightGenerator.initialize();

        this.biomeGenerator = new BiomeGenerator(this.game);
        await this.biomeGenerator.initialize();

        this.objectGenerator = new ObjectGenerator(this.game);
        await this.objectGenerator.initialize();

        this.structureGenerator = new StructureGenerator(this.game);
        await this.structureGenerator.initialize();

        this.initialized = true;

        console.log("TerrainGenerator initialisé.");

    }

    generate(chunk) {

    if (!this.initialized || !chunk) {

        return false;

    }

    const terrain =
        this.heightGenerator.generate(chunk);

    if (!terrain) {

        return false;

    }

    chunk.terrain = terrain;

    const biome =
        this.biomeGenerator.generate(chunk);

    if (!biome) {

        return false;

    }

    chunk.setBiome(biome);

    this.objectGenerator.generate(
        chunk,
        terrain,
        biome
    );

    this.structureGenerator.generate(
        chunk,
        terrain,
        biome
    );

    chunk.markGenerated();

    return true;

}

}