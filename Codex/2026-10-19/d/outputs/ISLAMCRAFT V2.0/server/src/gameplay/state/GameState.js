export class GameState {

    constructor(data = {}) {

        this.name = "game";

        this.status =
            data.status ?? "active";

        this.startedAt =
            Number(
                data.startedAt ?? Date.now()
            );

        this.updatedAt =
            Number(
                data.updatedAt ?? Date.now()
            );

        this.data = {
            ...data.data
        };

    }

    enter(context = {}) {

        this.status = "active";

        this.startedAt =
            Date.now();

        this.updatedAt =
            this.startedAt;

        Object.assign(
            this.data,
            context
        );

        return this;

    }

    update(context = {}) {

        Object.assign(
            this.data,
            context
        );

        this.updatedAt =
            Date.now();

        return this;

    }

    exit() {

        this.status = "inactive";

        this.updatedAt =
            Date.now();

        return this;

    }

    get(key, fallback = null) {

        return (
            this.data[key] ??
            fallback
        );

    }

    set(key, value) {

        this.data[key] = value;

        this.updatedAt =
            Date.now();

        return this;

    }

    serialize() {

        return {

            name: this.name,

            status: this.status,

            startedAt:
                this.startedAt,

            updatedAt:
                this.updatedAt,

            data: {
                ...this.data
            }

        };

    }

}