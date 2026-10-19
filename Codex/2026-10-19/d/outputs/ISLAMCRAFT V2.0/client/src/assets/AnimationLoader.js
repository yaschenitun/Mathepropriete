export class AnimationLoader {

    constructor(game) {

        this.game = game;

        this.animations = new Map();

        this.loading = new Map();

    }

    async initialize() {

        console.log("AnimationLoader initialisé.");

    }

    async load(key, loader) {

        if (this.animations.has(key)) {

            return this.animations.get(key);

        }

        if (this.loading.has(key)) {

            return this.loading.get(key);

        }

        if (typeof loader !== "function") {

            throw new TypeError(

                `Loader invalide pour l'animation "${key}".`

            );

        }

        const promise = Promise.resolve()

            .then(() => loader())

            .then(animation => {

                this.animations.set(

                    key,

                    animation

                );

                this.loading.delete(key);

                return animation;

            })

            .catch(error => {

                this.loading.delete(key);

                throw error;

            });

        this.loading.set(key, promise);

        return promise;

    }

    has(key) {

        return this.animations.has(key);

    }

    get(key) {

        return this.animations.get(key) ?? null;

    }

    remove(key) {

        this.animations.delete(key);

    }

    clear() {

        this.animations.clear();

        this.loading.clear();

    }

    getSize() {

        return this.animations.size;

    }

}