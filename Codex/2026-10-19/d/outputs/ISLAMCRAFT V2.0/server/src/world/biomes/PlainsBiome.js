export class PlainsBiome {

    constructor() {

        this.id = "plains";

        this.name = "Plains";

        this.temperature = 0.6;

        this.humidity = 0.45;

        this.terrain = {

            baseHeight: 4,

            heightVariation: 3,

            surfaceBlock: "grass",

            undergroundBlock: "dirt"

        };

        this.vegetation = [

            {
                type: "grass",
                rarity: 0.25
            },

            {
                type: "flower",
                rarity: 0.04
            }

        ];

        this.objects = [

            {
                type: "small_rock",
                rarity: 0.01
            }

        ];

    }

    getSurfaceBlock() {

        return this.terrain.surfaceBlock;

    }

    getUndergroundBlock() {

        return this.terrain.undergroundBlock;

    }

    getHeightVariation() {

        return this.terrain.heightVariation;

    }

    getVegetation() {

        return this.vegetation.map(

            entry => ({ ...entry })

        );

    }

    getObjects() {

        return this.objects.map(

            entry => ({ ...entry })

        );

    }

    serialize() {

        return {

            id: this.id,

            name: this.name,

            temperature: this.temperature,

            humidity: this.humidity,

            terrain: {

                ...this.terrain

            },

            vegetation: this.getVegetation(),

            objects: this.getObjects()

        };

    }

}