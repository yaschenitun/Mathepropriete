import * as THREE from "three";

export class Lighting {

    constructor(game) {

        this.game = game;

        this.scene = null;

        this.ambientLight = null;

        this.directionalLight = null;

    }

    async initialize() {

        this.scene = this.game.scene.getScene();

        this.createAmbientLight();

        this.createDirectionalLight();

        console.log("Lighting initialisé.");

    }

    createAmbientLight() {

        this.ambientLight = new THREE.AmbientLight(

            0xffffff,

            1.2

        );

        this.scene.add(this.ambientLight);

    }

    createDirectionalLight() {

        this.directionalLight = new THREE.DirectionalLight(

            0xffffff,

            2.0

        );

        this.directionalLight.position.set(

            100,

            150,

            75

        );

        this.directionalLight.castShadow = true;

        this.directionalLight.shadow.mapSize.width = 4096;
        this.directionalLight.shadow.mapSize.height = 4096;

        this.directionalLight.shadow.camera.near = 1;
        this.directionalLight.shadow.camera.far = 500;

        this.directionalLight.shadow.camera.left = -200;
        this.directionalLight.shadow.camera.right = 200;
        this.directionalLight.shadow.camera.top = 200;
        this.directionalLight.shadow.camera.bottom = -200;

        this.scene.add(this.directionalLight);

    }

    update(deltaTime) {

        // Réservé au futur cycle jour/nuit.
    }

    getSun() {

        return this.directionalLight;

    }

    getAmbient() {

        return this.ambientLight;

    }

}