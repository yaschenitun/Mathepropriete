import { XPManager } from "./XPManager.js";
import { LevelManager } from "./LevelManager.js";
import { UnlockManager } from "./UnlockManager.js";

export class ProgressionManager {

    constructor(options = {}) {

        this.xpManager =
            options.xpManager ??
            new XPManager(options);

        this.levelManager =
            options.levelManager ??
            new LevelManager(options);

        this.unlockManager =
            options.unlockManager ??
            new UnlockManager(options);

        this.players = new Map();

    }

    initialize() {

        this.levelManager.initialize(
            this.xpManager
        );

        return this;

    }

    createPlayerProgression(
        playerId,
        data = {}
    ) {

        if (!playerId) {

            throw new TypeError(
                "Un identifiant joueur est requis."
            );

        }

        const progression = {

            playerId,

            xp:
                Math.max(
                    0,
                    Number(data.xp ?? 0)
                ),

            level:
                1,

            createdAt:
                Date.now(),

            updatedAt:
                Date.now()

        };

        progression.level =
            this.xpManager.getLevelFromXP(
                progression.xp
            );

        this.players.set(
            playerId,
            progression
        );

        return progression;

    }

    get(playerId) {

        return (
            this.players.get(playerId) ??
            this.createPlayerProgression(
                playerId
            )
        );

    }

    addXP(playerId, amount, context = {}) {

        const progression =
            this.get(playerId);

        const result =
            this.xpManager.addXP(
                progression.xp,
                amount
            );

        progression.xp =
            result.totalXP;

        progression.level =
            result.level;

        progression.updatedAt =
            Date.now();

        const rewards =
            this.levelManager.getRewardsBetween(
                result.previousLevel,
                result.level
            );

        const unlocked = [];

        for (const reward of rewards) {

            const unlockId =
                reward.reward?.unlock;

            if (!unlockId) {

                continue;

            }

            const unlockResult =
                this.unlockManager.tryUnlock(
                    playerId,
                    unlockId,
                    {

                        ...context,

                        level:
                            progression.level

                    }
                );

            if (unlockResult.success) {

                unlocked.push(
                    unlockResult
                );

            }

        }

        return {

            ...result,

            rewards,

            unlocked,

            progression: {
                ...progression
            }

        };

    }

    getProgress(playerId) {

        const progression =
            this.get(playerId);

        return this.xpManager.getProgress(
            progression.xp
        );

    }

    unlock(
        playerId,
        unlockId,
        context = {}
    ) {

        const progression =
            this.get(playerId);

        return this.unlockManager.tryUnlock(
            playerId,
            unlockId,
            {

                ...context,

                level:
                    progression.level

            }
        );

    }

    getUnlocks(playerId) {

        return this.unlockManager.getUnlocked(
            playerId
        );

    }

    removePlayer(playerId) {

        this.unlockManager.clearPlayer(
            playerId
        );

        return this.players.delete(
            playerId
        );

    }

    getAll() {

        return [
            ...this.players.values()
        ];

    }

    serializePlayer(playerId) {

        const progression =
            this.get(playerId);

        return {

            playerId:
                progression.playerId,

            xp:
                progression.xp,

            level:
                progression.level,

            progress:
                this.getProgress(
                    playerId
                ),

            unlocks:
                this.getUnlocks(
                    playerId
                ),

            updatedAt:
                progression.updatedAt

        };

    }

    clear() {

        this.players.clear();

        this.unlockManager.clear();

    }

}