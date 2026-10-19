export class EntityRegistry {

    constructor() {

        this.entities = new Map();

    }

    register(entity) {

        if (!entity || !entity.id) {

            throw new TypeError(

                "Une entité avec un id est requise."

            );

        }

        if (this.entities.has(entity.id)) {

            throw new Error(

                `Entité déjà enregistrée: ${entity.id}`

            );

        }

        this.entities.set(entity.id, entity);

        return entity;

    }

    unregister(id) {

        return this.entities.delete(id);

    }

    get(id) {

        return this.entities.get(id) ?? null;

    }

    has(id) {

        return this.entities.has(id);

    }

    findByType(type) {

        return [...this.entities.values()].filter(

            entity => entity.type === type

        );

    }

    values() {

        return [...this.entities.values()];

    }

    clear() {

        this.entities.clear();

    }

    get size() {

        return this.entities.size;

    }

}