import { WorldSeed } from "./WorldSeed.js";
import { TerrainGenerator } from "./generation/TerrainGenerator.js";
import { StreamingRadius } from "./streaming/StreamingRadius.js";
import { ChunkManager } from "./chunks/ChunkManager.js";
import { WorldStreamer } from "./streaming/WorldStreamer.js";

export class WorldManager {

    constructor(game) {

        this.game = game;

        this.seed = null;
        this.terrainGenerator = null;
        this.streamingRadius = null;
        this.chunkManager = null;
        this.streamer = null;

        this.initialized = false;
    }


    async initialize() {

        /*
         * SEED
         */

        this.seed =
            new WorldSeed(this.game);

        await this.seed.initialize();


        /*
         * GÉNÉRATION DU TERRAIN
         */

        this.terrainGenerator =
            new TerrainGenerator(this.game);

        await this.terrainGenerator.initialize();

        this.game.terrainGenerator =
            this.terrainGenerator;


        /*
         * DISTANCE DE STREAMING
         */

        this.streamingRadius =
            new StreamingRadius(this.game);

        await this.streamingRadius.initialize();

        this.game.streamingRadius =
            this.streamingRadius;


        /*
         * CHUNKS
         */

        this.chunkManager =
            new ChunkManager(this.game);

        await this.chunkManager.initialize();


        /*
         * STREAMING DU MONDE
         */

        this.streamer =
            new WorldStreamer(
                this.game,
                this.chunkManager
            );

        await this.streamer.initialize();


        this.initialized = true;

        console.log(
            "WorldManager initialisé."
        );
    }


    update(deltaTime) {

        if (!this.initialized) {
            return;
        }

        this.streamer?.update(
            deltaTime
        );

        this.chunkManager?.update(
            deltaTime
        );
    }


    getSeed() {

        return this.seed?.getSeed();
    }


    getChunkManager() {

        return this.chunkManager;
    }


    getStreamer() {

        return this.streamer;
    }


    getTerrainGenerator() {

        return this.terrainGenerator;
    }


    getStreamingRadius() {

        return this.streamingRadius;
    }


    destroy() {

        this.streamer?.destroy();
        this.chunkManager?.destroy();

        if (
            this.game.terrainGenerator ===
            this.terrainGenerator
        ) {
            this.game.terrainGenerator = null;
        }

        if (
            this.game.streamingRadius ===
            this.streamingRadius
        ) {
            this.game.streamingRadius = null;
        }

        this.streamer = null;
        this.chunkManager = null;
        this.streamingRadius = null;
        this.terrainGenerator = null;
        this.seed = null;

        this.initialized = false;
    }

}