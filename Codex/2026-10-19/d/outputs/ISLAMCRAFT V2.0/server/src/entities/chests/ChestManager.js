import { ChestEntity } from "./ChestEntity.js";
import { ChestState } from "./ChestState.js";

export class ChestManager {

    constructor(options = {}) {

        this.chests = new Map();

        this.defaultLootTable =

            options.defaultLootTable ??

            "common_chest";

    }

    initialize(server) {

        this.server = server;

        return this;

    }

    addChest(data = {}) {

        const chest =

            data instanceof ChestEntity

                ? data

                : new ChestEntity({

                    ...data,

                    lootTable:

                        data.lootTable ??

                        this.defaultLootTable

                });

        if (!chest.id) {

            throw new Error(

                "Un identifiant de coffre est requis."

            );

        }

        if (this.chests.has(chest.id)) {

            throw new Error(

                `Coffre déjà présent: ${chest.id}`

            );

        }

        this.chests.set(chest.id, chest);

        return chest;

    }

    removeChest(chestId) {

        const chest = this.chests.get(chestId);

        if (!chest) {

            return false;

        }

        chest.destroy();

        this.chests.delete(chestId);

        return true;

    }

    getChest(chestId) {

        return this.chests.get(chestId) ?? null;

    }

    getChests() {

        return [...this.chests.values()];

    }

    getAvailableChests() {

        return this.getChests().filter(

            chest =>

                chest.state === ChestState.CLOSED

        );

    }

    openChest(chestId, playerId, playerPosition) {

        const chest = this.getChest(chestId);

        if (!chest) {

            return {

                success: false,

                reason: "chest_not_found"

            };

        }

        if (!chest.canInteract(playerPosition)) {

            return {

                success: false,

                reason: "cannot_interact"

            };

        }

        if (!chest.open(playerId)) {

            return {

                success: false,

                reason: "chest_not_available"

            };

        }

        return {

            success: true,

            chest

        };

    }

    update(deltaTime, tick) {

        for (const chest of this.chests.values()) {

            if (chest.isReadyToRespawn()) {

                chest.respawn();

            }

        }

    }

    clear() {

        for (const chest of this.chests.values()) {

            chest.destroy();

        }

        this.chests.clear();

    }

    get size() {

        return this.chests.size;

    }

}