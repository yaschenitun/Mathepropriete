import * as THREE from "three";

export class CollisionController {

    constructor(game) {

        this.game = game;

        /*
         * Taille horizontale approximative
         * du joueur.
         */

        this.playerRadius = 0.25;


        /*
         * Hauteur du joueur.
         *
         * L'origine du modèle est proche
         * du niveau des pieds.
         */

        this.playerHeight = 2.5;


        /*
         * Hauteur maximale qu'un joueur
         * peut monter automatiquement.
         *
         * Un bloc = 1 unité.
         */

        this.maxStepHeight = 1.0;


        /*
         * Gravité.
         */

        this.gravity = 24;


        /*
         * Vitesse verticale.
         */

        this.verticalVelocity = 0;


        /*
         * Tolérance pour rester posé
         * proprement sur le bloc.
         */

        this.groundTolerance = 0.05;

    }


    async initialize() {

        console.log(
            "CollisionController initialisé."
        );

    }


    getChunkManager() {

        return (
            this.game.world?.getChunkManager?.()
            ??
            this.game.worldManager?.getChunkManager?.()
            ??
            this.game.chunkManager
            ??
            null
        );

    }


    getChunkSize() {

        return Number(
            this.game.config?.world?.chunkSize
            ?? 16
        );

    }


    getChunkAt(x, z) {

        const chunkManager =
            this.getChunkManager();

        if (!chunkManager) {
            return null;
        }


        const chunkSize =
            this.getChunkSize();


        const chunkX =
            Math.floor(
                x / chunkSize
            );

        const chunkZ =
            Math.floor(
                z / chunkSize
            );


        return chunkManager.getChunk(
            chunkX,
            chunkZ
        );

    }


    getTerrainHeight(x, z) {

    const chunk =
        this.getChunkAt(
            x,
            z
        );


    if (
        !chunk ||
        !Array.isArray(
            chunk.terrain
        )
    ) {

        return null;

    }


    const chunkSize =
        this.getChunkSize();


    const chunkX =
        Math.floor(
            x / chunkSize
        );


    const chunkZ =
        Math.floor(
            z / chunkSize
        );


    let localX =
        Math.floor(
            x -
            chunkX *
            chunkSize
        );


    let localZ =
        Math.floor(
            z -
            chunkZ *
            chunkSize
        );


    localX =
        Math.max(
            0,
            Math.min(
                chunkSize - 1,
                localX
            )
        );


    localZ =
        Math.max(
            0,
            Math.min(
                chunkSize - 1,
                localZ
            )
        );


    /*
     * Utiliser la vraie carte des blocs.
     *
     * Le bloc le plus haut réellement
     * présent détermine maintenant le sol.
     */

    if (
        typeof chunk.getHighestSolidY ===
        "function"
    ) {

        const highestY =
            chunk.getHighestSolidY(
                localX,
                localZ
            );


        /*
         * Aucun bloc dans cette colonne.
         */

        if (
            highestY < 0
        ) {

            return 0;

        }


        /*
         * Un bloc occupe [y, y + 1].
         * Le joueur doit donc être posé
         * à y + 1.
         */

        return highestY + 1;

    }


    /*
     * Sécurité si la méthode n'existe pas.
     */

    const rawHeight =
        Number(
            chunk.terrain[
                localZ
            ]?.[
                localX
            ]
        );


    if (
        !Number.isFinite(rawHeight)
    ) {

        return null;

    }


    return Math.max(
        1,
        Math.floor(rawHeight) + 1
    );

}


    getGroundHeightAround(x, z) {

        const r =
            this.playerRadius;


        const points = [

            [x, z],

            [x - r, z],

            [x + r, z],

            [x, z - r],

            [x, z + r]

        ];


        let highestGround = null;


        for (
            const [px, pz] of points
        ) {

            const height =
                this.getTerrainHeight(
                    px,
                    pz
                );


            /*
             * Chunk pas encore chargé.
             */

            if (
                height === null
            ) {
                return null;
            }


            if (
                highestGround === null ||
                height > highestGround
            ) {

                highestGround =
                    height;

            }

        }


        return highestGround;

    }


    canStepTo(
        currentPosition,
        targetX,
        targetZ
    ) {

        const currentGround =
            this.getGroundHeightAround(
                currentPosition.x,
                currentPosition.z
            );

        const targetGround =
            this.getGroundHeightAround(
                targetX,
                targetZ
            );


        /*
         * Impossible de calculer :
         * le chunk n'est pas encore chargé.
         */

        if (
            currentGround === null ||
            targetGround === null
        ) {

            return {
                allowed: false,
                unknown: true,
                ground: null
            };

        }


        const difference =
            targetGround -
            currentGround;


        /*
         * Terrain qui monte d'au plus
         * un bloc :
         *
         * le joueur peut monter.
         */

        if (
            difference > 0 &&
            difference <=
            this.maxStepHeight
        ) {

            return {
                allowed: true,
                ground: targetGround,
                stepUp: difference
            };

        }


        /*
         * Terrain qui monte de plus
         * d'un bloc :
         *
         * impossible.
         */

        if (
            difference >
            this.maxStepHeight
        ) {

            return {
                allowed: false,
                unknown: false,
                ground: targetGround,
                stepUp: difference
            };

        }


        /*
         * Terrain plat ou descendant :
         * autorisé.
         */

        return {
            allowed: true,
            ground: targetGround,
            stepUp: 0
        };

    }


    resolveMovement(
        currentPosition,
        movement
    ) {

        if (
            !currentPosition ||
            !movement
        ) {

            return new THREE.Vector3();

        }


        const result =
            new THREE.Vector3();


        /*
         * =========================
         * AXE X
         * =========================
         */

        if (
            Math.abs(movement.x) >
            0.000001
        ) {

            const targetX =
                currentPosition.x +
                movement.x;


            const collision =
                this.canStepTo(
                    currentPosition,
                    targetX,
                    currentPosition.z
                );


            if (
                collision.allowed
            ) {

                result.x =
                    movement.x;

            }

        }


        /*
         * =========================
         * AXE Z
         * =========================
         */

        if (
            Math.abs(movement.z) >
            0.000001
        ) {

            const intermediateX =
                currentPosition.x +
                result.x;


            const targetZ =
                currentPosition.z +
                movement.z;


            const collision =
                this.canStepTo(
                    currentPosition,
                    intermediateX,
                    targetZ
                );


            if (
                collision.allowed
            ) {

                result.z =
                    movement.z;

            }

        }


        /*
         * =========================
         * AJUSTEMENT DE HAUTEUR
         * =========================
         */

        const finalX =
            currentPosition.x +
            result.x;

        const finalZ =
            currentPosition.z +
            result.z;


        const finalGround =
            this.getGroundHeightAround(
                finalX,
                finalZ
            );


        if (
            finalGround !== null
        ) {

            const currentGround =
                this.getGroundHeightAround(
                    currentPosition.x,
                    currentPosition.z
                );


            if (
                currentGround !== null
            ) {

                const difference =
                    finalGround -
                    currentGround;


                /*
                 * Monter un seul bloc :
                 * on remonte le joueur.
                 */

                if (
                    difference > 0 &&
                    difference <=
                    this.maxStepHeight
                ) {

                    result.y +=
                        difference;

                }

            }

        }


        return result;

    }


    applyGravity(
        deltaTime
    ) {

        const player =
            this.game.localPlayer;

        if (!player) {
            return;
        }


        const ground =
            this.getGroundHeightAround(
                player.position.x,
                player.position.z
            );


        /*
         * Chunk inconnu :
         * ne pas faire tomber le joueur
         * dans une zone pas encore chargée.
         */

        if (
            ground === null
        ) {
            return;
        }


        /*
         * Le joueur est au-dessus du sol.
         */

        if (
            player.position.y >
            ground +
            this.groundTolerance
        ) {

            this.verticalVelocity -=
                this.gravity *
                deltaTime;


            let nextY =
                player.position.y +
                this.verticalVelocity *
                deltaTime;


            /*
             * Le joueur touche le sol.
             */

            if (
                nextY <= ground
            ) {

                nextY =
                    ground;

                this.verticalVelocity =
                    0;

            }


            player.setPosition(
                player.position.x,
                nextY,
                player.position.z
            );

        }

        else {

            /*
             * Maintenir exactement
             * le joueur sur le bloc.
             */

            player.setPosition(
                player.position.x,
                ground,
                player.position.z
            );


            this.verticalVelocity =
                0;

        }

    }


    update(deltaTime) {

        this.applyGravity(
            deltaTime
        );

    }


    clear() {

        this.verticalVelocity =
            0;

    }

}