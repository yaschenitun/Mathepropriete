export class ChunkCache {

    constructor(options = {}) {

        this.maxSize = Number(

            options.maxSize ?? 256

        );

        this.chunks = new Map();

    }

    makeKey(x, z) {

        return `${x}:${z}`;

    }

    set(chunk) {

        if (!chunk) {

            return false;

        }

        const key = this.makeKey(

            chunk.x,

            chunk.z

        );

        if (this.chunks.has(key)) {

            this.chunks.delete(key);

        }

        this.chunks.set(key, chunk);

        this.enforceLimit();

        return true;

    }

    get(x, z) {

        const key = this.makeKey(x, z);

        const chunk = this.chunks.get(key);

        if (!chunk) {

            return null;

        }

        this.chunks.delete(key);

        this.chunks.set(key, chunk);

        chunk.lastAccess = Date.now();

        return chunk;

    }

    has(x, z) {

        return this.chunks.has(

            this.makeKey(x, z)

        );

    }

    delete(x, z) {

        return this.chunks.delete(

            this.makeKey(x, z)

        );

    }

    enforceLimit() {

        while (

            this.chunks.size >

            this.maxSize

        ) {

            const oldestKey =

                this.chunks.keys().next().value;

            this.chunks.delete(oldestKey);

        }

    }

    values() {

        return [...this.chunks.values()];

    }

    clear() {

        this.chunks.clear();

    }

    get size() {

        return this.chunks.size;

    }

}