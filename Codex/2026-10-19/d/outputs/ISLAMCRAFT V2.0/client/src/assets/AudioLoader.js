export class AudioLoader {

    constructor(game) {

        this.game = game;

        this.audio = new Map();

        this.loading = new Map();

    }

    async initialize() {

        console.log("AudioLoader initialisé.");

    }

    async load(key, loader) {

        if (this.audio.has(key)) {

            return this.audio.get(key);

        }

        if (this.loading.has(key)) {

            return this.loading.get(key);

        }

        if (typeof loader !== "function") {

            throw new TypeError(

                `Loader invalide pour l'audio "${key}".`

            );

        }

        const promise = Promise.resolve()

            .then(() => loader())

            .then(audio => {

                this.audio.set(key, audio);

                this.loading.delete(key);

                return audio;

            })

            .catch(error => {

                this.loading.delete(key);

                throw error;

            });

        this.loading.set(key, promise);

        return promise;

    }

    has(key) {

        return this.audio.has(key);

    }

    get(key) {

        return this.audio.get(key) ?? null;

    }

    remove(key) {

        this.audio.delete(key);

    }

    clear() {

        this.audio.clear();

        this.loading.clear();

    }

    getSize() {

        return this.audio.size;

    }

}