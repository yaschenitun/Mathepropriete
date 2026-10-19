import * as THREE from "three";

export class ChunkRenderer {

    createTerrainMesh(chunk) {

    if (
        !chunk ||
        !chunk.terrain ||
        chunk.terrain.length === 0
    ) {

        return null;

    }


    const size =
        chunk.size;


    let grassCount = 0;
    let dirtCount = 0;
    let stoneCount = 0;


    /*
     * Trouver la hauteur maximale
     * nécessaire, y compris les blocs
     * construits par le joueur.
     */

    let maxY = 0;


    for (
        let localZ = 0;
        localZ < size;
        localZ++
    ) {

        for (
            let localX = 0;
            localX < size;
            localX++
        ) {

            const rawHeight =
                Number(
                    chunk.terrain[localZ]?.[localX]
                );


            if (
                Number.isFinite(rawHeight)
            ) {

                maxY =
                    Math.max(
                        maxY,
                        Math.floor(rawHeight)
                    );

            }

        }

    }


    /*
     * Les blocs placés peuvent être
     * plus hauts que le terrain original.
     */

    for (
        const key of chunk.placedBlocks.keys()
    ) {

        const parts =
            key.split(":").map(Number);


        if (
            parts.length !== 3
        ) {

            continue;

        }


        maxY =
            Math.max(
                maxY,
                parts[1]
            );

    }


    /*
     * Première passe :
     * compter chaque type de bloc.
     */

    for (
        let localZ = 0;
        localZ < size;
        localZ++
    ) {

        for (
            let localX = 0;
            localX < size;
            localX++
        ) {

            for (
                let y = 0;
                y <= maxY;
                y++
            ) {

                const blockType =
                    chunk.getBlockType(
                        localX,
                        y,
                        localZ
                    );


                if (
                    blockType === "grass"
                ) {

                    grassCount++;

                }
                else if (
                    blockType === "dirt"
                ) {

                    dirtCount++;

                }
                else if (
                    blockType === "stone"
                ) {

                    stoneCount++;

                }

            }

        }

    }


    const group =
        new THREE.Group();


    group.name =
        `terrain_${chunk.key}`;


    const blockGeometry =
        new THREE.BoxGeometry(
            1,
            1,
            1
        );


    const grassMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x6ea84a,
            roughness: 1,
            metalness: 0
        });


    const dirtMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x8d6e63,
            roughness: 1,
            metalness: 0
        });


    const stoneMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x777777,
            roughness: 1,
            metalness: 0
        });


    const grassMesh =
        new THREE.InstancedMesh(
            blockGeometry,
            grassMaterial,
            Math.max(1, grassCount)
        );


    const dirtMesh =
        new THREE.InstancedMesh(
            blockGeometry,
            dirtMaterial,
            Math.max(1, dirtCount)
        );


    const stoneMesh =
        new THREE.InstancedMesh(
            blockGeometry,
            stoneMaterial,
            Math.max(1, stoneCount)
        );


    grassMesh.castShadow = true;
    grassMesh.receiveShadow = true;

    dirtMesh.castShadow = true;
    dirtMesh.receiveShadow = true;

    stoneMesh.castShadow = true;
    stoneMesh.receiveShadow = true;


    const matrix =
        new THREE.Matrix4();


    let grassIndex = 0;
    let dirtIndex = 0;
    let stoneIndex = 0;


    /*
     * Deuxième passe :
     * placer chaque bloc selon
     * son véritable type.
     */

    for (
        let localZ = 0;
        localZ < size;
        localZ++
    ) {

        for (
            let localX = 0;
            localX < size;
            localX++
        ) {

            for (
                let y = 0;
                y <= maxY;
                y++
            ) {

                const blockType =
                    chunk.getBlockType(
                        localX,
                        y,
                        localZ
                    );


                if (!blockType) {

                    continue;

                }


                matrix.makeTranslation(
                    localX + 0.5,
                    y + 0.5,
                    localZ + 0.5
                );


                if (
                    blockType === "grass"
                ) {

                    grassMesh.setMatrixAt(
                        grassIndex,
                        matrix
                    );

                    grassIndex++;

                }
                else if (
                    blockType === "dirt"
                ) {

                    dirtMesh.setMatrixAt(
                        dirtIndex,
                        matrix
                    );

                    dirtIndex++;

                }
                else if (
                    blockType === "stone"
                ) {

                    stoneMesh.setMatrixAt(
                        stoneIndex,
                        matrix
                    );

                    stoneIndex++;

                }

            }

        }

    }


    grassMesh.count =
        grassIndex;

    dirtMesh.count =
        dirtIndex;

    stoneMesh.count =
        stoneIndex;


    grassMesh.instanceMatrix.needsUpdate =
        true;

    dirtMesh.instanceMatrix.needsUpdate =
        true;

    stoneMesh.instanceMatrix.needsUpdate =
        true;


    grassMesh.userData = {
        type: "blockMesh",
        blockType: "grass",
        chunkKey: chunk.key
    };


    dirtMesh.userData = {
        type: "blockMesh",
        blockType: "dirt",
        chunkKey: chunk.key
    };


    stoneMesh.userData = {
        type: "blockMesh",
        blockType: "stone",
        chunkKey: chunk.key
    };


    if (grassIndex > 0) {

        group.add(
            grassMesh
        );

    }


    if (dirtIndex > 0) {

        group.add(
            dirtMesh
        );

    }


    if (stoneIndex > 0) {

        group.add(
            stoneMesh
        );

    }


    group.userData = {
        type: "voxelTerrain",
        chunkKey: chunk.key,
        size
    };


    return group;

}

getBiomeColor(biome) {

    switch (biome) {

        case "desert":

            return 0xd9c27a;

        case "forest":

            return 0x3f8c3a;

        case "plains":

            return 0x6ea84a;

        default:

            return 0x6ea84a;

    }

}

    constructor(game) {

        this.game = game;

        this.scene = null;

        this.renderedChunks = new Map();

    }

    async initialize() {

        this.scene =
            this.game.scene.getScene();

        console.log(
            "ChunkRenderer initialisé."
        );

    }

    render(chunk) {

    if (!chunk) {

        return;

    }

    if (
        this.renderedChunks.has(
            chunk.key
        )
    ) {

        return;

    }

    if (
        chunk.terrain &&
        chunk.meshes.length === 0
    ) {

        const terrainMesh =
            this.createTerrainMesh(
                chunk
            );

        if (terrainMesh) {

            chunk.addMesh(
                terrainMesh
            );

        }

    }

    this.scene.add(
        chunk.group
    );

    chunk.setVisible(true);

    chunk.markLoaded();

    this.renderedChunks.set(
        chunk.key,
        chunk
    );

}
rebuild(chunk) {

    if (!chunk) {

        return;

    }


    /*
     * Supprimer l'ancien mesh du terrain.
     */

    for (
        const mesh of chunk.meshes
    ) {

        chunk.group.remove(mesh);


        mesh.traverse?.(
            object => {

                if (object.geometry) {

                    object.geometry.dispose();

                }


                if (object.material) {

                    if (
                        Array.isArray(
                            object.material
                        )
                    ) {

                        object.material.forEach(
                            material => {

                                material.dispose();

                            }
                        );

                    }
                    else {

                        object.material.dispose();

                    }

                }

            }
        );

    }


    chunk.meshes.length = 0;


    /*
     * Recréer le terrain avec les
     * blocs actuellement présents.
     */

    const terrainMesh =
        this.createTerrainMesh(
            chunk
        );


    if (terrainMesh) {

        chunk.addMesh(
            terrainMesh
        );

    }

}

    hide(chunk) {

        if (!chunk) {
            return;
        }

        chunk.setVisible(false);

    }

    show(chunk) {

        if (!chunk) {
            return;
        }

        chunk.setVisible(true);

    }

    remove(chunk) {

        if (!chunk) {
            return;
        }

        if (
            !this.renderedChunks.has(
                chunk.key
            )
        ) {
            return;
        }

        this.scene.remove(
            chunk.group
        );

        this.renderedChunks.delete(
            chunk.key
        );

    }

    isRendered(chunk) {

        return this.renderedChunks.has(
            chunk.key
        );

    }

    clear() {

        if (!this.scene) {
            return;
        }

        for (
            const chunk of
            this.renderedChunks.values()
        ) {

            this.scene.remove(
                chunk.group
            );

        }

        this.renderedChunks.clear();

    }

    update() {

        // Réservé aux futures optimisations :
        // - GPU Culling
        // - Occlusion Culling
        // - Distance Rendering
        // - Instancing dynamique

    }

    destroy() {

        this.clear();

        this.scene = null;

        this.game = null;

    }

}

