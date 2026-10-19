export class EntityFactory {

    constructor() {

        this.types = new Map();

    }

    register(type, EntityClass) {

        if (!type || typeof EntityClass !== "function") {

            throw new TypeError(

                "Type et classe d'entité valides requis."

            );

        }

        this.types.set(type, EntityClass);

        return this;

    }

    create(type, data = {}) {

        const EntityClass = this.types.get(type);

        if (!EntityClass) {

            throw new Error(

                `Type d'entité inconnu: ${type}`

            );

        }

        return new EntityClass(data);

    }

    has(type) {

        return this.types.has(type);

    }

    unregister(type) {

        return this.types.delete(type);

    }

    clear() {

        this.types.clear();

    }

    getTypes() {

        return [...this.types.keys()];

    }

}