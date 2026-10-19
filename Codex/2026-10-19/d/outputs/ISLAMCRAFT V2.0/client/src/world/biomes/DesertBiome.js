export class DesertBiome {

    constructor(game) {

        this.game = game;

        this.id = "desert";

        this.name = "Desert";

        this.data = {};

    }

    async initialize() {

        this.data = {

            terrain: {

                groundColor: 0xd9c27a,

                fogColor: 0xf3deb0,

                maxHeight: 18,

                roughness: 0.15

            },

            vegetation: {

                enabled: false,

                density: 0,

                types: []

            },

            objects: {

                density: 0.08,

                types: [

                    "rock",

                    "deadBush",

                    "cactus"

                ]

            },

            structures: {

                density: 0.03,

                types: [

                    "desert_ruins",

                    "desert_temple"

                ]

            },

            loot: {

                chestChance: 0.015

            },

            ambient: {

                music: "desert",

                wind: true

            }

        };

        console.log("DesertBiome initialisé.");

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