import * as THREE from "three";

export class ChestInteraction {

    constructor(game) {

        this.game = game;

        this.interactionDistance = 3;

        this.nearbyChests = new Map();

    }

    async initialize() {

        console.log("ChestInteraction initialisé.");

    }

    register(chest) {

        if (!chest) {

            return;

        }

        this.nearbyChests.set(

            chest.id,

            chest

        );

    }

    unregister(id) {

        this.nearbyChests.delete(id);

    }

    check(playerPosition) {

        const available = [];

        for (const chest of this.nearbyChests.values()) {

            if (!chest.isActive || chest.isOpen) {

                continue;

            }

            const distance =

                playerPosition.distanceTo(

                    chest.position

                );

            if (distance <= this.interactionDistance) {

                available.push(chest);

            }

        }

        return available;

    }

    interact(playerPosition) {

        const chests = this.check(

            playerPosition

        );

        if (chests.length === 0) {

            return false;

        }

        const chest = chests[0];

        const opened = chest.open();

        if (!opened) {

            return false;

        }

        if (this.game.lootController) {

            this.game.lootController.generateLoot(

                chest

            );

        }

        if (this.game.networkManager?.sendChestOpen) {

            this.game.networkManager.sendChestOpen(

                chest.id

            );

        }

        return true;

    }

    update(deltaTime) {

        // Futures améliorations :
        // - touche interaction
        // - mobile bouton
        // - highlight coffre proche
        // - animation prompt

    }

}