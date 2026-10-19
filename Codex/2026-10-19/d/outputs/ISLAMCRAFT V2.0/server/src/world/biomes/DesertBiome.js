export class DesertBiome {

    constructor() {

        this.id = "desert";

        this.name = "Desert";

        this.temperature = 0.9;

        this.humidity = 0.1;

        this.terrain = {

            baseHeight: 3,

            heightVariation: 5,

            surfaceBlock: "sand",

            undergroundBlock: "sandstone"

        };

        this.vegetation = [

            {
                type: "cactus",
                rarity: 0.04
            }

        ];

        this.objects = [

            {
                type: "dead_bush",
                rarity: 0.03
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