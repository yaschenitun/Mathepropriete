export class WorldSeed {

    constructor(game) {

        this.game = game;

        this.seed = 0;

        this.randomState = 0;

    }

    async initialize() {

        this.generateSeed();

        console.log("WorldSeed initialisé :", this.seed);

    }

    generateSeed() {

        if (

            this.game.config.world.seed !== undefined &&

            this.game.config.world.seed !== null

        ) {

            this.seed = this.game.config.world.seed;

        }

        else {

            this.seed = Date.now();

        }

        this.randomState = this.seed;

    }

    setSeed(seed) {

        this.seed = Number(seed);

        this.randomState = this.seed;

    }

    getSeed() {

        return this.seed;

    }

    reset() {

        this.randomState = this.seed;

    }

    random() {

        this.randomState += 0x6D2B79F5;

        let t = this.randomState;

        t = Math.imul(t ^ (t >>> 15), t | 1);

        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;

    }

    randomRange(min, max) {

        return min + (max - min) * this.random();

    }

    randomInt(min, max) {

        return Math.floor(

            this.randomRange(min, max + 1)

        );

    }

    chance(probability) {

        return this.random() <= probability;

    }

}