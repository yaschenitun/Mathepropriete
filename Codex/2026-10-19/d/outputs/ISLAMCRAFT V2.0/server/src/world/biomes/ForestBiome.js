export class ForestBiome {

    constructor() {

        this.id = "forest";

        this.name = "Forest";

        this.temperature = 0.65;

        this.humidity = 0.8;

        this.terrain = {

            baseHeight: 5,

            heightVariation: 7,

            surfaceBlock: "grass",

            undergroundBlock: "dirt"

        };

        this.vegetation = [

            {
                type: "oak_tree",
                rarity: 0.08
            },

            {
                type: "grass",
                rarity: 0.2
            },

            {
                type: "flower",
                rarity: 0.025
            }

        ];

        this.objects = [

            {
                type: "fallen_log",
                rarity: 0.015
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