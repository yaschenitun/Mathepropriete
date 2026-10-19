export class VictoryCondition {

    constructor(options = {}) {

        this.id =
            options.id ?? null;

        this.name =
            options.name ??
            this.id ??
            "victory_condition";

        this.description =
            options.description ?? "";

        this.priority =
            Number(options.priority ?? 0);

        this.enabled =
            options.enabled !== false;

        this.check =
            typeof options.check === "function"
                ? options.check
                : () => false;

    }

    isEnabled() {

        return this.enabled;

    }

    enable() {

        this.enabled = true;

        return this;

    }

    disable() {

        this.enabled = false;

        return this;

    }

    evaluate(context = {}) {

        if (!this.enabled) {

            return {

                fulfilled: false,

                conditionId: this.id,

                reason: "disabled"

            };

        }

        try {

            const result =
                this.check(context);

            return {

                fulfilled:
                    Boolean(result),

                conditionId:
                    this.id,

                priority:
                    this.priority

            };

        } catch (error) {

            return {

                fulfilled: false,

                conditionId: this.id,

                priority:
                    this.priority,

                reason:
                    "condition_error",

                error

            };

        }

    }

    serialize() {

        return {

            id:
                this.id,

            name:
                this.name,

            description:
                this.description,

            priority:
                this.priority,

            enabled:
                this.enabled

        };

    }

}