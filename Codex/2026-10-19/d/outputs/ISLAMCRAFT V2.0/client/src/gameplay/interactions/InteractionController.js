import * as THREE from "three";


export class InteractionController {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.raycaster =
            new THREE.Raycaster();

        this.maxDistance = 10;

        this.cooldown = 0.25;

        this.cooldownTimer = 0;

        /*
         * Bloc actuellement tenu en main.
         *
         * null = main vide.
         *
         * Exemples :
         * "grass"
         * "dirt"
         * "stone"
         */
        this.heldBlock = null;


/*
 * Inventaire de blocs disponible
 * pour le prototype de construction.
 *
 * Chaque entrée représente un type
 * de bloc que le joueur peut tenir.
 */
this.blockInventory = [
    {
        id: "grass",
        amount: 64
    },
    {
        id: "dirt",
        amount: 64
    },
    {
        id: "stone",
        amount: 64
    }
];

this.selectedBlockIndex = -1;

this.heldBlockMesh = null;

this.blockColors = {
    grass: 0x6ea84a,
    dirt: 0x8b5a2b,
    stone: 0x808080
};

    }


    async initialize() {

    this.createBlockSelectionUI();

    this.installBlockSelectionInput();

    this.installBlockActionInput();

    console.log(
        "InteractionController initialisé."
    );

}

installBlockSelectionInput() {

    window.addEventListener(
        "keydown",
        event => {

            switch (event.code) {

                case "Digit1":

                    this.selectBlock(0);

                    break;


                case "Digit2":

                    this.selectBlock(1);

                    break;


                case "Digit3":

                    this.selectBlock(2);

                    break;


                case "Digit0":

                    this.clearHeldBlock();

                    break;

            }

        }
    );

}
installBlockActionInput() {

    window.addEventListener(
        "pointerdown",
        event => {

            if (!this.enabled) {
                return;
            }

            /*
             * Ne rien faire lorsque la hotbar
             * est touchée.
             */

            if (
    event.target?.closest?.(
        "#islamcraft-block-hotbar"
    ) ||
    event.target?.closest?.(
        "#islamcraft-touch-joystick"
    )
) {

    return;

}

            /*
             * Pour une action de bloc,
             * on utilise LA POSITION RÉELLE
             * du doigt / pointeur.
             *
             * Il n'y a aucune distinction
             * clic gauche / clic droit.
             */

            const success =
                this.useBlockAction(
                    event.clientX,
                    event.clientY
                );

            console.log(
                "[BLOCK] Action pointeur :",
                {
                    x: event.clientX,
                    y: event.clientY,
                    success
                }
            );

        }
    );

}

selectBlock(index) {

    if (
        index < 0 ||
        index >= this.blockInventory.length
    ) {

        return false;

    }


    const slot =
        this.blockInventory[index];


    if (
        !slot ||
        slot.amount <= 0
    ) {

        return false;

    }


    this.selectedBlockIndex =
        index;

    this.heldBlock =
        slot.id;


    this.updateHeldBlockVisual();

    this.updateBlockSelectionUI();


    console.log(
        "Bloc sélectionné :",
        this.heldBlock
    );


    return true;

}
    update(deltaTime) {

        if (!this.enabled) {

            return;

        }


        if (this.cooldownTimer > 0) {

            this.cooldownTimer -=
                deltaTime;

        }


        const inputState =
            this.game.inputState;

        if (!inputState) {

            return;

        }


        /*
         * UNE SEULE ACTION :
         *
         * main vide  -> casser
         * bloc tenu  -> poser
         */

        if (
    inputState.interact &&
    this.cooldownTimer <= 0
) {

    console.log(
        "[BLOCK] Action détectée via inputState.interact"
    );

    const success =
        this.useBlockAction();

    console.log(
        "[BLOCK] Résultat de l'action :",
        success
    );

    if (success) {

        this.cooldownTimer =
            this.cooldown;

    }

    inputState.interact = false;

}

    }

getTargetTreasure(
    screenX,
    screenY
) {

    const camera =
        this.game.scene?.getCamera?.();


    if (!camera) {

        return null;

    }


    const treasures =
        this.game.treasures;


    if (
        !treasures ||
        treasures.size === 0
    ) {

        return null;

    }


    const canvas =
        document.querySelector(
            "canvas"
        );


    if (!canvas) {

        return null;

    }


    const rect =
        canvas.getBoundingClientRect();


    const ndcX =
        (
            (screenX - rect.left) /
            rect.width
        ) * 2 - 1;


    const ndcY =
        -(
            (screenY - rect.top) /
            rect.height
        ) * 2 + 1;


    this.raycaster.setFromCamera(
        new THREE.Vector2(
            ndcX,
            ndcY
        ),
        camera
    );


    const treasureMeshes = [];


    for (
        const treasure of treasures.values()
    ) {

        if (
            !treasure ||
            treasure.collected ||
            !treasure.mesh
        ) {

            continue;

        }


        treasure.mesh.traverse(
            object => {

                if (
                    object.isMesh
                ) {

                    treasureMeshes.push(
                        object
                    );

                }

            }
        );

    }


    if (
        treasureMeshes.length === 0
    ) {

        return null;

    }


    const hits =
        this.raycaster.intersectObjects(
            treasureMeshes,
            false
        );


    if (
        hits.length === 0
    ) {

        return null;

    }


    const hit =
        hits[0];


    let object =
        hit.object;


    while (
        object &&
        !object.userData?.treasureId
    ) {

        object =
            object.parent;

    }


    if (
        !object?.userData?.treasureId
    ) {

        return null;

    }


    const treasure =
        treasures.get(
            `treasure_${object.userData.treasureId}`
        );


    if (!treasure) {

        /*
         * Recherche de secours.
         */

        for (
            const candidate of treasures.values()
        ) {

            if (
                candidate.id ===
                `treasure_${object.userData.treasureId}`
            ) {

                return candidate;

            }

        }

        return null;

    }


    return treasure;

}
    useBlockAction(
    screenX = null,
    screenY = null
) {

    /*
 * ==================================================
 * TRÉSOR
 * ==================================================
 *
 * Si le joueur touche un trésor,
 * on récupère le trésor avant de
 * tenter une action sur un bloc.
 */

if (
    Number.isFinite(screenX) &&
    Number.isFinite(screenY)
) {

    const treasure =
        this.getTargetTreasure(
            screenX,
            screenY
        );


    if (treasure) {

        const collected =
            this.game.collectTreasure?.(
                treasure
            );


        console.log(
            "[TREASURE] Action :",
            collected
        );


        return Boolean(
            collected
        );

    }

}
    const target =
        this.getTargetBlock(
            screenX,
            screenY
        );

    if (!target) {

        console.log(
            "[BLOCK] Aucun bloc détecté à cette position."
        );

        return false;

    }

    /*
     * MAIN VIDE
     * =========
     *
     * Toucher un bloc sans bloc tenu
     * = casser.
     */

    if (!this.heldBlock) {

        return this.breakBlock(
            target
        );

    }

    /*
     * BLOC EN MAIN
     * =============
     *
     * Toucher un bloc avec un bloc tenu
     * = poser au-dessus de la colonne.
     */

    return this.placeBlock(
        target
    );

}


    getTargetBlock(
    screenX = null,
    screenY = null
) {

    const camera =
        this.game.scene?.getCamera?.();

    if (!camera) {

        console.warn(
            "[BLOCK] Caméra introuvable."
        );

        return null;

    }


    const chunkManager =
        this.game.world
            ?.getChunkManager?.();

    if (!chunkManager) {

        console.warn(
            "[BLOCK] ChunkManager introuvable."
        );

        return null;

    }


    const chunks =
        chunkManager.getLoadedChunks?.();

    if (!chunks) {

        console.warn(
            "[BLOCK] Aucun chunk chargé."
        );

        return null;

    }


    const chunkList =
        chunks instanceof Map
            ? [...chunks.values()]
            : chunks;


    if (
        chunkList.length === 0
    ) {

        console.warn(
            "[BLOCK] Liste de chunks vide."
        );

        return null;

    }


    /*
     * ==================================================
     * CONSTRUCTION DU RAYON
     * ==================================================
     *
     * Si screenX/screenY existent :
     *     rayon depuis l'endroit réellement touché.
     *
     * Sinon :
     *     rayon depuis le centre de l'écran.
     *
     * Le centre est conservé pour les actions
     * clavier comme E.
     */

    let origin =
        camera.getWorldPosition(
            new THREE.Vector3()
        );

    let direction;


    if (
        Number.isFinite(screenX) &&
        Number.isFinite(screenY)
    ) {

        /*
         * Chercher l'élément canvas WebGL.
         */

        const canvas =
            camera
                .parent
                ?.userData
                ?.renderer
                ?.domElement ??
            document.querySelector(
                "canvas"
            );


        if (canvas) {

            const rect =
                canvas.getBoundingClientRect();


            /*
             * Coordonnées normalisées
             * de Three.js :
             *
             * gauche = -1
             * droite = +1
             * haut = +1
             * bas = -1
             */

            const ndcX =
                (
                    (screenX - rect.left) /
                    rect.width
                ) * 2 - 1;


            const ndcY =
                -(
                    (screenY - rect.top) /
                    rect.height
                ) * 2 + 1;


            this.raycaster.setFromCamera(
                new THREE.Vector2(
                    ndcX,
                    ndcY
                ),
                camera
            );


            origin =
                this.raycaster.ray.origin.clone();


            direction =
                this.raycaster.ray.direction
                    .clone()
                    .normalize();

        }
        else {

            console.warn(
                "[BLOCK] Canvas WebGL introuvable."
            );

            direction =
                camera.getWorldDirection(
                    new THREE.Vector3()
                ).normalize();

        }

    }
    else {

        direction =
            camera.getWorldDirection(
                new THREE.Vector3()
            ).normalize();

    }


    /*
     * ==================================================
     * RAYCAST VOXEL
     * ==================================================
     *
     * On ne dépend PAS du raycast Three.js
     * sur les InstancedMesh.
     *
     * On teste directement les colonnes utilisées
     * par ChunkRenderer.
     */

    const step =
        0.025;


    for (
        let distance = 0;
        distance <= this.maxDistance;
        distance += step
    ) {

        const point =
            origin
                .clone()
                .add(
                    direction
                        .clone()
                        .multiplyScalar(
                            distance
                        )
                );


        /*
         * Tester le chunk correspondant
         * à la position du rayon.
         */

        for (
            const chunk of chunkList
        ) {

            if (
                !chunk ||
                !Array.isArray(
                    chunk.terrain
                )
            ) {

                continue;

            }


            const size =
                chunk.size;


            const worldMinX =
                chunk.chunkX * size;


            const worldMaxX =
                worldMinX + size;


            const worldMinZ =
                chunk.chunkZ * size;


            const worldMaxZ =
                worldMinZ + size;


            if (
                point.x < worldMinX ||
                point.x >= worldMaxX ||
                point.z < worldMinZ ||
                point.z >= worldMaxZ
            ) {

                continue;

            }


            const localX =
                Math.floor(
                    point.x - worldMinX
                );


            const localZ =
                Math.floor(
                    point.z - worldMinZ
                );


            if (
                localX < 0 ||
                localX >= size ||
                localZ < 0 ||
                localZ >= size
            ) {

                continue;

            }


            const rawHeight =
                Number(
                    chunk
                        .terrain[
                            localZ
                        ]?.[
                            localX
                        ]
                );


            if (
                !Number.isFinite(
                    rawHeight
                )
            ) {

                continue;

            }


            /*
             * ChunkRenderer utilise exactement
             * cette formule :
             *
             * height =
             * max(
             *     1,
             *     floor(rawHeight) + 1
             * )
             */

            const localY =
    Math.floor(
        point.y
    );


if (
    localY < 0
) {

    continue;

}


const blockType =
    chunk.getBlockType(
        localX,
        localY,
        localZ
    );


if (!blockType) {

    continue;

}


/*
 * Le rayon vient réellement
 * de toucher un bloc.
 */

const absX =
    Math.abs(direction.x);

const absY =
    Math.abs(direction.y);

const absZ =
    Math.abs(direction.z);


let faceNormal;


if (
    absX >= absY &&
    absX >= absZ
) {

    faceNormal =
        new THREE.Vector3(
            direction.x > 0
                ? -1
                : 1,
            0,
            0
        );

}
else if (
    absY >= absX &&
    absY >= absZ
) {

    faceNormal =
        new THREE.Vector3(
            0,
            direction.y > 0
                ? -1
                : 1,
            0
        );

}
else {

    faceNormal =
        new THREE.Vector3(
            0,
            0,
            direction.z > 0
                ? -1
                : 1
        );

}


console.log(
    "[BLOCK] ✅ BLOC DÉTECTÉ",
    {
        chunk: chunk.key,
        localX,
        localY,
        localZ,
        blockType,
        faceNormal:
            faceNormal.toArray(),
        distance
    }
);


return {

    chunk,

    chunkKey:
        chunk.key,

    localX,

    localY,

    localZ,

    blockType,

    faceNormal,

    point:
        point.clone(),

    distance

};

        }

    }


    console.log(
        "[BLOCK] Aucun bloc détecté.",
        {
            origin:
                origin.toArray(),

            direction:
                direction.toArray(),

            maxDistance:
                this.maxDistance
        }
    );


    return null;

}


breakBlock(target) {

    if (!target) {

        return false;

    }


    const chunk =
        target.chunk;


    if (!chunk) {

        return false;

    }


    const x =
        target.localX;

    const y =
        target.localY;

    const z =
        target.localZ;


    const blockType =
        chunk.getBlockType(
            x,
            y,
            z
        );


    if (!blockType) {

        console.warn(
            "[BLOCK] Aucun bloc réel à casser."
        );

        return false;

    }


    const removed =
        chunk.removeBlock(
            x,
            y,
            z
        );


    if (!removed) {

        console.warn(
            "[BLOCK] Échec de removeBlock()."
        );

        return false;

    }


    /*
     * Le joueur récupère le type
     * du bloc réellement cassé.
     */

    const inventorySlot =
        this.blockInventory.find(
            slot =>
                slot.id === blockType
        );


    if (inventorySlot) {

        inventorySlot.amount += 1;

    }


    /*
     * Recréer immédiatement le rendu.
     */

    const rebuilt =
        this.rebuildChunk(
            chunk
        );


    if (!rebuilt) {

        console.error(
            "[BLOCK] Le rendu n'a pas pu être reconstruit."
        );

        return false;

    }


    console.log(
        "[BLOCK] ✅ BLOC CASSÉ",
        {
            chunk:
                target.chunkKey,

            x,
            y,
            z,

            blockType
        }
    );


    return true;

}


    placeBlock(target) {

    if (!this.heldBlock) {

        return false;

    }


    if (!target?.faceNormal) {

        return false;

    }


    const normal =
        target.faceNormal;


    const targetWorldX =
        target.chunk.chunkX *
        target.chunk.size +
        target.localX;


    const targetWorldY =
        target.localY;


    const targetWorldZ =
        target.chunk.chunkZ *
        target.chunk.size +
        target.localZ;


    /*
     * Nouvelle position :
     * exactement sur la face touchée.
     */

    const worldX =
        targetWorldX +
        Math.round(normal.x);


    const worldY =
        targetWorldY +
        Math.round(normal.y);


    const worldZ =
        targetWorldZ +
        Math.round(normal.z);


    if (
        worldY < 0
    ) {

        return false;

    }


    const chunkSize =
        target.chunk.size;


    const chunkX =
        Math.floor(
            worldX /
            chunkSize
        );


    const chunkZ =
        Math.floor(
            worldZ /
            chunkSize
        );


    const localX =
        worldX -
        chunkX *
        chunkSize;


    const localZ =
        worldZ -
        chunkZ *
        chunkSize;


    const chunkManager =
        this.game.world
            ?.getChunkManager?.();


    if (!chunkManager) {

        return false;

    }


    const targetChunk =
        chunkManager.getChunk(
            chunkX,
            chunkZ
        ) ??
        chunkManager.chunks?.get?.(
            `${chunkX}:${chunkZ}`
        );


    if (!targetChunk) {

        console.warn(
            "[BLOCK] Chunk cible introuvable :",
            `${chunkX}:${chunkZ}`
        );

        return false;

    }


    /*
     * La position doit être vide.
     */

    if (
        targetChunk.getBlockType(
            localX,
            worldY,
            localZ
        )
    ) {

        console.warn(
            "[BLOCK] Impossible de placer : emplacement occupé."
        );

        return false;

    }


    /*
     * Placer exactement le type
     * sélectionné dans la hotbar.
     */

    const placed =
        targetChunk.setPlacedBlock(
            localX,
            worldY,
            localZ,
            this.heldBlock
        );


    if (!placed) {

        console.warn(
            "[BLOCK] Échec de setPlacedBlock()."
        );

        return false;

    }


    const blockType =
        this.heldBlock;


    /*
     * Reconstruire le chunk concerné.
     */

    const rebuilt =
        this.rebuildChunk(
            targetChunk
        );


    if (!rebuilt) {

        return false;

    }


    /*
     * Retirer un bloc de l'inventaire
     * seulement après une construction réussie.
     */

    if (
        this.selectedBlockIndex >= 0
    ) {

        const slot =
            this.blockInventory[
                this.selectedBlockIndex
            ];


        slot.amount =
            Math.max(
                0,
                slot.amount - 1
            );


        if (
            slot.amount <= 0
        ) {

            this.clearHeldBlock();

        }

    }


    console.log(
        "[BLOCK] ✅ BLOC POSÉ",
        {
            blockType,
            worldX,
            worldY,
            worldZ,
            chunk:
                targetChunk.key,
            face:
                normal.toArray()
        }
    );


    return true;

}


rebuildChunk(chunk) {

    const renderer =
        this.game.world
            ?.getChunkManager?.()
            ?.loader
            ?.renderer;


    if (!renderer) {

        console.error(
            "[BLOCK] ChunkRenderer introuvable."
        );

        return false;

    }


    if (
        typeof renderer.rebuild !==
        "function"
    ) {

        console.error(
            "[BLOCK] ChunkRenderer.rebuild() introuvable."
        );

        return false;

    }


    renderer.rebuild(
        chunk
    );


    console.log(
        "[BLOCK] Rendu du chunk reconstruit :",
        chunk.key
    );


    return true;

}


    setHeldBlock(block) {

    if (
        block === null ||
        block === undefined
    ) {

        this.clearHeldBlock();

        return;

    }


    const index =
        this.blockInventory.findIndex(
            slot =>
                slot.id === String(block) &&
                slot.amount > 0
        );


    if (index === -1) {

        return false;

    }


    this.selectedBlockIndex =
        index;

    this.heldBlock =
        this.blockInventory[index].id;


    this.updateHeldBlockVisual();

    this.updateBlockSelectionUI();


    return true;

}


   clearHeldBlock() {

    this.heldBlock = null;

    this.selectedBlockIndex = -1;

    this.removeHeldBlockVisual();

    this.updateBlockSelectionUI();

}

    updateHeldBlockVisual() {

    const player =
        this.game.localPlayer;

    const rightArm =
        player
            ?.model
            ?.rightArm;


    if (!rightArm) {

        return;

    }


    this.removeHeldBlockVisual();


    if (!this.heldBlock) {

        return;

    }


    const geometry =
        new THREE.BoxGeometry(
            0.38,
            0.38,
            0.38
        );


    const material =
        new THREE.MeshStandardMaterial({

            color:
                this.blockColors[
                    this.heldBlock
                ] ??
                0xffffff

        });


    const blockMesh =
        new THREE.Mesh(
            geometry,
            material
        );


    /*
     * Le bloc est placé devant
     * la main droite.
     */

    blockMesh.position.set(
        0,
        -0.48,
        0.18
    );


    blockMesh.rotation.set(
        0,
        0,
        0
    );


    blockMesh.castShadow = true;

    blockMesh.receiveShadow = true;


    blockMesh.userData.isHeldBlock =
        true;


    rightArm.add(
        blockMesh
    );


    this.heldBlockMesh =
        blockMesh;

}

removeHeldBlockVisual() {

    if (
        !this.heldBlockMesh
    ) {

        return;

    }


    const mesh =
        this.heldBlockMesh;


    mesh.parent?.remove(
        mesh
    );


    mesh.geometry?.dispose();


    if (mesh.material) {

        mesh.material.dispose();

    }


    this.heldBlockMesh = null;

}

createBlockSelectionUI() {

    if (
        document.getElementById(
            "islamcraft-block-hotbar"
        )
    ) {

        return;

    }


    const hotbar =
        document.createElement(
            "div"
        );


    hotbar.id =
        "islamcraft-block-hotbar";


    hotbar.style.position =
        "fixed";

    hotbar.style.left =
        "50%";

    hotbar.style.bottom =
        "20px";

    hotbar.style.transform =
        "translateX(-50%)";

    hotbar.style.display =
        "flex";

    hotbar.style.gap =
        "6px";

    hotbar.style.zIndex =
        "1000";


    const names = [
        "grass",
        "dirt",
        "stone"
    ];


    names.forEach(
        (name, index) => {

            const slot =
                document.createElement(
                    "div"
                );


            slot.dataset.index =
                String(index);


            slot.style.width =
                "52px";

            slot.style.height =
                "52px";

            slot.style.border =
                "3px solid white";

            slot.style.background =
                "rgba(0,0,0,0.65)";

            slot.style.color =
                "white";

            slot.style.display =
                "flex";

            slot.style.alignItems =
                "center";

            slot.style.justifyContent =
                "center";

            slot.style.fontFamily =
                "Arial";

            slot.style.fontWeight =
                "bold";

            slot.style.userSelect =
                "none";


            slot.textContent =
                `${index + 1}`;


            slot.title =
                name;


            slot.addEventListener(
                "click",
                () => {

                    this.selectBlock(
                        index
                    );

                }
            );


            hotbar.appendChild(
                slot
            );

        }
    );


    const emptySlot =
        document.createElement(
            "div"
        );


    emptySlot.dataset.index =
        "-1";


    emptySlot.style.width =
        "52px";

    emptySlot.style.height =
        "52px";

    emptySlot.style.border =
        "3px solid white";

    emptySlot.style.background =
        "rgba(0,0,0,0.65)";

    emptySlot.style.color =
        "white";

    emptySlot.style.display =
        "flex";

    emptySlot.style.alignItems =
        "center";

    emptySlot.style.justifyContent =
        "center";

    emptySlot.textContent =
        "0";


    emptySlot.addEventListener(
        "click",
        () => {

            this.clearHeldBlock();

        }
    );


    hotbar.appendChild(
        emptySlot
    );


    document.body.appendChild(
        hotbar
    );


    this.updateBlockSelectionUI();

}

updateBlockSelectionUI() {

    const hotbar =
        document.getElementById(
            "islamcraft-block-hotbar"
        );


    if (!hotbar) {

        return;

    }


    const slots =
        hotbar.children;


    for (
        let i = 0;
        i < slots.length;
        i++
    ) {

        const selected =
            this.selectedBlockIndex === i;


        slots[i].style.outline =
            selected
                ? "4px solid yellow"
                : "none";

    }


    /*
     * Le dernier slot correspond
     * à la main vide.
     */

    if (
        slots.length > 3
    ) {

        slots[3].style.outline =
            this.selectedBlockIndex === -1
                ? "4px solid yellow"
                : "none";

    }

}


    getHeldBlock() {

        return this.heldBlock;

    }


    setEnabled(enabled) {

        this.enabled =
            Boolean(enabled);

    }


    isEnabled() {

        return this.enabled;

    }

}