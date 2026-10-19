import * as THREE from "three";

export class MovementController {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.moveDirection = new THREE.Vector3();

        this.cameraForward = new THREE.Vector3();

        this.cameraRight = new THREE.Vector3();

        this.velocity = new THREE.Vector3();

        this.currentSpeed = 0;

        this.walkSpeed = 6;

        this.runSpeed = 9;

        this.acceleration = 18;

        this.deceleration = 20;

    }

    async initialize() {

        console.log("MovementController initialisé.");

    }

    update(deltaTime) {

        if (!this.enabled) {

            return;

        }

        const player = this.game.localPlayer;

        const camera = this.game.camera;

        const input = this.game.inputManager?.getMovement?.();

        if (!player || !camera || !input) {

            return;

        }

        this.moveDirection.set(0, 0, 0);

        camera.getWorldDirection(this.cameraForward);

        this.cameraForward.y = 0;

        this.cameraForward.normalize();

        this.cameraRight.crossVectors(

            this.cameraForward,

            new THREE.Vector3(0, 1, 0)

        );

        this.cameraRight.normalize();

        this.moveDirection.addScaledVector(

            this.cameraForward,

            input.forward

        );

        this.moveDirection.addScaledVector(

            this.cameraRight,

            input.right

        );

        if (this.moveDirection.lengthSq() > 0) {

            this.moveDirection.normalize();

            this.currentSpeed +=

                this.acceleration * deltaTime;

        } else {

            this.currentSpeed -=

                this.deceleration * deltaTime;

        }

        this.currentSpeed = THREE.MathUtils.clamp(

            this.currentSpeed,

            0,

            this.walkSpeed

        );

        this.velocity.copy(

            this.moveDirection

        ).multiplyScalar(

            this.currentSpeed * deltaTime

        );

        player.position.add(

            this.velocity

        );

        if (this.moveDirection.lengthSq() > 0.0001) {

            const targetRotation = Math.atan2(

                this.moveDirection.x,

                this.moveDirection.z

            );

            player.rotation.y +=

                (targetRotation - player.rotation.y)

                * Math.min(

                    1,

                    deltaTime * 10

                );

        }

        this.game.playerAnimator?.update(

            deltaTime,

            this.velocity

        );

    }

}