export class AssetManager {

    constructor(game) {

        this.game = game;

        this.assets = new Map();

    }

    async initialize() {

        console.log("AssetManager initialisé.");

    }

    register(name, asset) {

        if (!name) {

            return;

        }

        this.assets.set(name, asset);

    }

    has(name) {

        return this.assets.has(name);

    }

    get(name) {

        return this.assets.get(name) ?? null;

    }

    remove(name) {

        this.assets.delete(name);

    }

    clear() {

        this.assets.clear();

    }

    getSize() {

        return this.assets.size;

    }

    getAll() {

        return [...this.assets.entries()];

    }

}