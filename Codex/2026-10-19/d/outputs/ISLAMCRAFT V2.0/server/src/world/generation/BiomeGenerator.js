export class BiomeGenerator {

    constructor(options = {}) {

        this.biomeManager =
            options.biomeManager ?? null;

        this.temperatureNoise =
            options.temperatureNoise ?? null;

        this.humidityNoise =
            options.humidityNoise ?? null;

    }

    initialize({

        biomeManager,

        temperatureNoise,

        humidityNoise

    } = {}) {

        if (biomeManager) {

            this.biomeManager =
                biomeManager;

        }

        if (temperatureNoise) {

            this.temperatureNoise =
                temperatureNoise;

        }

        if (humidityNoise) {

            this.humidityNoise =
                humidityNoise;

        }

        return this;

    }

    getTemperature(x, z) {

        const value =
            this.temperatureNoise
                ? this.temperatureNoise.get(x, z)
                : 0;

        return (
            value + 1
        ) / 2;

    }

    getHumidity(x, z) {

        const value =
            this.humidityNoise
                ? this.humidityNoise.get(x, z)
                : 0;

        return (
            value + 1
        ) / 2;

    }

    getBiome(x, z) {

        if (!this.biomeManager) {

            return null;

        }

        return this.biomeManager
            .selectFromTemperatureAndHumidity(
                this.getTemperature(x, z),
                this.getHumidity(x, z)
            );

    }

    getBiomeId(x, z) {

        return this.getBiome(x, z)?.id ?? "plains";

    }

}