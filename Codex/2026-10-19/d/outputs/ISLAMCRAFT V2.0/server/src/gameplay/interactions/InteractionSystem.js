import { InteractionValidator } from "./InteractionValidator.js";
import { InteractionResolver } from "./InteractionResolver.js";

export class InteractionSystem {

    constructor(options = {}) {

        this.validator =
            options.validator ??
            new InteractionValidator(options);

        this.resolver =
            options.resolver ??
            new InteractionResolver(options);

        this.history = [];

        this.maxHistory =
            Number(
                options.maxHistory ?? 100
            );

        this.enabled =
            options.enabled !== false;

    }

    initialize(server) {

        this.server = server;

        return this;

    }

    register(type, handler) {

        this.resolver.register(
            type,
            handler
        );

        return this;

    }

    unregister(type) {

        return this.resolver.unregister(
            type
        );

    }

    interact(
        player,
        target,
        interaction = {}
    ) {

        if (!this.enabled) {

            return {

                success: false,

                reason:
                    "interaction_system_disabled"

            };

        }

        const validation =
            this.validator.validate(
                player,
                target,
                interaction
            );

        if (!validation.valid) {

            return {

                success: false,

                reason:
                    validation.reason,

                distance:
                    validation.distance ??
                    null

            };

        }

        const type =
            interaction.type ??
            validation.type;

        const result =
            this.resolver.execute(
                type,
                {

                    player,

                    target,

                    interaction,

                    validation,

                    system: this

                }
            );

        this.record({

            playerId:
                player?.id ?? null,

            targetId:
                target?.id ?? null,

            type,

            success:
                result.success,

            timestamp:
                Date.now()

        });

        return result;

    }

    record(entry) {

        this.history.push(entry);

        while (
            this.history.length >
            this.maxHistory
        ) {

            this.history.shift();

        }

    }

    getHistory() {

        return [
            ...this.history
        ];

    }

    clearHistory() {

        this.history.length = 0;

    }

    setEnabled(enabled) {

        this.enabled =
            Boolean(enabled);

    }

}