export class CameraFollow {

    constructor(game) {

        this.game = game;

        this.camera = null;

        this.target = null;

        this.offset = {

            x: 0,

            y: 5,

            z: 8

        };

        this.followSpeed = 8;

        this.enabled = true;

    }

    async initialize() {

        this.camera =
            this.game.scene?.getCamera?.() ?? null;

        this.target = this.game.localPlayer ?? null;

        console.log("CameraFollow initialisé.");

    }

    setCamera(camera) {

        this.camera = camera;

    }

    setTarget(target) {

        this.target = target;

    }

    setOffset(x, y, z) {

        this.offset.x = Number(x) || 0;

        this.offset.y = Number(y) || 0;

        this.offset.z = Number(z) || 0;

    }

    setFollowSpeed(speed) {

        this.followSpeed = Math.max(

            0,

            Number(speed) || 0

        );

    }

    setEnabled(enabled) {

        this.enabled = Boolean(enabled);

    }

    update(deltaTime) {

        if (

            !this.enabled ||

            !this.camera ||

            !this.target ||

            !this.target.position

        ) {

            return;

        }

        const targetPosition = this.target.position;

        const factor = Math.min(

            1,

            this.followSpeed * deltaTime

        );

        const desiredX =

            targetPosition.x + this.offset.x;

        const desiredY =

            targetPosition.y + this.offset.y;

        const desiredZ =

            targetPosition.z + this.offset.z;

        this.camera.position.x +=

            (desiredX - this.camera.position.x) *

            factor;

        this.camera.position.y +=

            (desiredY - this.camera.position.y) *

            factor;

        this.camera.position.z +=

            (desiredZ - this.camera.position.z) *

            factor;

    }

    isEnabled() {

        return this.enabled;

    }

}