export class Chunk {

    constructor(data = {}) {

        this.x = Number(data.x ?? 0);
        this.z = Number(data.z ?? 0);

        this.size = Number(data.size ?? 16);
        this.height = Number(data.height ?? 128);

        this.blocks = data.blocks ?? new Map();

        this.generated = Boolean(data.generated);
        this.loaded = Boolean(data.loaded);
        this.dirty = Boolean(data.dirty);

        this.biomeId = data.biomeId ?? "plains";

        this.lastAccess = Date.now();

    }

    getKey() {

        return `${this.x}:${this.z}`;

    }

    getBlockKey(x, y, z) {

        return `${x}:${y}:${z}`;

    }

    setBlock(x, y, z, block) {

        if (!this.isInside(x, y, z)) {

            return false;

        }

        const key = this.getBlockKey(x, y, z);

        this.blocks.set(key, block);

        this.dirty = true;

        this.lastAccess = Date.now();

        return true;

    }

    getBlock(x, y, z) {

        if (!this.isInside(x, y, z)) {

            return null;

        }

        this.lastAccess = Date.now();

        return this.blocks.get(

            this.getBlockKey(x, y, z)

        ) ?? null;

    }

    removeBlock(x, y, z) {

        if (!this.isInside(x, y, z)) {

            return false;

        }

        const removed = this.blocks.delete(

            this.getBlockKey(x, y, z)

        );

        if (removed) {

            this.dirty = true;

        }

        return removed;

    }

    isInside(x, y, z) {

        return (

            Number.isInteger(x) &&

            Number.isInteger(y) &&

            Number.isInteger(z) &&

            x >= 0 &&

            x < this.size &&

            y >= 0 &&

            y < this.height &&

            z >= 0 &&

            z < this.size

        );

    }

    markGenerated() {

        this.generated = true;

        this.loaded = true;

        this.dirty = false;

        this.lastAccess = Date.now();

    }

    markLoaded() {

        this.loaded = true;

        this.lastAccess = Date.now();

    }

    markUnloaded() {

        this.loaded = false;

    }

    markDirty() {

        this.dirty = true;

    }

    clean() {

        this.dirty = false;

    }

    serialize() {

        return {

            x: this.x,

            z: this.z,

            size: this.size,

            height: this.height,

            biomeId: this.biomeId,

            generated: this.generated,

            blocks: Object.fromEntries(this.blocks)

        };

    }

}