import * as THREE from "three";

export class MovementSmoothing {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.positionLerpSpeed = 15;

        this.rotationLerpSpeed = 12;

        this.targetPosition = new THREE.Vector3();

        this.targetRotation = new THREE.Euler();

    }

    async initialize() {

        console.log("MovementSmoothing initialisé.");

    }

    setTarget(position, rotation) {

        if (position) {

            this.targetPosition.copy(position);

        }

        if (rotation) {

            this.targetRotation.copy(rotation);

        }

    }

    update(deltaTime, object) {

        if (!this.enabled || !object) {

            return;

        }

        object.position.lerp(

            this.targetPosition,

            Math.min(

                1,

                deltaTime * this.positionLerpSpeed

            )

        );

        object.rotation.x +=

            (this.targetRotation.x - object.rotation.x)

            * Math.min(

                1,

                deltaTime * this.rotationLerpSpeed

            );

        object.rotation.y +=

            (this.targetRotation.y - object.rotation.y)

            * Math.min(

                1,

                deltaTime * this.rotationLerpSpeed

            );

        object.rotation.z +=

            (this.targetRotation.z - object.rotation.z)

            * Math.min(

                1,

                deltaTime * this.rotationLerpSpeed

            );

    }

    teleport(object, position, rotation) {

        if (!object) {

            return;

        }

        object.position.copy(position);

        object.rotation.copy(rotation);

        this.targetPosition.copy(position);

        this.targetRotation.copy(rotation);

    }

    reset() {

        this.targetPosition.set(0, 0, 0);

        this.targetRotation.set(0, 0, 0);

    }

}