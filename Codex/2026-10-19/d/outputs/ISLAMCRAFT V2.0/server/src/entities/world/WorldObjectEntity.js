export class WorldObjectEntity {

    constructor(data = {}) {

        this.id = data.id ?? null;

        this.type = data.type ?? "world_object";

        this.name = data.name ?? this.type;

        this.position = {

            x: Number(data.position?.x ?? 0),

            y: Number(data.position?.y ?? 0),

            z: Number(data.position?.z ?? 0)

        };

        this.rotation = {

            x: Number(data.rotation?.x ?? 0),

            y: Number(data.rotation?.y ?? 0),

            z: Number(data.rotation?.z ?? 0)

        };

        this.scale = {

            x: Number(data.scale?.x ?? 1),

            y: Number(data.scale?.y ?? 1),

            z: Number(data.scale?.z ?? 1)

        };

        this.active = data.active !== false;

        this.metadata = {

            ...(data.metadata ?? {})

        };

    }

    setPosition(x, y, z) {

        this.position.x = Number(x);

        this.position.y = Number(y);

        this.position.z = Number(z);

    }

    setRotation(x, y, z) {

        this.rotation.x = Number(x);

        this.rotation.y = Number(y);

        this.rotation.z = Number(z);

    }

    setScale(x, y, z) {

        this.scale.x = Number(x);

        this.scale.y = Number(y);

        this.scale.z = Number(z);

    }

    setActive(active) {

        this.active = Boolean(active);

    }

    setMetadata(key, value) {

        if (!key) {

            return false;

        }

        this.metadata[key] = value;

        return true;

    }

    getMetadata(key, fallback = null) {

        return this.metadata[key] ?? fallback;

    }

    update(deltaTime, tick) {

        if (!this.active) {

            return;

        }

    }

    serialize() {

        return {

            id: this.id,

            type: this.type,

            name: this.name,

            position: { ...this.position },

            rotation: { ...this.rotation },

            scale: { ...this.scale },

            active: this.active,

            metadata: { ...this.metadata }

        };

    }

    destroy() {

        this.active = false;

        this.metadata = {};

    }

}