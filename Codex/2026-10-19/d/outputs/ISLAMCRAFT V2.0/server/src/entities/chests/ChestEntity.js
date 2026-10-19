import {
    ChestState,
    isValidChestState
} from "./ChestState.js";

export class ChestEntity {

    constructor(data = {}) {

        this.id = data.id ?? null;

        this.type = "chest";

        this.position = {

            x: Number(data.position?.x ?? 0),

            y: Number(data.position?.y ?? 0),

            z: Number(data.position?.z ?? 0)

        };

        this.lootTable =

            data.lootTable ?? "common_chest";

        this.state =

            isValidChestState(data.state)

                ? data.state

                : ChestState.CLOSED;

        this.openedBy = data.openedBy ?? null;

        this.lastOpenedAt =

            Number(data.lastOpenedAt ?? 0);

        this.respawnAt =

            Number(data.respawnAt ?? 0);

        this.interactionDistance =

            Number(data.interactionDistance ?? 3);

    }

    setState(state) {

        if (!isValidChestState(state)) {

            throw new Error(

                `État de coffre invalide: ${state}`

            );

        }

        this.state = state;

    }

    setPosition(x, y, z) {

        this.position.x = Number(x);

        this.position.y = Number(y);

        this.position.z = Number(z);

    }

    canInteract(playerPosition) {

        if (!playerPosition) {

            return false;

        }

        if (

            this.state !== ChestState.CLOSED

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

        return (

            dx * dx +

            dy * dy +

            dz * dz

        ) <= this.interactionDistance ** 2;

    }

    open(playerId, timestamp = Date.now()) {

        if (

            this.state !== ChestState.CLOSED

        ) {

            return false;

        }

        this.openedBy = playerId ?? null;

        this.lastOpenedAt = timestamp;

        this.setState(ChestState.OPEN);

        return true;

    }

    empty() {

        this.setState(ChestState.EMPTY);

    }

    scheduleRespawn(timestamp) {

        this.respawnAt = Number(timestamp);

        this.setState(ChestState.RESPAWNING);

    }

    respawn() {

        this.openedBy = null;

        this.respawnAt = 0;

        this.setState(ChestState.CLOSED);

    }

    isReadyToRespawn(timestamp = Date.now()) {

        return (

            this.state === ChestState.RESPAWNING &&

            this.respawnAt > 0 &&

            timestamp >= this.respawnAt

        );

    }

    serialize() {

        return {

            id: this.id,

            type: this.type,

            position: { ...this.position },

            lootTable: this.lootTable,

            state: this.state,

            openedBy: this.openedBy,

            lastOpenedAt: this.lastOpenedAt,

            respawnAt: this.respawnAt

        };

    }

    destroy() {

        this.openedBy = null;

        this.state = ChestState.EMPTY;

    }

}