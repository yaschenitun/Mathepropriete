export class QuizRewardManager {

    constructor(options = {}) {

        this.progressionManager =
            options.progressionManager ?? null;

        this.rewardHistory = [];

        this.maxHistory =
            Number(
                options.maxHistory ?? 500
            );

    }

    initialize(services = {}) {

        if (
            services.progressionManager
        ) {

            this.progressionManager =
                services.progressionManager;

        }

        return this;

    }

    calculateReward(session, options = {}) {

        const baseXP =
            Number(
                options.baseXP ?? 10
            );

        const multiplier =
            Number(
                options.multiplier ?? 1
            );

        const score =
            Math.max(
                0,
                Number(session?.score ?? 0)
            );

        return {

            xp:
                Math.floor(
                    (
                        baseXP +
                        score
                    ) *
                    multiplier
                ),

            score,

            correctAnswers:
                Number(
                    session?.correctAnswers ?? 0
                ),

            wrongAnswers:
                Number(
                    session?.wrongAnswers ?? 0
                )

        };

    }

    grant(
        player,
        session,
        options = {}
    ) {

        if (!player) {

            return {

                success: false,

                reason:
                    "missing_player"

            };

        }

        const reward =
            this.calculateReward(
                session,
                options
            );

        let progressionResult =
            null;

        if (
            this.progressionManager &&
            player.id
        ) {

            progressionResult =
                this.progressionManager.addXP(
                    player.id,
                    reward.xp,
                    {
                        source: "quiz"
                    }
                );

        }

        const entry = {

            playerId:
                player.id ?? null,

            sessionId:
                session?.id ?? null,

            xp:
                reward.xp,

            score:
                reward.score,

            timestamp:
                Date.now()

        };

        this.rewardHistory.push(
            entry
        );

        while (
            this.rewardHistory.length >
            this.maxHistory
        ) {

            this.rewardHistory.shift();

        }

        return {

            success: true,

            reward,

            progression:
                progressionResult

        };

    }

    getHistory(playerId = null) {

        if (playerId === null) {

            return [
                ...this.rewardHistory
            ];

        }

        return this.rewardHistory.filter(
            entry =>
                entry.playerId === playerId
        );

    }

}