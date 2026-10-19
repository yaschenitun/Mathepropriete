import { ChunkRenderer } from "./ChunkRenderer.js";

export class ChunkLoader {

    constructor(game, chunkManager) {

        this.game = game;

        this.chunkManager =
            chunkManager;

        this.renderer = null;

        this.loadingQueue = [];

        this.queued = new Set();

        this.loading = false;

    }

    async initialize() {

        this.renderer =
            new ChunkRenderer(
                this.game
            );

        await this.renderer.initialize();

        console.log(
            "ChunkLoader initialisé."
        );

    }

    update() {

        this.processQueue();

    }

    loadChunk(chunkX, chunkZ) {

        const key =
            `${chunkX}:${chunkZ}`;

        if (
            this.chunkManager.hasChunk(
                chunkX,
                chunkZ
            )
        ) {

            return this.chunkManager.getChunk(
                chunkX,
                chunkZ
            );

        }

        if (
            this.queued.has(key)
        ) {

            return null;

        }

        this.queued.add(key);

this.loadingQueue.push({
    chunkX,
    chunkZ,
    key
});

return null;

    }

    processQueue() {

        if (this.loading) {

            return;

        }

        if (this.loadingQueue.length === 0) {

            return;

        }

        this.loading = true;

        const request =
            this.loadingQueue.shift();

        this.queued.delete(
            request.key
        );

        try {

            const chunk =
                this.chunkManager.createChunk(
                    request.chunkX,
                    request.chunkZ
                );

            if (!chunk) {

                return;

            }

            /*
             * Générer le chunk s'il ne l'est pas encore.
             */

            if (!chunk.generated) {

                const terrainGenerator =
                    this.game.terrainGenerator ??
                    this.game.world?.terrainGenerator ??
                    this.game.worldManager?.terrainGenerator;

                if (
                    terrainGenerator &&
                    typeof terrainGenerator.generate === "function"
                ) {

                    terrainGenerator.generate(
                        chunk
                    );

                }
                else {

                    console.warn(
                        "TerrainGenerator introuvable."
                    );

                }

            }

            /*
             * Le générateur utilise chunk.generated
             * comme indicateur de réussite.
             */

            if (!chunk.generated) {

                console.warn(
                    `Échec génération chunk ${chunk.key}.`
                );

            }

            /*
             * Générer l'environnement uniquement
             * après génération réussie.
             */

            if (chunk.generated) {

                const environmentManager =
                    this.game.environmentManager ??
                    this.game.world?.environmentManager ??
                    this.game.worldManager?.environmentManager;

                if (
                    environmentManager &&
                    typeof environmentManager.generateChunk === "function"
                ) {

                    environmentManager.generateChunk(
                        chunk
                    );

                }

            }

            /*
             * Ajouter le chunk à la scène.
             */

            if (chunk.generated) {

    this.renderer.render(
        chunk
    );


    /*
     * POSITIONNEMENT INITIAL DU JOUEUR
     *
     * On ne positionne le joueur que lorsque
     * le chunk central est réellement généré.
     */

    const player =
        this.game.localPlayer;

    if (
        player &&
        request.chunkX === 0 &&
        request.chunkZ === 0 &&
        Array.isArray(chunk.terrain)
    ) {

        const spawnX = 0;
        const spawnZ = 0;

        const terrainHeight =
            Number(
                chunk.terrain[spawnZ]?.[spawnX]
            );

        if (
            Number.isFinite(
                terrainHeight
            )
        ) {

            const spawnY =
                Math.floor(
                    terrainHeight
                ) + 0.1;

            player.setPosition(
                spawnX,
                spawnY,
                spawnZ
            );

            console.log(
                "Spawn joueur :",
                spawnX,
                spawnY,
                spawnZ
            );
        }
    }
}

        }
        catch (error) {

            console.error(
                `Erreur lors du chargement du chunk ${request.key}:`,
                error
            );

            this.game.eventBus?.emit(
                "world:chunk-load-error",
                {
                    chunkX: request.chunkX,
                    chunkZ: request.chunkZ,
                    error
                }
            );

        }
        finally {
    this.loading = false;
}

    }

    clearQueue() {

        this.loadingQueue.length = 0;

        this.queued.clear();

    }

    destroy() {

        this.clearQueue();

        this.loading = false;

        this.renderer?.clear?.();

        this.renderer = null;

    }

}