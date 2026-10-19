export class TextureLoader {

    constructor(game) {

        this.game = game;

        this.textures = new Map();

        this.loading = new Map();

    }

    async initialize() {

        console.log("TextureLoader initialisé.");

    }

    async load(key, loader) {

        if (this.textures.has(key)) {

            return this.textures.get(key);

        }

        if (this.loading.has(key)) {

            return this.loading.get(key);

        }

        if (typeof loader !== "function") {

            throw new TypeError(

                `Loader invalide pour la texture "${key}".`

            );

        }

        const promise = Promise.resolve()

            .then(() => loader())

            .then(texture => {

                this.textures.set(key, texture);

                this.loading.delete(key);

                return texture;

            })

            .catch(error => {

                this.loading.delete(key);

                throw error;

            });

        this.loading.set(key, promise);

        return promise;

    }

    has(key) {

        return this.textures.has(key);

    }

    get(key) {

        return this.textures.get(key) ?? null;

    }

    remove(key) {

        this.textures.delete(key);

    }

    clear() {

        this.textures.clear();

        this.loading.clear();

    }

    getSize() {

        return this.textures.size;

    }

}