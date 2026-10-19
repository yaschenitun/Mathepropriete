import * as THREE from "three";

export class InstancingManager {

    constructor(game) {

        this.game = game;

        this.scene = null;

        this.instancedMeshes = new Map();

        this.tempMatrix = new THREE.Matrix4();

        this.enabled = true;

    }

    async initialize() {

        this.scene = this.game.scene.getScene();

        console.log("InstancingManager initialisé.");

    }

    createInstancedMesh(id, geometry, material, maxInstances) {

        if (this.instancedMeshes.has(id)) {

            return this.instancedMeshes.get(id);

        }

        const mesh = new THREE.InstancedMesh(

            geometry,

            material,

            maxInstances

        );

        mesh.castShadow = true;

        mesh.receiveShadow = true;

        mesh.count = 0;

        this.scene.add(mesh);

        this.instancedMeshes.set(id, mesh);

        return mesh;

    }

    addInstance(id, position, rotation, scale = 1) {

        const mesh = this.instancedMeshes.get(id);

        if (!mesh) return -1;

        const index = mesh.count;

        this.tempMatrix.compose(

            position,

            rotation,

            new THREE.Vector3(scale, scale, scale)

        );

        mesh.setMatrixAt(index, this.tempMatrix);

        mesh.count++;

        mesh.instanceMatrix.needsUpdate = true;

        return index;

    }

    clear(id) {

        const mesh = this.instancedMeshes.get(id);

        if (!mesh) return;

        mesh.count = 0;

        mesh.instanceMatrix.needsUpdate = true;

    }

    remove(id) {

        const mesh = this.instancedMeshes.get(id);

        if (!mesh) return;

        this.scene.remove(mesh);

        mesh.dispose();

        this.instancedMeshes.delete(id);

    }

    clearAll() {

        for (const id of this.instancedMeshes.keys()) {

            this.remove(id);

        }

    }

}