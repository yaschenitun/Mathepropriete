export class ChunkUnloader {

    constructor(game, chunkManager) {

        this.game = game;

        this.chunkManager =
            chunkManager;

    }

    async initialize() {

        console.log(
            "ChunkUnloader initialisé."
        );

    }

    update() {

        const player =
            this.game.localPlayer;

        if (!player) {
            return;
        }

        const chunkSize =
            this.game.config?.world?.chunkSize;

        const unloadDistance =
            this.game.config?.world?.unloadDistance;

        /*
         * Vérifier la configuration.
         */

        if (
            !Number.isFinite(chunkSize) ||
            chunkSize <= 0
        ) {

            return;

        }

        if (
            !Number.isFinite(unloadDistance) ||
            unloadDistance < 0
        ) {

            return;

        }

        /*
         * Calculer le chunk dans lequel
         * se trouve actuellement le joueur.
         */

        const playerChunkX =
            Math.floor(
                player.position.x / chunkSize
            );

        const playerChunkZ =
            Math.floor(
                player.position.z / chunkSize
            );

        /*
         * Récupérer les chunks actuellement
         * chargés.
         */

        const loadedChunks =
            this.chunkManager.getLoadedChunks();

        /*
         * Créer une liste des chunks à retirer.
         *
         * On ne les supprime pas directement
         * pendant le parcours de la Map.
         */

        const chunksToRemove = [];

        for (
            const chunk of loadedChunks.values()
        ) {

            if (!chunk) {
                continue;
            }

            const dx =
                chunk.chunkX -
                playerChunkX;

            const dz =
                chunk.chunkZ -
                playerChunkZ;

            /*
             * Distance en grille.
             *
             * Exemple :
             *
             * joueur = 0:0
             * chunk  = 0:5
             *
             * distance = 5
             */

            const distance =
                Math.max(
                    Math.abs(dx),
                    Math.abs(dz)
                );

            /*
             * Le chunk est encore assez proche.
             */

            if (
                distance <= unloadDistance
            ) {

                continue;

            }

            chunksToRemove.push({
                chunkX: chunk.chunkX,
                chunkZ: chunk.chunkZ
            });

        }

        /*
         * Supprimer maintenant les chunks
         * qui sont trop éloignés.
         */

        for (
            const coordinates of chunksToRemove
        ) {

            this.chunkManager.removeChunk(
                coordinates.chunkX,
                coordinates.chunkZ
            );

        }

    }

    destroy() {

        this.chunkManager = null;

    }

}
