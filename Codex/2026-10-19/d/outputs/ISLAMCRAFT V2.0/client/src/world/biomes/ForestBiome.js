export class ForestBiome {

    constructor(game) {

        this.game = game;

        this.id = "forest";

        this.name = "Forest";

        this.data = {};

    }

    async initialize() {

        this.data = {

            terrain: {

                groundColor: 0x3f8c3a,

                fogColor: 0x8dcf84,

                maxHeight: 32,

                roughness: 0.45

            },

            vegetation: {

                enabled: true,

                density: 0.85,

                types: [

                    "oak",

                    "pine",

                    "grass",

                    "flowers",

                    "mushroom"

                ]

            },

            objects: {

                density: 0.35,

                types: [

                    "tree",

                    "rock",

                    "bush",

                    "log"

                ]

            },

            structures: {

                density: 0.08,

                types: [

                    "forest_ruins",

                    "hunter_camp"

                ]

            },

            loot: {

                chestChance: 0.04

            },

            ambient: {

                music: "forest",

                birds: true,

                wind: true

            }

        };

        console.log("ForestBiome initialisé.");

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