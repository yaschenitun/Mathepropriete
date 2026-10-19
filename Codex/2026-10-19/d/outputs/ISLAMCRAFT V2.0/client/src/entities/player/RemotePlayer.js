import * as THREE from "three";

export class RemotePlayer {

    constructor(game, data = {}) {

        this.game = game;

        this.id = data.id ?? crypto.randomUUID();

        this.username = data.username ?? "RemotePlayer";

        this.skin = data.skin ?? "default";

        this.position = new THREE.Vector3();

        this.targetPosition = new THREE.Vector3();

        this.rotation = new THREE.Euler();

        this.targetRotation = new THREE.Euler();

        this.velocity = new THREE.Vector3();

        this.mesh = null;

        this.enabled = true;

        this.interpolationSpeed = 10;

    }

    async initialize() {

        console.log("RemotePlayer initialisé.");

    }

    setMesh(mesh) {

        this.mesh = mesh;

    }

    applySnapshot(snapshot) {

        if (!snapshot) {

            return;

        }

        this.targetPosition.set(

            snapshot.position.x,

            snapshot.position.y,

            snapshot.position.z

        );

        this.targetRotation.set(

            snapshot.rotation.x,

            snapshot.rotation.y,

            snapshot.rotation.z

        );

    }

    teleport(position) {

        this.position.copy(position);

        this.targetPosition.copy(position);

        if (this.mesh) {

            this.mesh.position.copy(position);

        }

    }

    update(deltaTime) {

        if (!this.enabled) {

            return;

        }

        const alpha = Math.min(

            1,

            deltaTime * this.interpolationSpeed

        );

        this.position.lerp(

            this.targetPosition,

            alpha

        );

        this.rotation.x +=

            (this.targetRotation.x - this.rotation.x) * alpha;

        this.rotation.y +=

            (this.targetRotation.y - this.rotation.y) * alpha;

        this.rotation.z +=

            (this.targetRotation.z - this.rotation.z) * alpha;

        if (this.mesh) {

            this.mesh.position.copy(

                this.position

            );

            this.mesh.rotation.copy(

                this.rotation

            );

        }

    }

}