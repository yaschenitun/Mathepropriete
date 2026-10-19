import * as THREE from "three";

export class PlayerModel {

    constructor(game) {

        this.game = game;

        this.group = null;

        this.body = null;

        this.head = null;

        this.leftArm = null;

        this.rightArm = null;

        this.leftLeg = null;

        this.rightLeg = null;

    }

    async initialize() {

        this.group = new THREE.Group();

        this.createBody();

        this.createHead();

        this.createArms();

        this.createLegs();

        console.log("PlayerModel initialisé.");

    }

    createBody() {

        const geometry = new THREE.BoxGeometry(

            0.8,

            1.2,

            0.4

        );

        const material = new THREE.MeshStandardMaterial({

            color: 0x3f51b5

        });

        this.body = new THREE.Mesh(

            geometry,

            material

        );

        this.body.position.y = 1.2;

        this.body.castShadow = true;

        this.group.add(this.body);

    }

    createHead() {

        const geometry = new THREE.BoxGeometry(

            0.6,

            0.6,

            0.6

        );

        const material = new THREE.MeshStandardMaterial({

            color: 0xffd5b5

        });

        this.head = new THREE.Mesh(

            geometry,

            material

        );

        this.head.position.y = 2.1;

        this.head.castShadow = true;

        this.group.add(this.head);

    }

    createArms() {

        const geometry = new THREE.BoxGeometry(

            0.2,

            0.9,

            0.2

        );

        const material = new THREE.MeshStandardMaterial({

            color: 0x3f51b5

        });

        this.leftArm = new THREE.Mesh(

            geometry,

            material

        );

        this.rightArm = new THREE.Mesh(

            geometry,

            material

        );

        this.leftArm.position.set(

            -0.55,

            1.25,

            0

        );

        this.rightArm.position.set(

            0.55,

            1.25,

            0

        );

        this.group.add(this.leftArm);

        this.group.add(this.rightArm);

    }

    createLegs() {

        const geometry = new THREE.BoxGeometry(

            0.25,

            1,

            0.25

        );

        const material = new THREE.MeshStandardMaterial({

            color: 0x222222

        });

        this.leftLeg = new THREE.Mesh(

            geometry,

            material

        );

        this.rightLeg = new THREE.Mesh(

            geometry,

            material

        );

        this.leftLeg.position.set(

            -0.2,

            0.4,

            0

        );

        this.rightLeg.position.set(

            0.2,

            0.4,

            0

        );

        this.group.add(this.leftLeg);

        this.group.add(this.rightLeg);

    }

    getMesh() {

        return this.group;

    }

}