import * as THREE from "three";

export class FrustumCulling {

    constructor(game) {

        this.game = game;

        this.camera = null;

        this.frustum = new THREE.Frustum();

        this.projectionMatrix = new THREE.Matrix4();

        this.dynamicObjects = new Set();

        this.enabled = true;

    }

    async initialize() {

        this.camera = this.game.scene.getCamera();

        console.log("FrustumCulling initialisé.");

    }

    register(object) {

        if (!object) return;

        this.dynamicObjects.add(object);

    }

    unregister(object) {

        this.dynamicObjects.delete(object);

    }

    update() {

        if (!this.enabled) return;

        this.projectionMatrix.multiplyMatrices(

            this.camera.projectionMatrix,

            this.camera.matrixWorldInverse

        );

        this.frustum.setFromProjectionMatrix(

            this.projectionMatrix

        );

        for (const object of this.dynamicObjects) {

            if (!object) continue;

            if (!object.geometry) continue;

            if (!object.geometry.boundingSphere) {

                object.geometry.computeBoundingSphere();

            }

            const sphere = object.geometry.boundingSphere.clone();

            sphere.applyMatrix4(object.matrixWorld);

            object.visible = this.frustum.intersectsSphere(sphere);

        }

    }

    clear() {

        this.dynamicObjects.clear();

    }

    setEnabled(value) {

        this.enabled = value;

    }

}