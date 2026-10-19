export class CameraCollision {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.minimumDistance = 0.5;

        this.collisionDistance = 0;

    }

    async initialize() {

        console.log("CameraCollision initialisé.");

    }

    setEnabled(enabled) {

        this.enabled = Boolean(enabled);

    }

    isEnabled() {

        return this.enabled;

    }

    setMinimumDistance(distance) {

        this.minimumDistance = Math.max(

            0,

            Number(distance) || 0

        );

    }

    getMinimumDistance() {

        return this.minimumDistance;

    }

    resolve(position, target) {

        if (!this.enabled || !position || !target) {

            return position;

        }

        const dx = position.x - target.x;

        const dy = position.y - target.y;

        const dz = position.z - target.z;

        const distance = Math.sqrt(

            dx * dx +

            dy * dy +

            dz * dz

        );

        this.collisionDistance = distance;

        if (distance <= this.minimumDistance) {

            return {

                x: target.x,

                y: target.y,

                z: target.z

            };

        }

        return {

            x: position.x,

            y: position.y,

            z: position.z

        };

    }

    getCollisionDistance() {

        return this.collisionDistance;

    }

}