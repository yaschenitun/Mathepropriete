export class ChestAnimator {

    constructor(game) {

        this.game = game;

        this.animations = new Map();

        this.openAngle = -Math.PI / 2;

        this.animationSpeed = 4;

    }

    async initialize() {

        console.log("ChestAnimator initialisé.");

    }

    playOpen(chest) {

        if (!chest || !chest.mesh) {

            return;

        }

        this.animations.set(

            chest.id,

            {

                chest,

                target: this.openAngle,

                finished: false

            }

        );

    }

    playClose(chest) {

        if (!chest || !chest.mesh) {

            return;

        }

        this.animations.set(

            chest.id,

            {

                chest,

                target: 0,

                finished: false

            }

        );

    }

    update(deltaTime) {

        for (const animation of this.animations.values()) {

            const lid =

                animation.chest.mesh.userData.lid;

            if (!lid) {

                continue;

            }

            const current = lid.rotation.x;

            const target = animation.target;

            const next = current +

                (target - current) *

                Math.min(

                    1,

                    deltaTime * this.animationSpeed

                );

            lid.rotation.x = next;

            if (Math.abs(target - next) < 0.01) {

                lid.rotation.x = target;

                animation.finished = true;

            }

        }

        for (const [id, animation] of this.animations) {

            if (animation.finished) {

               this.animations.delete(id);

            }

        }

    }

}