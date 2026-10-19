import { ChunkCache } from "./ChunkCache.js";
import { ChunkGenerator } from "./ChunkGenerator.js";
import { ChunkCleanup } from "./ChunkCleanup.js";

export class ChunkManager {

    constructor(options = {}) {

        this.cache =

            options.cache ??

            new ChunkCache({

                maxSize:

                    options.maxCacheSize ?? 256

            });

        this.generator =

            options.generator ??

            new ChunkGenerator(options);

        this.cleanup =

            options.cleanup ??

            new ChunkCleanup(options);

        this.loaded = new Map();

        this.options = options;

    }

    initialize(world) {

        this.world = world;

        this.generator.initialize(world);

        return this;

    }

    makeKey(x, z) {

        return `${x}:${z}`;

    }

    loadChunk(x, z) {

        x = Number(x);
        z = Number(z);

        const key = this.makeKey(x, z);

        const existing =

            this.loaded.get(key);

        if (existing) {

            existing.markLoaded();

            return existing;

        }

        let chunk =

            this.cache.get(x, z);

        if (!chunk) {

            chunk =

                this.generator.generate(x, z);

        }

        chunk.markLoaded();

        this.loaded.set(key, chunk);

        return chunk;

    }

    unloadChunk(x, z) {

        const key = this.makeKey(x, z);

        const chunk =

            this.loaded.get(key);

        if (!chunk) {

            return false;

        }

        if (chunk.dirty) {

            return false;

        }

        chunk.markUnloaded();

        this.loaded.delete(key);

        this.cache.set(chunk);

        return true;

    }

    getChunk(x, z) {

        return (

            this.loaded.get(

                this.makeKey(x, z)

            ) ??

            this.cache.get(x, z)

        );

    }

    getOrLoadChunk(x, z) {

        return (

            this.getChunk(x, z) ??

            this.loadChunk(x, z)

        );

    }

    hasChunk(x, z) {

        return Boolean(

            this.getChunk(x, z)

        );

    }

    getLoadedChunks() {

        return [...this.loaded.values()];

    }

    update(deltaTime, tick) {

        this.cleanup.cleanup(this);

    }

    cleanupInactive(timestamp = Date.now()) {

        return this.cleanup.cleanup(

            this,

            timestamp

        );

    }

    unloadAll() {

        let count = 0;

        for (const chunk of this.loaded.values()) {

            if (chunk.dirty) {

                continue;

            }

            chunk.markUnloaded();

            this.cache.set(chunk);

            count++;

        }

        this.loaded.clear();

        return count;

    }

    clear() {

        this.loaded.clear();

        this.cache.clear();

    }

    get loadedCount() {

        return this.loaded.size;

    }

}