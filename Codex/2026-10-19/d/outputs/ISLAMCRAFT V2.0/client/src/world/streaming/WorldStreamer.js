export class WorldStreamer {

    constructor(game, chunkManager) {

        this.game = game;

        this.chunkManager =
            chunkManager ?? null;

        this.streamingRadius = null;

        this.active = false;

        this.lastChunkX = null;

        this.lastChunkZ = null;

    }

    async initialize() {

        this.streamingRadius =
            this.game.streamingRadius ?? null;

        this.active = true;

        console.log(
            "WorldStreamer initialisé."
        );

    }

    update() {

        if (!this.active) {
            return;
        }

        const player =
            this.game.localPlayer;

        if (
            !player ||
            !this.chunkManager
        ) {
            return;
        }

        const chunkSize =
            this.game.config?.world?.chunkSize;

        if (
            !Number.isFinite(chunkSize) ||
            chunkSize <= 0
        ) {
            return;
        }

        const chunkX = Math.floor(
            player.position.x / chunkSize
        );

        const chunkZ = Math.floor(
            player.position.z / chunkSize
        );

        /*
         * Ne recalculer que si le joueur
         * change de chunk.
         */

        if (
            chunkX === this.lastChunkX &&
            chunkZ === this.lastChunkZ
        ) {
            return;
        }

        this.lastChunkX = chunkX;

        this.lastChunkZ = chunkZ;

        this.streamAround(
            chunkX,
            chunkZ
        );

    }

    streamAround(centerX, centerZ) {

        if (!this.streamingRadius) {
            return;
        }

        const chunks =
    this.streamingRadius
        .getRequiredChunks(
            centerX,
            centerZ
        );

chunks.sort(
    (a, b) => {

        const distanceA =
            Math.max(
                Math.abs(
                    a.x - centerX
                ),
                Math.abs(
                    a.z - centerZ
                )
            );

        const distanceB =
            Math.max(
                Math.abs(
                    b.x - centerX
                ),
                Math.abs(
                    b.z - centerZ
                )
            );

        return distanceA - distanceB;
    }
);

for (
    const coordinates of chunks
) {

            const chunkX =
                coordinates.x;

            const chunkZ =
                coordinates.z;

            if (
                this.chunkManager.hasChunk(
                    chunkX,
                    chunkZ
                )
            ) {
                continue;
            }

            this.chunkManager.loadChunk(
                chunkX,
                chunkZ
            );

        }

        this.game.eventBus?.emit(
            "world:streaming-updated",
            {
                centerX,
                centerZ,
                chunks
            }
        );

    }

    stop() {

        this.active = false;

    }

    start() {

        this.active = true;

    }

    isActive() {

        return this.active;

    }

    destroy() {

        this.active = false;

        this.chunkManager = null;

        this.streamingRadius = null;

        this.lastChunkX = null;

        this.lastChunkZ = null;

    }

}