export class ChestRespawnManager {

    constructor(options = {}) {

        this.respawnDelay =

            Number(options.respawnDelay ?? 300000);

        this.chestManager =

            options.chestManager ?? null;

    }

    initialize(server) {

        this.server = server;

        if (!this.chestManager) {

            this.chestManager =

                server.getComponent?.("chests") ??

                null;

        }

        return this;

    }

    schedule(chest, delay = this.respawnDelay) {

        if (!chest) {

            return false;

        }

        const respawnAt =

            Date.now() +

            Math.max(0, Number(delay));

        chest.scheduleRespawn(respawnAt);

        return respawnAt;

    }

    scheduleAfterOpen(chest) {

        return this.schedule(

            chest,

            this.respawnDelay

        );

    }

    update(timestamp = Date.now()) {

        if (!this.chestManager) {

            return 0;

        }

        let respawned = 0;

        for (

            const chest

            of this.chestManager.getChests()

        ) {

            if (chest.isReadyToRespawn(timestamp)) {

                chest.respawn();

                respawned++;

            }

        }

        return respawned;

    }

}