export class ChunkWorker {

    constructor(game) {

        this.game = game;

        this.worker = null;

        this.enabled = false;

        this.callbacks = new Map();

        this.requestId = 0;

        this.initialized = false;

    }

    async initialize() {

        /*
         * Pour le moment, aucun Worker réel
         * n'est lancé ici.
         *
         * La génération reste exécutée
         * côté client principal.
         *
         * Cela évite de charger ce même fichier
         * comme Worker et de créer une boucle
         * de Worker incorrecte.
         */

        this.worker = null;

        this.enabled = false;

        this.initialized = true;

        console.log(
            "ChunkWorker initialisé en mode fallback."
        );

    }

    generateChunk(data) {

        /*
         * Aucun Worker actif :
         * retourner directement les données.
         */

        if (
            !this.enabled ||
            !this.worker
        ) {

            return Promise.resolve(
                data
            );

        }

        return new Promise(
            (resolve, reject) => {

                const id =
                    ++this.requestId;

                this.callbacks.set(
                    id,
                    {
                        resolve,
                        reject
                    }
                );

                try {

                    this.worker.postMessage({

                        id,

                        type:
                            "GENERATE_CHUNK",

                        payload:
                            data

                    });

                }
                catch (error) {

                    this.callbacks.delete(
                        id
                    );

                    reject(error);

                }

            }
        );

    }

    onMessage(event) {

        if (!event?.data) {

            return;

        }

        const {

            id,

            payload,

            error

        } = event.data;

        const callback =
            this.callbacks.get(id);

        if (!callback) {

            return;

        }

        this.callbacks.delete(id);

        if (error) {

            callback.reject(
                new Error(error)
            );

            return;

        }

        callback.resolve(
            payload
        );

    }

    onError(error) {

        for (
            const callback
            of this.callbacks.values()
        ) {

            callback.reject(
                error
            );

        }

        this.callbacks.clear();

    }

    terminate() {

        if (this.worker) {

            this.worker.terminate();

        }

        this.worker = null;

        for (
            const callback
            of this.callbacks.values()
        ) {

            callback.reject(
                new Error(
                    "ChunkWorker terminated."
                )
            );

        }

        this.callbacks.clear();

        this.enabled = false;

        this.initialized = false;

    }

}
