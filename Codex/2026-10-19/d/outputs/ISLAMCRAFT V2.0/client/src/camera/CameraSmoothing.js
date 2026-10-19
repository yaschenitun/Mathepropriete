export class CameraSmoothing {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.positionSpeed = 10;

        this.rotationSpeed = 10;

    }

    async initialize() {

        console.log("CameraSmoothing initialisé.");

    }

    setEnabled(enabled) {

        this.enabled = Boolean(enabled);

    }

    setPositionSpeed(speed) {

        this.positionSpeed = Math.max(

            0,

            Number(speed) || 0

        );

    }

    setRotationSpeed(speed) {

        this.rotationSpeed = Math.max(

            0,

            Number(speed) || 0

        );

    }

    smoothPosition(current, target, deltaTime) {

        if (!this.enabled || !current || !target) {

            return current;

        }

        const factor = Math.min(

            1,

            this.positionSpeed * deltaTime

        );

        current.x +=

            (target.x - current.x) * factor;

        current.y +=

            (target.y - current.y) * factor;

        current.z +=

            (target.z - current.z) * factor;

        return current;

    }

    smoothRotation(current, target, deltaTime) {

        if (!this.enabled || !current || !target) {

            return current;

        }

        const factor = Math.min(

            1,

            this.rotationSpeed * deltaTime

        );

        current.x +=

            (target.x - current.x) * factor;

        current.y +=

            (target.y - current.y) * factor;

        current.z +=

            (target.z - current.z) * factor;

        return current;

    }

    isEnabled() {

        return this.enabled;

    }

}