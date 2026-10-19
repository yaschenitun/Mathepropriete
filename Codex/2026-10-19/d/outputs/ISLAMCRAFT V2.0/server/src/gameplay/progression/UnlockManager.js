export class UnlockManager {

    constructor(options = {}) {

        this.unlocks = new Map();

        this.playerUnlocks = new Map();

        if (options.unlocks) {

            this.load(
                options.unlocks
            );

        }

    }

    register(id, definition = {}) {

        if (!id) {

            throw new TypeError(
                "Un identifiant d'unlock est requis."
            );

        }

        this.unlocks.set(
            id,
            {

                id,

                ...definition

            }
        );

        return this.unlocks.get(id);

    }

    load(definitions) {

        if (Array.isArray(definitions)) {

            for (const definition of definitions) {

                if (definition?.id) {

                    this.register(
                        definition.id,
                        definition
                    );

                }

            }

        } else if (
            definitions &&
            typeof definitions === "object"
        ) {

            for (
                const [
                    id,
                    definition
                ] of Object.entries(definitions)
            ) {

                this.register(
                    id,
                    definition
                );

            }

        }

        return this;

    }

    get(id) {

        return (
            this.unlocks.get(id) ??
            null
        );

    }

    has(id) {

        return this.unlocks.has(id);

    }

    getPlayerUnlocks(playerId) {

        if (!this.playerUnlocks.has(playerId)) {

            this.playerUnlocks.set(
                playerId,
                new Set()
            );

        }

        return this.playerUnlocks.get(
            playerId
        );

    }

    isUnlocked(playerId, unlockId) {

        return this.getPlayerUnlocks(
            playerId
        ).has(unlockId);

    }

    unlock(playerId, unlockId) {

        if (!this.has(unlockId)) {

            return {

                success: false,

                reason:
                    "unlock_not_found"

            };

        }

        const unlocked =
            this.getPlayerUnlocks(
                playerId
            );

        if (unlocked.has(unlockId)) {

            return {

                success: true,

                alreadyUnlocked: true,

                unlock:
                    this.get(unlockId)

            };

        }

        unlocked.add(unlockId);

        return {

            success: true,

            alreadyUnlocked: false,

            unlock:
                this.get(unlockId)

        };

    }

    lock(playerId, unlockId) {

        const unlocked =
            this.getPlayerUnlocks(
                playerId
            );

        return unlocked.delete(
            unlockId
        );

    }

    checkRequirements(
        playerId,
        definition,
        context = {}
    ) {

        const requirements =
            definition?.requirements ?? [];

        for (const requirement of requirements) {

            if (
                requirement.type === "unlock"
            ) {

                if (
                    !this.isUnlocked(
                        playerId,
                        requirement.id
                    )
                ) {

                    return false;

                }

            } else if (
                requirement.type === "level"
            ) {

                if (
                    Number(context.level ?? 0) <
                    Number(requirement.value ?? 0)
                ) {

                    return false;

                }

            } else if (
                requirement.type === "item"
            ) {

                if (
                    typeof context.hasItem ===
                    "function" &&
                    !context.hasItem(
                        requirement.id,
                        requirement.amount ?? 1
                    )
                ) {

                    return false;

                }

            }

        }

        return true;

    }

    tryUnlock(
        playerId,
        unlockId,
        context = {}
    ) {

        const definition =
            this.get(unlockId);

        if (!definition) {

            return {

                success: false,

                reason:
                    "unlock_not_found"

            };

        }

        if (
            this.isUnlocked(
                playerId,
                unlockId
            )
        ) {

            return {

                success: true,

                alreadyUnlocked: true,

                unlock:
                    definition

            };

        }

        if (
            !this.checkRequirements(
                playerId,
                definition,
                context
            )
        ) {

            return {

                success: false,

                reason:
                    "requirements_not_met"

            };

        }

        return this.unlock(
            playerId,
            unlockId
        );

    }

    getUnlocked(playerId) {

        return [
            ...this.getPlayerUnlocks(
                playerId
            )
        ];

    }

    clearPlayer(playerId) {

        return this.playerUnlocks.delete(
            playerId
        );

    }

    clear() {

        this.unlocks.clear();

        this.playerUnlocks.clear();

    }

}