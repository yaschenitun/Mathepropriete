export class ModelLoader {

    constructor(game) {

        this.game = game;

        this.models = new Map();

        this.loading = new Map();

    }

    async initialize() {

        console.log("ModelLoader initialisé.");

    }

    async load(key, loader) {

        if (this.models.has(key)) {

            return this.models.get(key);

        }

        if (this.loading.has(key)) {

            return this.loading.get(key);

        }

        if (typeof loader !== "function") {

            throw new TypeError(

                `Loader invalide pour le modèle "${key}".`

            );

        }

        const promise = Promise.resolve()

            .then(() => loader())

            .then(model => {

                this.models.set(key, model);

                this.loading.delete(key);

                return model;

            })

            .catch(error => {

                this.loading.delete(key);

                throw error;

            });

        this.loading.set(key, promise);

        return promise;

    }

    has(key) {

        return this.models.has(key);

    }

    get(key) {

        return this.models.get(key) ?? null;

    }

    remove(key) {

        this.models.delete(key);

    }

    clear() {

        this.models.clear();

        this.loading.clear();

    }

    getSize() {

        return this.models.size;

    }

}