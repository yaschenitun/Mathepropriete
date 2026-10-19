import * as THREE from "three";

export class ObjectManager {

    constructor(game) {

        this.game = game;

        this.chunkObjects = new Map();

    }

    async initialize() {

        console.log("ObjectManager initialisé.");

    }

    generate(chunk) {

        if (!chunk || !chunk.objects) {

            return;

        }

        /*
         * Éviter de générer deux fois
         * les objets du même chunk.
         */

        if (this.chunkObjects.has(chunk.key)) {

            return;

        }

        const objects = [];

        for (const object of chunk.objects) {

            if (
                object.type === "tree" ||
                object.type === "smallTree"
            ) {

                continue;

            }

            const mesh =
                this.createObject(object);

            if (!mesh) {

                continue;

            }

            objects.push(mesh);

            /*
             * Le mesh appartient maintenant
             * directement au chunk.
             */

            chunk.add(mesh);

        }

        this.chunkObjects.set(

            chunk.key,

            objects

        );

    }

    createObject(object) {

        if (!object) {

            return null;

        }

        let geometry;

        let material;

        switch (object.type) {

            case "rock":

                geometry =
                    new THREE.DodecahedronGeometry(
                        0.7,
                        0
                    );

                material =
                    new THREE.MeshStandardMaterial({

                        color: 0x7a7a7a

                    });

                break;

            case "bush":

                geometry =
                    new THREE.SphereGeometry(
                        0.6,
                        10,
                        10
                    );

                material =
                    new THREE.MeshStandardMaterial({

                        color: 0x3e8d35

                    });

                break;

            case "cactus":

                geometry =
                    new THREE.CylinderGeometry(
                        0.25,
                        0.3,
                        2,
                        8
                    );

                material =
                    new THREE.MeshStandardMaterial({

                        color: 0x2d8a43

                    });

                break;

            default:

                geometry =
                    new THREE.BoxGeometry(
                        0.6,
                        0.6,
                        0.6
                    );

                material =
                    new THREE.MeshStandardMaterial({

                        color: 0xffffff

                    });

                break;

        }

        const mesh =
            new THREE.Mesh(
                geometry,
                material
            );

        mesh.position.copy(
            object.position
        );

        mesh.userData = {

            id: object.id,

            type: object.type,

            biome: object.biome

        };

        mesh.castShadow = true;

        mesh.receiveShadow = true;

        return mesh;

    }

    remove(chunk) {

        if (!chunk) {

            return;

        }

        const objects =
            this.chunkObjects.get(
                chunk.key
            );

        if (!objects) {

            return;

        }

        for (const object of objects) {

            chunk.remove(object);

            this.disposeObject(object);

        }

        this.chunkObjects.delete(
            chunk.key
        );

    }

    disposeObject(object) {

        if (!object) {

            return;

        }

        object.traverse(child => {

            if (child.geometry) {

                child.geometry.dispose();

            }

            if (child.material) {

                if (Array.isArray(child.material)) {

                    child.material.forEach(
                        material => {

                            material.dispose();

                        }
                    );

                }

                else {

                    child.material.dispose();

                }

            }

        });

    }

    update(deltaTime) {

        /*
         * Futures améliorations :
         *
         * - animations
         * - rotation
         * - physique
         * - effets
         * - instancing
         * - LOD
         */

    }

}
