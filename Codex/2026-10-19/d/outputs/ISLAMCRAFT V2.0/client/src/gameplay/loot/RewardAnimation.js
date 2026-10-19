export class RewardAnimation {

    constructor(game) {

        this.game = game;

        this.activeAnimations = [];

        this.defaultDuration = 1.5;

    }

    async initialize() {

        console.log("RewardAnimation initialisé.");

    }

    play(rewards, position = null) {

        if (!Array.isArray(rewards)) {

            rewards = [rewards];

        }

        for (const reward of rewards) {

            this.activeAnimations.push({

                reward,

                position,

                elapsed: 0,

                duration: this.defaultDuration

            });

        }

    }

    update(deltaTime) {

        for (let i = this.activeAnimations.length - 1; i >= 0; i--) {

            const animation = this.activeAnimations[i];

            animation.elapsed += deltaTime;

            const progress =

                animation.elapsed /

                animation.duration;

            this.game.particleManager?.spawnRewardEffect?.(

                animation.reward,

                animation.position,

                progress

            );

            if (progress >= 1) {

                this.activeAnimations.splice(i, 1);

            }

        }

    }

    clear() {

        this.activeAnimations.length = 0;

    }

    isPlaying() {

        return this.activeAnimations.length > 0;

    }

}