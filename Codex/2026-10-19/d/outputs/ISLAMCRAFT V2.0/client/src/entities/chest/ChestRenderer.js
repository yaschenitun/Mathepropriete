import * as THREE from "three";

export class ChestRenderer {

    constructor(game) {

        this.game = game;

        this.materials = {};

    }

    async initialize() {

        this.materials.base = new THREE.MeshStandardMaterial({

            color: 0x8b5a2b

        });

        this.materials.lid = new THREE.MeshStandardMaterial({

            color: 0x6d3f1d

        });

        this.materials.lock = new THREE.MeshStandardMaterial({

            color: 0xffd700

        });

        console.log("ChestRenderer initialisé.");

    }

    createChest() {

        const group = new THREE.Group();

        const base = this.createBase();
        const lid = this.createLid();
        const lock = this.createLock();

        group.add(base);
        group.add(lid);
        group.add(lock);

        group.userData.base = base;
        group.userData.lid = lid;
        group.userData.lock = lock;

        group.castShadow = true;
        group.receiveShadow = true;

        return group;

    }

    createBase() {

        const geometry = new THREE.BoxGeometry(

            1.4,
            0.8,
            1

        );

        const mesh = new THREE.Mesh(

            geometry,

            this.materials.base

        );

        mesh.position.y = 0.4;

        mesh.castShadow = true;

        mesh.receiveShadow = true;

        return mesh;

    }

    createLid() {

        const geometry = new THREE.BoxGeometry(

            1.4,
            0.25,
            1

        );

        const mesh = new THREE.Mesh(

            geometry,

            this.materials.lid

        );

        mesh.position.y = 0.95;

        mesh.castShadow = true;

        mesh.receiveShadow = true;

        return mesh;

    }

    createLock() {

        const geometry = new THREE.BoxGeometry(

            0.15,
            0.2,
            0.05

        );

        const mesh = new THREE.Mesh(

            geometry,

            this.materials.lock

        );

        mesh.position.set(

            0,
            0.75,
            0.53

        );

        mesh.castShadow = true;

        return mesh;

    }

}