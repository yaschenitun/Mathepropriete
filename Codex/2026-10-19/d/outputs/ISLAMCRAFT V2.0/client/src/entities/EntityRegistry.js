export class EntityRegistry {

    constructor(game) {

        this.game = game;

        this.types = new Map();

    }

    async initialize() {

        console.log("EntityRegistry initialisé.");

    }

    register(type, constructor) {

        if (this.types.has(type)) {

            console.warn(

                `Le type "${type}" est déjà enregistré.`

            );

            return;

        }

        this.types.set(

            type,

            constructor

        );

    }

    unregister(type) {

        this.types.delete(type);

    }

    has(type) {

        return this.types.has(type);

    }

    get(type) {

        return this.types.get(type);

    }

    getAll() {

        return [...this.types.keys()];

    }

    clear() {

        this.types.clear();

    }

}