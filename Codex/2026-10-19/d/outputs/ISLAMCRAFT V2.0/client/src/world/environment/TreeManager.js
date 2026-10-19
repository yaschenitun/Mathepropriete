import * as THREE from "three";

export class TreeManager {

    constructor(game) {

        this.game = game;

        this.chunkTrees = new Map();

    }

    async initialize() {

        console.log("TreeManager initialisé.");

    }

    generate(chunk) {

    if (!chunk || !chunk.objects) {

        return;

    }

    const trees = [];

    const chunkWorldX =
        chunk.chunkX * chunk.size;

    const chunkWorldZ =
        chunk.chunkZ * chunk.size;

    for (const object of chunk.objects) {

        if (
            object.type !== "tree" &&
            object.type !== "smallTree"
        ) {

            continue;

        }

        const tree =
            this.createTree(object);

        tree.position.x -= chunkWorldX;

        tree.position.z -= chunkWorldZ;

        trees.push(tree);

        chunk.add(tree);

    }

    this.chunkTrees.set(
        chunk.key,
        trees
    );

}

    createTree(object) {

        const group = new THREE.Group();

        const trunkGeometry = new THREE.CylinderGeometry(

            0.25,
            0.35,
            2,
            8

        );

        const trunkMaterial = new THREE.MeshStandardMaterial({

            color: 0x6d4c41

        });

        const trunk = new THREE.Mesh(

            trunkGeometry,

            trunkMaterial

        );

        trunk.position.y = 1;

        group.add(trunk);

        const leavesGeometry = new THREE.SphereGeometry(

            1.2,

            12,

            12

        );

        const leavesMaterial = new THREE.MeshStandardMaterial({

            color: 0x2e7d32

        });

        const leaves = new THREE.Mesh(

            leavesGeometry,

            leavesMaterial

        );

        leaves.position.y = 2.6;

        group.add(leaves);

        group.position.copy(

            object.position

        );

        group.userData.type = "tree";

        group.userData.id = object.id;

        return group;

    }

    remove(chunk) {

    const trees =
        this.chunkTrees.get(
            chunk.key
        );

    if (!trees) {

        return;

    }

    for (const tree of trees) {

        chunk.remove(tree);

        this.disposeObject(tree);

    }

    this.chunkTrees.delete(
        chunk.key
    );

}

disposeObject(object) {

    object.traverse(child => {

        if (child.geometry) {

            child.geometry.dispose();

        }

        if (child.material) {

            if (Array.isArray(child.material)) {

                child.material.forEach(
                    material => material.dispose()
                );

            }

            else {

                child.material.dispose();

            }

        }

    });

}

    update(deltaTime) {

        // Animations futures :
        // vent
        // saisons
        // destruction
        // croissance

    }

}