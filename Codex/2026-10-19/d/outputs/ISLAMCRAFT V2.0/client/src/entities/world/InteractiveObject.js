import { WorldObject } from "./WorldObject.js";

export class InteractiveObject extends WorldObject {

    constructor(game, data = {}) {

        super(game, data);

        this.interactionDistance = data.interactionDistance ?? 3;

        this.canInteract = true;

        this.highlighted = false;

    }

    async initialize() {

        await super.initialize();

        console.log("InteractiveObject initialisé.");

    }

    canPlayerInteract(playerPosition) {

        if (!this.canInteract) {

            return false;

        }

        const distance = playerPosition.distanceTo(

            this.position

        );

        return distance <= this.interactionDistance;

    }

    interact(player) {

        if (!this.canInteract) {

            return false;

        }

        console.log(

            `${player.username} interagit avec ${this.id}`

        );

        return true;

    }

    setHighlighted(state) {

        this.highlighted = state;

        if (!this.mesh) {

            return;

        }

        this.mesh.traverse((child) => {

            if (!child.material) {

                return;

            }

            child.material.emissive?.setHex(

                state ? 0x333333 : 0x000000

            );

        });

    }

    enableInteraction() {

        this.canInteract = true;

    }

    disableInteraction() {

        this.canInteract = false;

    }

    update(deltaTime) {

        super.update(deltaTime);

        if (!this.enabled) {

            return;

        }

        // Réservé aux futures animations
        // et effets d'interaction.

    }

}