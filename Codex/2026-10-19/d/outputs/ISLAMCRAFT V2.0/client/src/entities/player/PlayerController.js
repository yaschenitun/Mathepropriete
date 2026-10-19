import * as THREE from "three";

export class PlayerController {

    constructor(game, player) {

        this.game = game;

        this.player = player;

        this.enabled = true;

        this.moveDirection = new THREE.Vector3();

        this.cameraDirection = new THREE.Vector3();

        this.cameraRight = new THREE.Vector3();

        this.velocity = new THREE.Vector3();

        this.speed = 6;

        this.rotationSpeed = 5;

    }


    async initialize() {

        console.log(
            "PlayerController initialisé."
        );

    }


    update(deltaTime) {

        if (!this.enabled) {

            return;

        }


        const input =
            this.game.inputManager?.getMovement?.();


        if (!input) {

            return;

        }


        /*
         * Direction du déplacement.
         */

        this.moveDirection.set(
            0,
            0,
            0
        );


        const camera =
            this.game.scene?.getCamera?.();


        if (camera) {

            camera.getWorldDirection(
                this.cameraDirection
            );


            this.cameraDirection.y =
                0;


            this.cameraDirection.normalize();


            this.cameraRight.crossVectors(
                this.cameraDirection,
                new THREE.Vector3(
                    0,
                    1,
                    0
                )
            );


            this.cameraRight.normalize();

        }


        this.moveDirection.addScaledVector(
            this.cameraDirection,
            input.forward
        );


        this.moveDirection.addScaledVector(
            this.cameraRight,
            input.right
        );


        if (
            this.moveDirection.lengthSq() > 0
        ) {

            this.moveDirection.normalize();

        }


        /*
         * Vitesse de déplacement.
         */

        this.velocity.copy(
            this.moveDirection
        ).multiplyScalar(
            this.speed * deltaTime
        );


        /*
         * COLLISIONS
         *
         * Un seul appel au CollisionController.
         */

        const collisionController =
            this.game.collisionController;


        if (
            collisionController
        ) {

            const allowedMovement =
                collisionController.resolveMovement(
                    this.player.position,
                    this.velocity
                );


            this.velocity.copy(
                allowedMovement
            );

        }


        /*
         * Application du déplacement.
         */

        this.player.translate(
            this.velocity
        );


        /*
         * Rotation du personnage.
         */

        if (
            this.moveDirection.lengthSq() >
            0.001
        ) {

            const angle =
                Math.atan2(
                    this.moveDirection.x,
                    this.moveDirection.z
                );


            let angleDifference =
                angle -
                this.player.rotation.y;


            while (
                angleDifference >
                Math.PI
            ) {

                angleDifference -=
                    Math.PI * 2;

            }


            while (
                angleDifference <
                -Math.PI
            ) {

                angleDifference +=
                    Math.PI * 2;

            }


            this.player.rotation.y +=
                angleDifference *
                Math.min(
                    1,
                    deltaTime *
                    this.rotationSpeed
                );

        }


        /*
         * Animation.
         */

        if (
            this.game.playerAnimator
        ) {

            this.game.playerAnimator.update(
                deltaTime,
                this.velocity
            );

        }


        /*
         * Synchronisation réseau.
         */

        if (
            this.game.networkManager
                ?.sendPlayerMovement
        ) {

            this.game.networkManager.sendPlayerMovement({

                position:
                    this.player.position,

                rotation:
                    this.player.rotation

            });

        }

    }

}