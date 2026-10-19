export class PlayerSpawn {

    constructor(data = {}) {

        this.id =
            data.id ?? "default";

        this.position = {

            x: Number(data.x ?? data.position?.x ?? 0),

            y: Number(data.y ?? data.position?.y ?? 0),

            z: Number(data.z ?? data.position?.z ?? 0)

        };

        this.rotation = {

            x: Number(data.rotation?.x ?? 0),

            y: Number(data.rotation?.y ?? 0),

            z: Number(data.rotation?.z ?? 0)

        };

        this.priority =
            Number(data.priority ?? 0);

        this.enabled =
            data.enabled !== false;

    }

    isAvailable() {

        return this.enabled;

    }

    getPosition() {

        return {
            ...this.position
        };

    }

    getRotation() {

        return {
            ...this.rotation
        };

    }

    serialize() {

        return {

            id: this.id,

            position: this.getPosition(),

            rotation: this.getRotation(),

            priority: this.priority,

            enabled: this.enabled

        };

    }

}