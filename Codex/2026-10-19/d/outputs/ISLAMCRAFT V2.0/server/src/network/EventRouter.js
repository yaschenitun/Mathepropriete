export class EventRouter {

    constructor() {

        this.handlers = new Map();

    }

    on(event, handler) {

        if (
            !event ||
            typeof handler !== "function"
        ) {

            throw new TypeError(
                "Event and handler are required."
            );

        }

        if (!this.handlers.has(event)) {

            this.handlers.set(
                event,
                new Set()
            );

        }

        this.handlers
            .get(event)
            .add(handler);

        return () =>
            this.off(
                event,
                handler
            );

    }

    off(event, handler) {

        const handlers =
            this.handlers.get(event);

        if (!handlers) {

            return false;

        }

        const removed =
            handlers.delete(handler);

        if (handlers.size === 0) {

            this.handlers.delete(event);

        }

        return removed;

    }

    once(event, handler) {

        const unsubscribe =
            this.on(
                event,
                (...args) => {

                    unsubscribe();

                    return handler(
                        ...args
                    );

                }
            );

        return unsubscribe;

    }

    async emit(event, ...args) {

        const handlers =
            this.handlers.get(event);

        if (!handlers) {

            return [];

        }

        const results = [];

        for (
            const handler
            of [...handlers]
        ) {

            results.push(
                await handler(
                    ...args
                )
            );

        }

        return results;

    }

    has(event) {

        return this.handlers.has(event);

    }

    clear(event = null) {

        if (event === null) {

            this.handlers.clear();

            return;

        }

        this.handlers.delete(event);

    }

}