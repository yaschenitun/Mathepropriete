export class InputReceiver {

    constructor(options = {}) {

        this.router =
            options.router ?? null;

        this.validators =
            new Map();

        this.inputs =
            new Map();

    }

    setRouter(router) {

        this.router = router;

        return this;

    }

    registerValidator(
        inputType,
        validator
    ) {

        if (
            !inputType ||
            typeof validator !== "function"
        ) {

            throw new TypeError(
                "Input type and validator are required."
            );

        }

        this.validators.set(
            inputType,
            validator
        );

        return this;

    }

    receive(
        playerId,
        input
    ) {

        if (!playerId) {

            return {
                accepted: false,
                reason: "missing_player"
            };

        }

        if (!input || typeof input !== "object") {

            return {
                accepted: false,
                reason: "invalid_input"
            };

        }

        const type =
            input.type ?? "unknown";

        const validator =
            this.validators.get(type);

        if (validator) {

            let valid = false;

            try {

                valid =
                    Boolean(
                        validator(
                            input,
                            playerId
                        )
                    );

            } catch {

                valid = false;

            }

            if (!valid) {

                return {
                    accepted: false,
                    reason: "input_rejected"
                };

            }

        }

        const record = {

            ...input,

            playerId,

            receivedAt:
                Date.now()

        };

        if (!this.inputs.has(playerId)) {

            this.inputs.set(
                playerId,
                []
            );

        }

        const history =
            this.inputs.get(playerId);

        history.push(record);

        if (history.length > 100) {

            history.shift();

        }

        if (
            this.router &&
            typeof this.router.emit ===
                "function"
        ) {

            this.router.emit(
                "input",
                record
            );

        }

        return {

            accepted: true,

            input: record

        };

    }

    getLatest(playerId) {

        const history =
            this.inputs.get(playerId);

        return (
            history?.[history.length - 1] ??
            null
        );

    }

    getHistory(playerId) {

        return [
            ...(this.inputs.get(playerId) ?? [])
        ];

    }

    clear(playerId = null) {

        if (playerId === null) {

            this.inputs.clear();

            return;

        }

        this.inputs.delete(
            playerId
        );

    }

}