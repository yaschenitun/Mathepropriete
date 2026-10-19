import * as THREE from "three";

export class StructureManager {

    constructor(game) {

        this.game = game;

        this.chunkStructures = new Map();

    }

    async initialize() {

        console.log("StructureManager initialisé.");

    }

    generate(chunk) {

        if (!chunk || !chunk.structures) {

            return;

        }

        /*
         * Ne pas générer plusieurs fois
         * les structures du même chunk.
         */

        if (this.chunkStructures.has(chunk.key)) {

            return;

        }

        const structures = [];

        for (const data of chunk.structures) {

            const structure =
                this.createStructure(data);

            if (!structure) {

                continue;

            }

            structures.push(structure);

            /*
             * La structure appartient
             * directement au chunk.
             */

            chunk.add(structure);

        }

        this.chunkStructures.set(

            chunk.key,

            structures

        );

    }

    createStructure(data) {

        if (!data) {

            return null;

        }

        const group =
            new THREE.Group();

        group.name =
            data.id ??
            "structure";

        const baseGeometry =
            new THREE.BoxGeometry(
                4,
                2,
                4
            );

        const baseMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x8d6e63

            });

        const base =
            new THREE.Mesh(
                baseGeometry,
                baseMaterial
            );

        base.position.y = 1;

        base.castShadow = true;

        base.receiveShadow = true;

        group.add(base);

        const roofGeometry =
            new THREE.ConeGeometry(
                3.2,
                2,
                4
            );

        const roofMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x5d4037

            });

        const roof =
            new THREE.Mesh(
                roofGeometry,
                roofMaterial
            );

        roof.position.y = 3;

        roof.rotation.y =
            Math.PI / 4;

        roof.castShadow = true;

        roof.receiveShadow = true;

        group.add(roof);

        if (data.position) {

            group.position.copy(
                data.position
            );

        }

        group.rotation.y =
            Number(data.rotation) || 0;

        group.userData = {

            id: data.id,

            type: data.type,

            biome: data.biome

        };

        return group;

    }

    remove(chunk) {

        if (!chunk) {

            return;

        }

        const structures =
            this.chunkStructures.get(
                chunk.key
            );

        if (!structures) {

            return;

        }

        for (const structure of structures) {

            chunk.remove(structure);

            this.disposeObject(structure);

        }

        this.chunkStructures.delete(
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
         * - portes
         * - destruction
         * - interactions
         * - LOD
         * - streaming avancé
         */

    }

}
