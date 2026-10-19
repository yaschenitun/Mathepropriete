export class NoiseGenerator {

    constructor(options = {}) {

        this.seed = Number(options.seed ?? 0);

        this.scale = Number(options.scale ?? 0.05);

        this.octaves = Math.max(
            1,
            Number(options.octaves ?? 4)
        );

        this.persistence = Number(
            options.persistence ?? 0.5
        );

        this.lacunarity = Number(
            options.lacunarity ?? 2
        );

    }

    hash(x, z) {

        const value =
            Math.sin(
                x * 127.1 +
                z * 311.7 +
                this.seed * 74.3
            ) * 43758.5453123;

        return value - Math.floor(value);

    }

    smooth(t) {

        return t * t * (3 - 2 * t);

    }

    interpolate(a, b, t) {

        return a + (b - a) * t;

    }

    valueNoise(x, z) {

        const x0 = Math.floor(x);
        const z0 = Math.floor(z);

        const x1 = x0 + 1;
        const z1 = z0 + 1;

        const tx = this.smooth(x - x0);
        const tz = this.smooth(z - z0);

        const n00 = this.hash(x0, z0);
        const n10 = this.hash(x1, z0);
        const n01 = this.hash(x0, z1);
        const n11 = this.hash(x1, z1);

        const nx0 =
            this.interpolate(n00, n10, tx);

        const nx1 =
            this.interpolate(n01, n11, tx);

        return this.interpolate(nx0, nx1, tz) * 2 - 1;

    }

    get(x, z) {

        let frequency = this.scale;

        let amplitude = 1;

        let value = 0;

        let amplitudeSum = 0;

        for (let i = 0; i < this.octaves; i++) {

            value +=
                this.valueNoise(
                    x * frequency,
                    z * frequency
                ) * amplitude;

            amplitudeSum += amplitude;

            amplitude *= this.persistence;

            frequency *= this.lacunarity;

        }

        if (amplitudeSum === 0) {

            return 0;

        }

        return value / amplitudeSum;

    }

    setSeed(seed) {

        this.seed = Number(seed) || 0;

    }

}