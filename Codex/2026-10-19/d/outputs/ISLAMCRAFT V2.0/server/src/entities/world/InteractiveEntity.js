import { WorldObjectEntity } from "./WorldObjectEntity.js";

export class InteractiveEntity extends WorldObjectEntity {

    constructor(data = {}) {

        super({

            ...data,

            type: data.type ?? "interactive"

        });

        this.interactionDistance =

            Number(data.interactionDistance ?? 3);

        this.cooldown =

            Number(data.cooldown ?? 0);

        this.lastInteractionAt =

            Number(data.lastInteractionAt ?? 0);

        this.interactionEnabled =

            data.interactionEnabled !== false;

    }

    setInteractionEnabled(enabled) {

        this.interactionEnabled = Boolean(enabled);

    }

    canInteract(playerPosition, timestamp = Date.now()) {

        if (!this.active || !this.interactionEnabled) {

            return false;

        }

        if (!playerPosition) {

            return false;

        }

        if (

            this.cooldown > 0 &&

            timestamp - this.lastInteractionAt <

                this.cooldown

        ) {

            return false;

        }

        const dx =

            Number(playerPosition.x) -

            this.position.x;

        const dy =

            Number(playerPosition.y) -

            this.position.y;

        const dz =

            Number(playerPosition.z) -

            this.position.z;

        const distanceSquared =

            dx * dx +

            dy * dy +

            dz * dz;

        return (

            distanceSquared <=

            this.interactionDistance ** 2

        );

    }

    interact(player, timestamp = Date.now()) {

        if (!this.canInteract(

            player?.position,

            timestamp

        )) {

            return {

                success: false,

                reason: "interaction_unavailable"

            };

        }

        this.lastInteractionAt = timestamp;

        return {

            success: true,

            entityId: this.id,

            playerId: player?.id ?? null

        };

    }

    update(deltaTime, tick) {

        super.update(deltaTime, tick);

    }

    serialize() {

        return {

            ...super.serialize(),

            interactionDistance:

                this.interactionDistance,

            cooldown: this.cooldown,

            lastInteractionAt:

                this.lastInteractionAt,

            interactionEnabled:

                this.interactionEnabled

        };

    }

}