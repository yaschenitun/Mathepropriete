export class DynamicSpawnManager {

    constructor(options = {}) {

        this.spawns = new Map();

        this.maxSpawns =
            Number(options.maxSpawns ?? 100);

        this.nextId = 1;

    }

    generateId(prefix = "spawn") {

        return `${prefix}_${this.nextId++}`;

    }

    add(position, options = {}) {

        if (!position) {

            return null;

        }

        if (
            this.spawns.size >=
            this.maxSpawns
        ) {

            return null;

        }

        const id =
            options.id ??
            this.generateId();

        const spawn = {

            id,

            position: {

                x: Number(position.x ?? 0),

                y: Number(position.y ?? 0),

                z: Number(position.z ?? 0)

            },

            type:
                options.type ?? "dynamic",

            createdAt:
                Date.now(),

            expiresAt:
                options.duration
                    ? Date.now() +
                      Number(options.duration)
                    : 0

        };

        this.spawns.set(
            id,
            spawn
        );

        return spawn;

    }

    get(id) {

        return this.spawns.get(id) ?? null;

    }

    remove(id) {

        return this.spawns.delete(id);

    }

    update(timestamp = Date.now()) {

        let removed = 0;

        for (const [
            id,
            spawn
        ] of this.spawns) {

            if (
                spawn.expiresAt > 0 &&
                timestamp >= spawn.expiresAt
            ) {

                this.spawns.delete(id);

                removed++;

            }

        }

        return removed;

    }

    getAll() {

        return [
            ...this.spawns.values()
        ];

    }

    clear() {

        this.spawns.clear();

    }

}