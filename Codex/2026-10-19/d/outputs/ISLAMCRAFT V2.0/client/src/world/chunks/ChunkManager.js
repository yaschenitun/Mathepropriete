import { Chunk } from "./Chunk.js";
import { ChunkLoader } from "./ChunkLoader.js";
import { ChunkUnloader } from "./ChunkUnloader.js";
import { ChunkCache } from "./ChunkCache.js";

export class ChunkManager {

    constructor(game) {

        this.game = game;

        this.chunks = new Map();

        this.loader = null;

        this.unloader = null;

        this.cache = null;

        this.initialized = false;

    }

    async initialize() {

        this.cache =
            new ChunkCache(this.game);

        await this.cache.initialize();

        this.loader =
            new ChunkLoader(
                this.game,
                this
            );

        await this.loader.initialize();

        this.unloader =
            new ChunkUnloader(
                this.game,
                this
            );

        await this.unloader.initialize();

        this.initialized = true;

        console.log(
            "ChunkManager initialisé."
        );

    }

    update(deltaTime) {

        if (!this.initialized) {
            return;
        }

        this.loader?.update(deltaTime);

        this.unloader?.update(deltaTime);

    }

    getKey(chunkX, chunkZ) {

        return `${chunkX}:${chunkZ}`;

    }

    hasChunk(chunkX, chunkZ) {

        const key =
            typeof chunkX === "string"
                ? chunkX
                : this.getKey(
                    chunkX,
                    chunkZ
                );

        return this.chunks.has(key);

    }

    getChunk(chunkX, chunkZ) {

        const key =
            typeof chunkX === "string"
                ? chunkX
                : this.getKey(
                    chunkX,
                    chunkZ
                );

        return this.chunks.get(key);

    }

    createChunk(chunkX, chunkZ) {

        const key =
            this.getKey(
                chunkX,
                chunkZ
            );

        /*
         * Le chunk est déjà chargé.
         */

        if (
            this.chunks.has(key)
        ) {

            return this.chunks.get(key);

        }

        /*
         * Le chunk existe dans le cache.
         * On le récupère au lieu d'en créer
         * un nouveau.
         */

        if (
            this.cache?.has(key)
        ) {

            const cachedChunk =
                this.cache.restore(key);

            if (cachedChunk) {

                this.chunks.set(
                    key,
                    cachedChunk
                );

                return cachedChunk;

            }

        }

        /*
         * Création normale du chunk.
         */

        const chunk =
            new Chunk(
                this.game,
                chunkX,
                chunkZ
            );

        this.chunks.set(
            key,
            chunk
        );

        return chunk;

    }

    loadChunk(chunkX, chunkZ) {

        if (!this.loader) {
            return null;
        }

        return this.loader.loadChunk(
            chunkX,
            chunkZ
        );

    }

    registerChunk(chunk) {

        if (!chunk) {
            return;
        }

        this.chunks.set(
            chunk.key,
            chunk
        );

    }

    removeChunk(chunkX, chunkZ) {

        const key =
            typeof chunkX === "string"
                ? chunkX
                : this.getKey(
                    chunkX,
                    chunkZ
                );

        const chunk =
            this.chunks.get(key);

        if (!chunk) {
            return;
        }

        /*
         * Retirer le chunk de la scène.
         */

        this.loader?.renderer?.remove?.(
            chunk
        );

        /*
         * Sauvegarder le chunk dans le cache
         * avant de le supprimer.
         */

        if (this.cache) {

            this.cache.save(
                chunk
            );

        }

        /*
         * Détruire le chunk.
         */

        if (
            typeof chunk.destroy === "function"
        ) {

            chunk.destroy();

        }

        /*
         * Retirer le chunk de la liste
         * des chunks actuellement chargés.
         */

        this.chunks.delete(key);

    }

    getLoadedChunks() {

        return this.chunks;

    }

    getChunkCount() {

        return this.chunks.size;

    }

    clear() {

        for (
            const chunk of this.chunks.values()
        ) {

            /*
             * Retirer le chunk de la scène.
             */

            this.loader?.renderer?.remove?.(
                chunk
            );

            /*
             * Détruire le chunk.
             */

            if (
                typeof chunk.destroy === "function"
            ) {

                chunk.destroy();

            }

        }

        this.chunks.clear();

    }

    rebuildChunk(chunk) {

    if (!chunk) {

        return;

    }


    this.loader?.renderer?.rebuild?.(
        chunk
    );

}

    destroy() {

        this.loader?.destroy();

        this.unloader?.destroy();

        this.clear();

        this.loader = null;

        this.unloader = null;

        this.cache?.clear?.();

        this.cache = null;

        this.initialized = false;

    }

}
