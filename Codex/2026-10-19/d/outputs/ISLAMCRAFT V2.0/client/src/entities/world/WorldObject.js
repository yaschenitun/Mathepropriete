import * as THREE from "three";

export class WorldObject {

    constructor(game, data = {}) {

        this.game = game;

        this.id = data.id ?? crypto.randomUUID();

        this.type = data.type ?? "object";

        this.position = data.position?.clone() ?? new THREE.Vector3();

        this.rotation = data.rotation?.clone() ?? new THREE.Euler();

        this.scale = data.scale?.clone() ?? new THREE.Vector3(1, 1, 1);

        this.mesh = null;

        this.enabled = true;

        this.visible = true;

    }

    async initialize() {

        console.log("WorldObject initialisé.");

    }

    setMesh(mesh) {

        this.mesh = mesh;

        this.syncTransform();

    }

    syncTransform() {

        if (!this.mesh) {

            return;

        }

        this.mesh.position.copy(this.position);

        this.mesh.rotation.copy(this.rotation);

        this.mesh.scale.copy(this.scale);

    }

    setVisible(value) {

        this.visible = value;

        if (this.mesh) {

            this.mesh.visible = value;

        }

    }

    setPosition(position) {

        this.position.copy(position);

        this.syncTransform();

    }

    setRotation(rotation) {

        this.rotation.copy(rotation);

        this.syncTransform();

    }

    setScale(scale) {

        this.scale.copy(scale);

        this.syncTransform();

    }

    destroy() {

        this.enabled = false;

        if (this.mesh && this.game.scene) {

            this.game.scene.remove(this.mesh);

        }

    }

    update(deltaTime) {

        if (!this.enabled) {

            return;

        }

        this.syncTransform();

    }

}