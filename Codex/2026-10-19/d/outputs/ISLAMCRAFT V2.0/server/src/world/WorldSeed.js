export class WorldSeed {

    constructor(seed = null) {

        this.value =
            seed === null ||
            seed === undefined ||
            seed === ""
                ? this.generate()
                : this.normalize(seed);

    }

    normalize(seed) {

        if (typeof seed === "number") {

            return Number.isFinite(seed)
                ? Math.trunc(seed)
                : 0;

        }

        const text =
            String(seed);

        let hash = 2166136261;

        for (let i = 0; i < text.length; i++) {

            hash ^= text.charCodeAt(i);

            hash +=
                (hash << 1) +
                (hash << 4) +
                (hash << 7) +
                (hash << 8) +
                (hash << 24);

        }

        return hash | 0;

    }

    generate() {

        return Math.floor(

            Math.random() *
            0xFFFFFFFF

        );

    }

    get() {

        return this.value;

    }

    toString() {

        return String(this.value);

    }

    equals(other) {

        if (other instanceof WorldSeed) {

            return this.value === other.value;

        }

        return this.value ===
            this.normalize(other);

    }

    createChild(label) {

        return new WorldSeed(

            this.normalize(
                `${this.value}:${label}`
            )

        );

    }

    serialize() {

        return {

            value: this.value

        };

    }

}