export class EntityManager {

    constructor(game) {

        this.game = game;

        this.entities = new Map();

    }

    async initialize() {

        console.log("EntityManager initialisé.");

    }

    register(entity) {

        if (!entity) {

            return;

        }

        this.entities.set(

            entity.id,

            entity

        );

    }

    unregister(id) {

        this.entities.delete(id);

    }

    get(id) {

        return this.entities.get(id);

    }

    has(id) {

        return this.entities.has(id);

    }

    getAll() {

        return [

            ...this.entities.values()

        ];

    }

    update(deltaTime) {

        for (const entity of this.entities.values()) {

            if (typeof entity.update === "function") {

                entity.update(deltaTime);

            }

        }

    }

    clear() {

        this.entities.clear();

    }

}