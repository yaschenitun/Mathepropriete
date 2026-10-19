export class StateMachine {

    constructor(options = {}) {

        this.states = new Map();

        this.current = null;

        this.previous = null;

        this.context =
            options.context ?? {};

        this.history = [];

        this.maxHistory =
            Number(
                options.maxHistory ?? 50
            );

    }

    register(name, state) {

        if (!name || !state) {

            throw new TypeError(
                "A state name and state instance are required."
            );

        }

        this.states.set(
            name,
            state
        );

        return this;

    }

    unregister(name) {

        if (
            this.current?.name === name
        ) {

            return false;

        }

        return this.states.delete(name);

    }

    has(name) {

        return this.states.has(name);

    }

    get(name) {

        return (
            this.states.get(name) ??
            null
        );

    }

    getCurrent() {

        return this.current;

    }

    getPrevious() {

        return this.previous;

    }

    transition(name, context = {}) {

        const next =
            this.get(name);

        if (!next) {

            return {

                success: false,

                reason:
                    "state_not_found"

            };

        }

        if (
            this.current?.name === name
        ) {

            return {

                success: true,

                changed: false,

                state:
                    this.current

            };

        }

        const previous =
            this.current;

        if (
            previous &&
            typeof previous.exit ===
                "function"
        ) {

            previous.exit(
                this.context
            );

        }

        this.previous =
            previous;

        this.context = {
            ...this.context,
            ...context
        };

        this.current =
            next;

        if (
            typeof next.enter ===
                "function"
        ) {

            next.enter(
                this.context
            );

        }

        this.history.push({

            from:
                previous?.name ?? null,

            to:
                next.name,

            timestamp:
                Date.now()

        });

        while (
            this.history.length >
            this.maxHistory
        ) {

            this.history.shift();

        }

        return {

            success: true,

            changed: true,

            state:
                next

        };

    }

    update(context = {}) {

        this.context = {
            ...this.context,
            ...context
        };

        if (
            this.current &&
            typeof this.current.update ===
                "function"
        ) {

            this.current.update(
                this.context
            );

        }

        return this.current;

    }

    getHistory() {

        return [
            ...this.history
        ];

    }

    clearHistory() {

        this.history.length = 0;

    }

}