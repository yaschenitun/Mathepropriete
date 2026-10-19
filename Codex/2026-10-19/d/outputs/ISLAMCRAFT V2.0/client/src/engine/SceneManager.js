import * as THREE from "three";

export class SceneManager {

    constructor(game) {

        this.game = game;

        this.scene = null;

        this.camera = null;

        this.clock = new THREE.Clock();

        this.updatables = [];

    }

    async initialize() {

        this.createScene();

        this.createCamera();

        console.log("SceneManager initialisé.");

    }

    createScene() {

        this.scene = new THREE.Scene();

        this.scene.background = new THREE.Color(
            this.game.config.backgroundColor
        );

        this.scene.fog = new THREE.Fog(
            this.game.config.backgroundColor,
            100,
            this.game.config.camera.far
        );

    }

    createCamera() {

        this.camera = new THREE.PerspectiveCamera(

            this.game.config.camera.fov,

            window.innerWidth / window.innerHeight,

            this.game.config.camera.near,

            this.game.config.camera.far

        );

        this.camera.position.set(0, 8, 12);

        this.camera.lookAt(0, 0, 0);

    }

    add(object) {

        if (!object) return;

        this.scene.add(object);

    }

    remove(object) {

        if (!object) return;

        this.scene.remove(object);

    }

    registerUpdatable(system) {

        if (!system) return;

        if (typeof system.update !== "function") return;

        this.updatables.push(system);

    }

    unregisterUpdatable(system) {

        this.updatables = this.updatables.filter(
            item => item !== system
        );

    }

    update(deltaTime) {

        for (const system of this.updatables) {

            system.update(deltaTime);

        }

    }

    getScene() {

        return this.scene;

    }

    getCamera() {

        return this.camera;

    }

}