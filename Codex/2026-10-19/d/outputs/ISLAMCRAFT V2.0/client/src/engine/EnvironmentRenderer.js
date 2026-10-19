import * as THREE from "three";

export class EnvironmentRenderer {

    constructor(game) {

        this.game = game;

        this.scene = null;

        this.sky = null;

        this.ground = null;

        this.grid = null;

        this.enabled = true;

    }

    async initialize() {

        this.scene = this.game.scene.getScene();

        this.createGround();

        this.createGrid();

        this.createSky();

        console.log("EnvironmentRenderer initialisé.");

    }

    createGround() {

        const geometry = new THREE.PlaneGeometry(1000, 1000);

        const material = new THREE.MeshStandardMaterial({

            color: 0x6aa84f

        });

        this.ground = new THREE.Mesh(

            geometry,

            material

        );

        this.ground.rotation.x = -Math.PI / 2;

        this.ground.receiveShadow = true;

        this.scene.add(this.ground);

    }

    createGrid() {

        this.grid = new THREE.GridHelper(

            1000,

            100,

            0x666666,

            0x444444

        );

        this.grid.visible = this.game.config.debug.showChunks;

        this.scene.add(this.grid);

    }

    createSky() {

        this.sky = new THREE.Color(

            this.game.config.backgroundColor

        );

        this.scene.background = this.sky;

    }

    update() {

        // Plus tard :
        // - cycle jour / nuit
        // - brouillard dynamique
        // - météo
        // - nuages
        // - ambiance

    }

    setGroundColor(color) {

        this.ground.material.color.set(color);

    }

    setBackground(color) {

        this.scene.background = new THREE.Color(color);

    }

}