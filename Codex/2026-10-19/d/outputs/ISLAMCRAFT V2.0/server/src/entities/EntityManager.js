export class EntityManager {

    constructor() {

        this.entities = new Map();

        this.nextId = 1;

    }

    generateId() {

        return `entity_${this.nextId++}`;

    }

    add(entity, id = null) {

        if (!entity) {

            throw new TypeError(

                "Une entité est requise."

            );

        }

        const entityId =
            id ??
            entity.id ??
            this.generateId();

        if (this.entities.has(entityId)) {

            throw new Error(

                `Entité déjà enregistrée: ${entityId}`

            );

        }

        entity.id = entityId;

        this.entities.set(entityId, entity);

        return entity;

    }

    get(id) {

        return this.entities.get(id) ?? null;

    }

    has(id) {

        return this.entities.has(id);

    }

    remove(id) {

        const entity = this.entities.get(id);

        if (!entity) {

            return false;

        }

        if (typeof entity.destroy === "function") {

            entity.destroy();

        }

        this.entities.delete(id);

        return true;

    }

    update(deltaTime, tick) {

        for (const entity of this.entities.values()) {

            if (typeof entity.update === "function") {

                entity.update(deltaTime, tick);

            }

        }

    }

    getAll() {

        return [...this.entities.values()];

    }

    getByType(type) {

        return this.getAll().filter(

            entity => entity.type === type

        );

    }

    clear() {

        for (const entity of this.entities.values()) {

            if (typeof entity.destroy === "function") {

                entity.destroy();

            }

        }

        this.entities.clear();

    }

    get size() {

        return this.entities.size;

    }

}