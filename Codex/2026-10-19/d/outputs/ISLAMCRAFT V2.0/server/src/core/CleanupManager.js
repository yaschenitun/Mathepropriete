export class CleanupManager {

    constructor() {

        this.callbacks = new Set();

        this.cleaned = false;

    }

    register(callback) {

        if (typeof callback !== "function") {

            throw new TypeError(

                "Le callback de nettoyage doit être une fonction."

            );

        }

        this.callbacks.add(callback);

        return () => {

            this.callbacks.delete(callback);

        };

    }

    async cleanup() {

        if (this.cleaned) {

            return;

        }

        this.cleaned = true;

        const callbacks = [

            ...this.callbacks

        ];

        this.callbacks.clear();

        for (const callback of callbacks) {

            try {

                await callback();

            } catch (error) {

                console.error(

                    "Erreur pendant le nettoyage:",

                    error

                );

            }

        }

    }

    reset() {

        this.cleaned = false;

    }

    clear() {

        this.callbacks.clear();

    }

    size() {

        return this.callbacks.size;

    }

}