import * as THREE from "three";

export class GroundDetector {

    constructor(game) {

        this.game = game;

        this.raycaster = new THREE.Raycaster();

        this.rayLength = 1.2;

        this.isGrounded = false;

        this.groundNormal = new THREE.Vector3(0, 1, 0);

        this.groundHeight = 0;

    }

    async initialize() {

        console.log("GroundDetector initialisé.");

    }

    update(player) {

        if (!player || !player.position) {

            return;

        }

        this.raycaster.set(

            player.position.clone().add(new THREE.Vector3(0, 0.5, 0)),

            new THREE.Vector3(0, -1, 0)

        );

        const terrain = this.game.worldManager?.terrainMesh;

        if (!terrain) {

            this.isGrounded = false;

            return;

        }

        const hits = this.raycaster.intersectObject(

            terrain,

            true

        );

        if (hits.length === 0) {

            this.isGrounded = false;

            return;

        }

        const hit = hits[0];

        if (hit.distance <= this.rayLength) {

            this.isGrounded = true;

            this.groundHeight = hit.point.y;

            this.groundNormal.copy(hit.face.normal);

        } else {

            this.isGrounded = false;

        }

    }

    getGroundHeight() {

        return this.groundHeight;

    }

    getGroundNormal() {

        return this.groundNormal;

    }

    grounded() {

        return this.isGrounded;

    }

}