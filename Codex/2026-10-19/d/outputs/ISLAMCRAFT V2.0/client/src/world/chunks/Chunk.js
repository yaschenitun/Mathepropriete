import * as THREE from "three";

export class Chunk {

    constructor(game, chunkX, chunkZ) {

        this.game = game;

        this.chunkX = chunkX;
        this.chunkZ = chunkZ;

        this.key = `${chunkX}:${chunkZ}`;

        this.group = new THREE.Group();

        this.group.name = this.key;

        this.group.matrixAutoUpdate = true;

        this.generated = false;
        this.loaded = false;
        this.visible = false;

        this.biome = null;

        this.terrain = null;

/*
 * Blocs supprimés manuellement par le joueur.
 *
 * La génération du terrain reste intacte.
 * Ces coordonnées permettent de mémoriser
 * les blocs cassés.
 */
this.removedBlocks = new Set();

this.placedBlocks = new Map();

this.entities = [];

        this.objects = [];

        this.structures = [];

        this.meshes = [];

        this.boundingBox = new THREE.Box3();

        this.center = new THREE.Vector3();

        this.size =
            this.game.config.world.chunkSize;

        this.computeWorldPosition();

    }

    computeWorldPosition() {

        const worldX = this.chunkX * this.size;
        const worldZ = this.chunkZ * this.size;

        this.group.position.set(

            worldX,

            0,

            worldZ

        );

        this.center.set(

            worldX + this.size * 0.5,

            0,

            worldZ + this.size * 0.5

        );

    }

    add(object) {

        this.group.add(object);

        this.objects.push(object);

    }

    remove(object) {

        this.group.remove(object);

        this.objects = this.objects.filter(

            o => o !== object

        );

    }

    addEntity(entity) {

        this.entities.push(entity);

    }

    removeEntity(entity) {

        this.entities = this.entities.filter(

            e => e !== entity

        );

    }

    addMesh(mesh) {

        this.meshes.push(mesh);

        this.group.add(mesh);

    }

    getBlockKey(localX, localY, localZ) {

    return `${localX}:${localY}:${localZ}`;

}


isBlockRemoved(localX, localY, localZ) {

    return this.removedBlocks.has(
        this.getBlockKey(
            localX,
            localY,
            localZ
        )
    );

}


getHighestSolidY(localX, localZ) {

    if (
        !Array.isArray(this.terrain)
    ) {

        return -1;

    }


    const rawHeight =
        Number(
            this.terrain[localZ]?.[localX]
        );


    let highestY =
        Number.isFinite(rawHeight)
            ? Math.floor(rawHeight)
            : -1;


    /*
     * Les blocs construits peuvent
     * dépasser la hauteur originale
     * de la colonne.
     */

    for (
        const key of this.placedBlocks.keys()
    ) {

        const parts =
            key.split(":").map(Number);

        if (parts.length !== 3) {

            continue;

        }


        const [
            x,
            y,
            z
        ] = parts;


        if (
            x === localX &&
            z === localZ &&
            y > highestY
        ) {

            highestY = y;

        }

    }


    /*
     * Chercher le bloc réellement
     * le plus haut qui existe encore.
     */

    for (
        let y = highestY;
        y >= 0;
        y--
    ) {

        const key =
            this.getBlockKey(
                localX,
                y,
                localZ
            );


        if (
            this.removedBlocks.has(key)
        ) {

            continue;

        }


        if (
            this.placedBlocks.has(key)
        ) {

            return y;

        }


        if (
            Number.isFinite(rawHeight) &&
            y <= Math.floor(rawHeight)
        ) {

            return y;

        }

    }


    return -1;

}


getBlockType(localX, localY, localZ) {

    if (
        !Number.isInteger(localX) ||
        !Number.isInteger(localY) ||
        !Number.isInteger(localZ)
    ) {

        return null;

    }


    if (
        localX < 0 ||
        localX >= this.size ||
        localZ < 0 ||
        localZ >= this.size ||
        localY < 0
    ) {

        return null;

    }


    const key =
        this.getBlockKey(
            localX,
            localY,
            localZ
        );


    /*
     * Un bloc supprimé n'existe plus.
     */

    if (
        this.removedBlocks.has(key)
    ) {

        return null;

    }


    /*
     * Un bloc construit par le joueur
     * garde exactement son type.
     */

    if (
        this.placedBlocks.has(key)
    ) {

        return this.placedBlocks.get(key);

    }


    const rawHeight =
        Number(
            this.terrain?.[localZ]?.[localX]
        );


    if (
        !Number.isFinite(rawHeight)
    ) {

        return null;

    }


    const topY =
        Math.floor(rawHeight);


    /*
     * Aucun bloc généré au-dessus
     * de la hauteur originale.
     */

    if (
        localY > topY
    ) {

        return null;

    }


    const highestY =
        this.getHighestSolidY(
            localX,
            localZ
        );


    if (
        localY === highestY
    ) {

        return "grass";

    }


    if (
        localY >= highestY - 3
    ) {

        return "dirt";

    }


    return "stone";

}


setPlacedBlock(
    localX,
    localY,
    localZ,
    blockType
) {

    if (
        !Number.isInteger(localX) ||
        !Number.isInteger(localY) ||
        !Number.isInteger(localZ)
    ) {

        return false;

    }


    if (
        localX < 0 ||
        localX >= this.size ||
        localY < 0 ||
        localY >= (
            this.game.config?.world?.worldHeight
            ?? 128
        ) ||
        localZ < 0 ||
        localZ >= this.size
    ) {

        return false;

    }


    const validTypes = [
        "grass",
        "dirt",
        "stone"
    ];


    if (
        !validTypes.includes(blockType)
    ) {

        return false;

    }


    const key =
        this.getBlockKey(
            localX,
            localY,
            localZ
        );


    this.placedBlocks.set(
        key,
        blockType
    );


    /*
     * Si cet emplacement avait été
     * supprimé auparavant, le nouveau
     * bloc le réactive.
     */

    this.removedBlocks.delete(key);


    return true;

}


removeBlock(
    localX,
    localY,
    localZ
) {

    if (
        localX < 0 ||
        localX >= this.size ||
        localY < 0 ||
        localZ < 0 ||
        localZ >= this.size
    ) {

        return false;

    }


    const key =
        this.getBlockKey(
            localX,
            localY,
            localZ
        );


    /*
     * Un bloc construit est retiré
     * de la carte des blocs construits.
     */

    this.placedBlocks.delete(key);


    /*
     * Un bloc généré est mémorisé
     * comme supprimé.
     */

    this.removedBlocks.add(key);


    return true;

}

    setBiome(biome) {

        this.biome = biome;

    }

    markGenerated() {

        this.generated = true;

    }

    markLoaded() {

        this.loaded = true;

    }

    setVisible(value) {

        this.visible = value;

        this.group.visible = value;

    }

    updateBoundingBox() {

        this.boundingBox.setFromObject(

            this.group

        );

    }

    getWorldPosition() {

        return this.group.position;

    }

    destroy() {

    for (const child of this.group.children) {

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

    }

    this.group.clear();

    this.objects.length = 0;

    this.structures.length = 0;

    this.entities.length = 0;

    this.meshes.length = 0;

    this.terrain = null;

    this.biome = null;

    this.generated = false;

    this.loaded = false;

    this.visible = false;

}

}