import * as THREE from "three";

export class Chest {

    constructor(game, data = {}) {

        this.game = game;

        this.id = data.id ?? crypto.randomUUID();

        this.position = data.position?.clone() ?? new THREE.Vector3();

        this.rotation = new THREE.Euler();

        this.mesh = null;

        this.isOpen = false;

        this.isActive = true;

        this.canInteract = true;

        this.loot = data.loot ?? null;

    }

    async initialize() {

        console.log("Chest initialisé.");

    }

    setMesh(mesh) {

        this.mesh = mesh;

        if (this.mesh) {

            this.mesh.position.copy(this.position);

            this.mesh.rotation.copy(this.rotation);

        }

    }

    setPosition(position) {

        this.position.copy(position);

        if (this.mesh) {

            this.mesh.position.copy(position);

        }

    }

    open() {

        if (!this.canInteract || this.isOpen) {

            return false;

        }

        this.isOpen = true;

        this.canInteract = false;

        if (this.game.chestAnimator) {

            this.game.chestAnimator.playOpen(this);

        }

        if (this.game.audioManager?.play) {

            this.game.audioManager.play("chest_open");

        }

        return true;

    }

    close() {

        this.isOpen = false;

        this.canInteract = true;

    }

    destroy() {

        this.isActive = false;

        if (this.mesh && this.game.scene) {

            this.game.scene.remove(this.mesh);

        }

    }

    update(deltaTime) {

        if (!this.isActive) {

            return;

        }

        if (this.mesh) {

            this.mesh.position.copy(this.position);

            this.mesh.rotation.copy(this.rotation);

        }

    }

}