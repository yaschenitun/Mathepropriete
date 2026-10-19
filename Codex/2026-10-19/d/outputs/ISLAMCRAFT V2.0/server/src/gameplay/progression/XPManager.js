export class XPManager {

    constructor(options = {}) {

        this.baseXP =
            Number(options.baseXP ?? 100);

        this.growth =
            Number(options.growth ?? 1.15);

        this.maxLevel =
            Number(options.maxLevel ?? 100);

    }

    getRequiredXP(level) {

        level = Math.max(
            1,
            Math.floor(Number(level))
        );

        if (level >= this.maxLevel) {
            return 0;
        }

        return Math.floor(
            this.baseXP *
            Math.pow(
                this.growth,
                level - 1
            )
        );

    }

    getTotalXPForLevel(level) {

        level = Math.max(
            1,
            Math.floor(Number(level))
        );

        let total = 0;

        for (let i = 1; i < level; i++) {

            total += this.getRequiredXP(i);

        }

        return total;

    }

    getLevelFromXP(totalXP) {

        let xp = Math.max(
            0,
            Number(totalXP) || 0
        );

        let level = 1;

        while (
            level < this.maxLevel
        ) {

            const required =
                this.getRequiredXP(level);

            if (xp < required) {
                break;
            }

            xp -= required;

            level++;

        }

        return level;

    }

    getProgress(totalXP) {

        const level =
            this.getLevelFromXP(totalXP);

        if (level >= this.maxLevel) {

            return {
                level,
                currentXP: 0,
                requiredXP: 0,
                progress: 1,
                totalXP
            };

        }

        const levelStart =
            this.getTotalXPForLevel(level);

        const currentXP =
            Math.max(
                0,
                Number(totalXP) - levelStart
            );

        const requiredXP =
            this.getRequiredXP(level);

        return {

            level,

            currentXP,

            requiredXP,

            progress:
                requiredXP > 0
                    ? Math.min(
                        1,
                        currentXP / requiredXP
                    )
                    : 1,

            totalXP

        };

    }

    addXP(currentXP, amount) {

        const before =
            this.getLevelFromXP(
                currentXP
            );

        const totalXP =
            Math.max(
                0,
                Number(currentXP) || 0
            ) +
            Math.max(
                0,
                Number(amount) || 0
            );

        const after =
            this.getLevelFromXP(
                totalXP
            );

        return {

            totalXP,

            level:
                after,

            previousLevel:
                before,

            levelsGained:
                Math.max(
                    0,
                    after - before
                ),

            progress:
                this.getProgress(
                    totalXP
                )

        };

    }

}