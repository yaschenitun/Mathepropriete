export class ChestSpawn {

    constructor(data = {}) {

        this.id =
            data.id ?? null;

        this.position = {

            x: Number(data.position?.x ?? data.x ?? 0),

            y: Number(data.position?.y ?? data.y ?? 0),

            z: Number(data.position?.z ?? data.z ?? 0)

        };

        this.lootTable =
            data.lootTable ??
            "common_chest";

        this.respawnDelay =
            Number(
                data.respawnDelay ?? 300000
            );

        this.enabled =
            data.enabled !== false;

    }

    createChestData() {

        return {

            id: this.id,

            position: {
                ...this.position
            },

            lootTable:
                this.lootTable,

            respawnDelay:
                this.respawnDelay

        };

    }

    isAvailable() {

        return this.enabled;

    }

    serialize() {

        return {

            id: this.id,

            position: {
                ...this.position
            },

            lootTable:
                this.lootTable,

            respawnDelay:
                this.respawnDelay,

            enabled:
                this.enabled

        };

    }

}