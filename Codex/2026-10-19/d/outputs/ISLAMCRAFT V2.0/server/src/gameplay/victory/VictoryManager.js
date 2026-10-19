import { VictoryCondition } from "./VictoryCondition.js";

export class VictoryManager {

    constructor(options = {}) {

        this.conditions = new Map();

        this.victory = null;

        this.ended = false;

        this.history = [];

        this.maxHistory =
            Number(options.maxHistory ?? 50);

        if (Array.isArray(options.conditions)) {

            for (
                const condition
                of options.conditions
            ) {

                this.registerCondition(
                    condition
                );

            }

        }

    }

    registerCondition(condition) {

        const instance =
            condition instanceof VictoryCondition
                ? condition
                : new VictoryCondition(
                    condition
                );

        if (!instance.id) {

            throw new TypeError(
                "Victory condition requires an id."
            );

        }

        this.conditions.set(
            instance.id,
            instance
        );

        return instance;

    }

    unregisterCondition(id) {

        return this.conditions.delete(id);

    }

    getCondition(id) {

        return (
            this.conditions.get(id) ??
            null
        );

    }

    getConditions() {

        return [
            ...this.conditions.values()
        ];

    }

    evaluate(context = {}) {

        if (this.ended) {

            return {

                won: true,

                victory:
                    this.getVictory(),

                reason:
                    "victory_already_declared"

            };

        }

        const results = [
            ...this.conditions.values()
        ]
            .map(
                condition =>
                    condition.evaluate(
                        context
                    )
            )
            .filter(
                result =>
                    result.fulfilled
            )
            .sort(
                (a, b) =>
                    b.priority - a.priority
            );

        if (results.length === 0) {

            return {

                won: false,

                victory: null,

                results: []

            };

        }

        const result =
            results[0];

        return {

            won: true,

            conditionId:
                result.conditionId,

            results

        };

    }

    declareVictory(
        winnerId,
        context = {}
    ) {

        if (this.ended) {

            return {

                success: false,

                reason:
                    "victory_already_declared",

                victory:
                    this.getVictory()

            };

        }

        if (!winnerId) {

            return {

                success: false,

                reason:
                    "missing_winner"

            };

        }

        const victory = {

            winnerId,

            conditionId:
                context.conditionId ?? null,

            reason:
                context.reason ??
                "victory",

            metadata:
                context.metadata
                    ? {
                        ...context.metadata
                    }
                    : {},

            timestamp:
                Date.now()

        };

        this.victory =
            victory;

        this.ended = true;

        this.history.push(
            victory
        );

        while (
            this.history.length >
            this.maxHistory
        ) {

            this.history.shift();

        }

        return {

            success: true,

            victory:
                this.getVictory()

        };

    }

    evaluateAndDeclare(
        winnerResolver,
        context = {}
    ) {

        if (
            typeof winnerResolver !==
            "function"
        ) {

            return {

                success: false,

                reason:
                    "invalid_winner_resolver"

            };

        }

        const evaluation =
            this.evaluate(
                context
            );

        if (!evaluation.won) {

            return {

                success: false,

                won: false,

                evaluation

            };

        }

        const winnerId =
            winnerResolver(
                evaluation,
                context
            );

        if (!winnerId) {

            return {

                success: false,

                won: true,

                reason:
                    "winner_not_resolved",

                evaluation

            };

        }

        return this.declareVictory(
            winnerId,
            {

                ...context,

                conditionId:
                    evaluation.conditionId

            }
        );

    }

    hasEnded() {

        return this.ended;

    }

    getWinnerId() {

        return (
            this.victory?.winnerId ??
            null
        );

    }

    getVictory() {

        if (!this.victory) {

            return null;

        }

        return {

            ...this.victory,

            metadata: {
                ...this.victory.metadata
            }

        };

    }

    reset() {

        this.victory = null;

        this.ended = false;

        return this;

    }

    getHistory() {

        return this.history.map(
            victory => ({
                ...victory,

                metadata: {
                    ...victory.metadata
                }

            })
        );

    }

    serialize() {

        return {

            ended:
                this.ended,

            victory:
                this.getVictory(),

            conditions:
                this.getConditions()
                    .map(
                        condition =>
                            condition.serialize()
                    ),

            history:
                this.getHistory()

        };

    }

}