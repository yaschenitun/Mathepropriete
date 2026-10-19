export class NoiseGenerator {

constructor(game) {

    this.game = game;

    this.seed = 0;

    this.frequency = 0.01;

    this.octaves = 4;

    this.persistence = 0.5;

    this.lacunarity = 2.0;

}

async initialize() {

    const worldSeed =
        this.game.worldManager?.getSeed?.();

    this.seed =
        worldSeed ??
        this.game.config?.world?.seed ??
        12345;

    this.frequency =
        this.game.config?.world?.noiseFrequency ?? 0.01;

    this.octaves =
        Math.max(
            1,
            Math.floor(
                Number(
                    this.game.config?.world?.noiseOctaves ?? 4
                )
            )
        );

    this.persistence =
        Number(
            this.game.config?.world?.noisePersistence ?? 0.5
        );

    this.lacunarity =
        Number(
            this.game.config?.world?.noiseLacunarity ?? 2.0
        );

    console.log("NoiseGenerator initialisé.");

}

sample(x, z) {

    let amplitude = 1;

    let frequency = this.frequency;

    let value = 0;

    let maxAmplitude = 0;

    for (
        let octave = 0;
        octave < this.octaves;
        octave++
    ) {

        value +=
            this.random2D(
                x * frequency,
                z * frequency
            ) * amplitude;

        maxAmplitude += amplitude;

        amplitude *= this.persistence;

        frequency *= this.lacunarity;

    }

    if (maxAmplitude <= 0) {

        return 0.5;

    }

    value /= maxAmplitude;

    return Math.max(
        0,
        Math.min(
            1,
            (value + 1) * 0.5
        )
    );

}

random2D(x, z) {

    const n =
        Math.sin(

            x * 127.1 +

            z * 311.7 +

            this.seed * 74.7

        ) * 43758.5453123;

    return (
        n - Math.floor(n)
    ) * 2 - 1;

}

}
