export class HeightGenerator {

    constructor(options = {}) {

        this.noise = options.noise ?? null;

        this.baseHeight = Number(
            options.baseHeight ?? 32
        );

        this.amplitude = Number(
            options.amplitude ?? 24
        );

        this.minHeight = Number(
            options.minHeight ?? 1
        );

        this.maxHeight = Number(
            options.maxHeight ?? 127
        );

    }

    initialize(noiseGenerator) {

        this.noise = noiseGenerator;

        return this;

    }

    clamp(value) {

        return Math.max(
            this.minHeight,
            Math.min(
                this.maxHeight,
                value
            )
        );

    }

    getHeight(x, z) {

        const noiseValue = this.noise
            ? this.noise.get(x, z)
            : 0;

        return Math.floor(

            this.clamp(
                this.baseHeight +
                noiseValue * this.amplitude
            )

        );

    }

    getNormalizedHeight(x, z) {

        const height = this.getHeight(x, z);

        return (
            height - this.minHeight
        ) / (
            this.maxHeight -
            this.minHeight
        );

    }

    setRange(minHeight, maxHeight) {

        this.minHeight = Number(minHeight);

        this.maxHeight = Number(maxHeight);

    }

}