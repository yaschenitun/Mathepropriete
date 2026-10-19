import { WorldSeed } from "./WorldSeed.js";

import { BiomeManager } from "./biomes/BiomeManager.js";

import { ChunkManager } from "./chunks/ChunkManager.js";

import { NoiseGenerator } from "./generation/NoiseGenerator.js";

import { HeightGenerator } from "./generation/HeightGenerator.js";

import { BiomeGenerator } from "./generation/BiomeGenerator.js";

import { TerrainGenerator } from "./generation/TerrainGenerator.js";

import { ObjectGenerator } from "./generation/ObjectGenerator.js";

import { StructureGenerator } from "./generation/StructureGenerator.js";

import { SpawnManager } from "./spawning/SpawnManager.js";

export class WorldManager {

    constructor(options = {}) {

        this.name =
            options.name ?? "islamcraft_world";

        this.seed =
            options.seed instanceof WorldSeed

                ? options.seed

                : new WorldSeed(options.seed);

        this.worldHeight =
            Number(options.worldHeight ?? 128);

        this.chunkSize =
            Number(options.chunkSize ?? 16);

        this.biomeManager =
            options.biomeManager ??
            new BiomeManager();

        this.noiseGenerator =
            options.noiseGenerator ??
            new NoiseGenerator({

                seed: this.seed.get(),

                scale:
                    options.noiseScale ?? 0.05

            });

        this.temperatureNoise =
            new NoiseGenerator({

                seed:
                    this.seed
                        .createChild("temperature")
                        .get(),

                scale: 0.01

            });

        this.humidityNoise =
            new NoiseGenerator({

                seed:
                    this.seed
                        .createChild("humidity")
                        .get(),

                scale: 0.01

            });

        this.heightGenerator =
            new HeightGenerator({

                noise:
                    this.noiseGenerator,

                baseHeight:
                    options.baseHeight ?? 32,

                amplitude:
                    options.heightAmplitude ?? 24,

                maxHeight:
                    this.worldHeight - 1

            });

        this.biomeGenerator =
            new BiomeGenerator({

                biomeManager:
                    this.biomeManager,

                temperatureNoise:
                    this.temperatureNoise,

                humidityNoise:
                    this.humidityNoise

            });

        this.terrainGenerator =
            new TerrainGenerator({

                heightGenerator:
                    this.heightGenerator,

                biomeGenerator:
                    this.biomeGenerator,

                chunkSize:
                    this.chunkSize,

                worldHeight:
                    this.worldHeight

            });

        this.objectGenerator =
            new ObjectGenerator({

                seed:
                    this.seed
                        .createChild("objects")
                        .get(),

                biomeManager:
                    this.biomeManager

            });

        this.structureGenerator =
            new StructureGenerator({

                seed:
                    this.seed
                        .createChild("structures")
                        .get()

            });

        this.chunkManager =
            new ChunkManager({

                chunkSize:
                    this.chunkSize,

                worldHeight:
                    this.worldHeight,

                seed:
                    this.seed.get(),

                biomeManager:
                    this.biomeManager

            });

        this.spawnManager =
            new SpawnManager();

        this.server = null;

        this.initialized = false;

        this.started = false;

    }

    initialize(server = null) {

        this.server = server;

        this.chunkManager.initialize(this);

        this.initialized = true;

        return this;

    }

    start() {

        if (!this.initialized) {

            this.initialize(this.server);

        }

        this.started = true;

        return this;

    }

    stop() {

        this.started = false;

        this.chunkManager.unloadAll();

    }

    getChunk(x, z) {

        return this.chunkManager.getChunk(
            Number(x),
            Number(z)
        );

    }

    loadChunk(x, z) {

        return this.chunkManager.loadChunk(
            Number(x),
            Number(z)
        );

    }

    unloadChunk(x, z) {

        return this.chunkManager.unloadChunk(
            Number(x),
            Number(z)
        );

    }

    getBiome(x, z) {

        return this.biomeGenerator.getBiome(
            Number(x),
            Number(z)
        );

    }

    getHeight(x, z) {

        return this.heightGenerator.getHeight(
            Number(x),
            Number(z)
        );

    }

    generateTerrain(x, z) {

        return this.terrainGenerator.generateColumn(
            Number(x),
            Number(z)
        );

    }

    generateObjects(x, z) {

        const biome =
            this.getBiome(x, z);

        return this.objectGenerator.generateForColumn(
            Number(x),
            Number(z),
            biome
        );

    }

    generateChunkContent(chunkX, chunkZ) {

        const terrain =
            this.terrainGenerator.generateChunk(
                Number(chunkX),
                Number(chunkZ)
            );

        const objects =
            this.objectGenerator.generateChunk(
                Number(chunkX),
                Number(chunkZ),
                this.chunkSize
            );

        const structures =
            this.structureGenerator.generateChunk(
                Number(chunkX),
                Number(chunkZ),
                this.chunkSize,
                this.heightGenerator.baseHeight
            );

        return {

            x: Number(chunkX),

            z: Number(chunkZ),

            terrain,

            objects,

            structures

        };

    }

    spawnPlayer(player, spawnId = null) {

        return this.spawnManager.spawnPlayer(
            player,
            spawnId
        );

    }

    update(deltaTime = 0, tick = 0) {

        if (!this.started) {

            return;

        }

        this.chunkManager.update(
            deltaTime,
            tick
        );

        this.spawnManager.update(
            deltaTime,
            tick
        );

    }

    getLoadedChunks() {

        return this.chunkManager.getLoadedChunks();

    }

    getSeed() {

        return this.seed.get();

    }

    getBiomeManager() {

        return this.biomeManager;

    }

    getChunkManager() {

        return this.chunkManager;

    }

    getSpawnManager() {

        return this.spawnManager;

    }

    serialize() {

        return {

            name:
                this.name,

            seed:
                this.seed.get(),

            worldHeight:
                this.worldHeight,

            chunkSize:
                this.chunkSize,

            initialized:
                this.initialized,

            started:
                this.started

        };

    }

    destroy() {

        this.stop();

        this.chunkManager.clear();

        this.spawnManager.clear();

        this.server = null;

        this.initialized = false;

    }

}