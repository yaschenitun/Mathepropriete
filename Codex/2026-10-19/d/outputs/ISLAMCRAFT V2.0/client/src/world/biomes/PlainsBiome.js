export class PlainsBiome {

    constructor(game) {

        this.game = game;

        this.id = "plains";

        this.name = "Plains";

        this.data = {};

    }

    async initialize() {

        this.data = {

            terrain: {

                groundColor: 0x6ea84a,

                fogColor: 0xbfe6a3,

                maxHeight: 24,

                roughness: 0.25

            },

            vegetation: {

                enabled: true,

                density: 0.35,

                types: [

                    "grass",

                    "flowers"

                ]

            },

            objects: {

                density: 0.15,

                types: [

                    "bush",

                    "rock",

                    "smallTree"

                ]

            },

            structures: {

                density: 0.05,

                types: [

                    "camp",

                    "well"

                ]

            },

            loot: {

                chestChance: 0.025

            },

            ambient: {

                music: "plains",

                wind: true

            }

        };

        console.log("PlainsBiome initialisé.");

    }

    getData() {

        return this.data;

    }

    getObjectTypes() {

        return this.data.objects.types;

    }

    getStructureTypes() {

        return this.data.structures.types;

    }

    getChestChance() {

        return this.data.loot.chestChance;

    }

}