export class ChunkCache {

    constructor(game) {

        this.game = game;

        this.cache = new Map();

        const configuredMax =
            this.game.config?.world?.maxCachedChunks;

        this.maxCachedChunks =
            Number.isFinite(configuredMax)
                ? Math.max(
                    0,
                    Math.floor(configuredMax)
                )
                : 512;

    }

    async initialize() {

        console.log(
            "ChunkCache initialisé."
        );

    }

    has(key) {

        return this.cache.has(key);

    }

    get(key) {

        const entry =
            this.cache.get(key);

        if (!entry) {

            return null;

        }

        entry.lastAccess =
            performance.now();

        return entry.chunk;

    }

    save(chunk) {

        if (!chunk || !chunk.key) {

            return;

        }

        /*
         * Un chunk déjà détruit ne doit jamais
         * entrer dans le cache.
         */

        if (
            !chunk.group ||
            !chunk.terrain
        ) {

            return;

        }

        /*
         * Si le cache est désactivé,
         * ne rien conserver.
         */

        if (
            this.maxCachedChunks <= 0
        ) {

            return;

        }

        /*
         * Retirer une ancienne entrée avant
         * de remplacer le chunk.
         */

        this.cache.delete(
            chunk.key
        );

        this.cache.set(
            chunk.key,
            {
                chunk,
                lastAccess:
                    performance.now()
            }
        );

        this.cleanup();

    }

    touch(key) {

        const entry =
            this.cache.get(key);

        if (!entry) {

            return;

        }

        entry.lastAccess =
            performance.now();

    }

    restore(key) {

        const entry =
            this.cache.get(key);

        if (!entry) {

            return null;

        }

        /*
         * Le chunk doit encore être
         * utilisable.
         */

        if (
            !entry.chunk ||
            !entry.chunk.group ||
            !entry.chunk.terrain
        ) {

            this.cache.delete(key);

            return null;

        }

        entry.lastAccess =
            performance.now();

        return entry.chunk;

    }

    remove(key) {

        this.cache.delete(
            key
        );

    }

    clear() {

        this.cache.clear();

    }

    cleanup() {

        if (
            this.cache.size <=
            this.maxCachedChunks
        ) {

            return;

        }

        const entries =
            [...this.cache.entries()];

        entries.sort(
            (a, b) =>
                a[1].lastAccess -
                b[1].lastAccess
        );

        while (
            this.cache.size >
            this.maxCachedChunks
        ) {

            const oldest =
                entries.shift();

            if (!oldest) {

                break;

            }

            this.cache.delete(
                oldest[0]
            );

        }

    }

}
