export class InteractionResolver {

    constructor(options = {}) {

        this.handlers = new Map();

        if (options.handlers) {

            for (
                const [
                    type,
                    handler
                ] of Object.entries(options.handlers)
            ) {

                this.register(
                    type,
                    handler
                );

            }

        }

    }

    register(type, handler) {

        if (!type) {

            throw new TypeError(
                "Un type d'interaction est requis."
            );

        }

        if (
            typeof handler !== "function"
        ) {

            throw new TypeError(
                "Le handler doit être une fonction."
            );

        }

        this.handlers.set(
            type,
            handler
        );

        return this;

    }

    unregister(type) {

        return this.handlers.delete(
            type
        );

    }

    has(type) {

        return this.handlers.has(
            type
        );

    }

    resolve(type) {

        return (
            this.handlers.get(type) ??
            null
        );

    }

    execute(
        type,
        context = {}
    ) {

        const handler =
            this.resolve(type);

        if (!handler) {

            return {

                success: false,

                reason:
                    "interaction_not_supported"

            };

        }

        try {

            const result =
                handler(context);

            return {

                success: true,

                result

            };

        } catch (error) {

            return {

                success: false,

                reason:
                    "interaction_failed",

                error

            };

        }

    }

    getTypes() {

        return [
            ...this.handlers.keys()
        ];

    }

}