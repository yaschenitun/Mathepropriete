import { DesertBiome } from "./DesertBiome.js";
import { ForestBiome } from "./ForestBiome.js";
import { PlainsBiome } from "./PlainsBiome.js";

export class BiomeManager {

    constructor() {

        this.biomes = new Map();

        this.registerDefaults();

    }

    register(biome) {

        if (!biome || !biome.id) {

            throw new TypeError(

                "Un biome valide est requis."

            );

        }

        if (this.biomes.has(biome.id)) {

            throw new Error(

                `Biome déjà enregistré: ${biome.id}`

            );

        }

        this.biomes.set(

            biome.id,

            biome

        );

        return biome;

    }

    registerDefaults() {

        this.register(new DesertBiome());

        this.register(new ForestBiome());

        this.register(new PlainsBiome());

    }

    get(id) {

        return this.biomes.get(id) ?? null;

    }

    has(id) {

        return this.biomes.has(id);

    }

    getAll() {

        return [...this.biomes.values()];

    }

    getIds() {

        return [...this.biomes.keys()];

    }

    selectFromTemperatureAndHumidity(

        temperature,

        humidity

    ) {

        let selected = this.get("plains");

        let bestDistance = Infinity;

        for (const biome of this.biomes.values()) {

            const temperatureDistance =

                temperature - biome.temperature;

            const humidityDistance =

                humidity - biome.humidity;

            const distance =

                temperatureDistance ** 2 +

                humidityDistance ** 2;

            if (distance < bestDistance) {

                bestDistance = distance;

                selected = biome;

            }

        }

        return selected;

    }

    serialize() {

        return this.getAll().map(

            biome => biome.serialize()

        );

    }

    clear() {

        this.biomes.clear();

    }

}