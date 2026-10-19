import { TreeManager } from "./TreeManager.js";
import { StructureManager } from "./StructureManager.js";
import { ObjectManager } from "./ObjectManager.js";

export class EnvironmentManager {

    constructor(game) {

        this.game = game;

        this.treeManager = null;

        this.structureManager = null;

        this.objectManager = null;

        this.initialized = false;

    }

    async initialize() {

        this.treeManager =
            new TreeManager(this.game);

        await this.treeManager.initialize();

        this.structureManager =
            new StructureManager(this.game);

        await this.structureManager.initialize();

        this.objectManager =
            new ObjectManager(this.game);

        await this.objectManager.initialize();

        this.initialized = true;

        console.log(
            "EnvironmentManager initialisé."
        );

    }

    generateChunk(chunk) {

        if (
            !this.initialized ||
            !chunk
        ) {

            return;

        }

        /*
         * Générer les arbres.
         */

        this.treeManager?.generate(
            chunk
        );

        /*
         * Générer les structures.
         */

        this.structureManager?.generate(
            chunk
        );

        /*
         * Générer les autres objets.
         */

        this.objectManager?.generate(
            chunk
        );

    }

    unloadChunk(chunk) {

        if (!chunk) {

            return;

        }

        /*
         * Nettoyer les arbres.
         */

        this.treeManager?.remove(
            chunk
        );

        /*
         * Nettoyer les structures.
         */

        this.structureManager?.remove(
            chunk
        );

        /*
         * Nettoyer les autres objets.
         */

        this.objectManager?.remove(
            chunk
        );

    }

    update(deltaTime) {

        if (!this.initialized) {

            return;

        }

        this.treeManager?.update(
            deltaTime
        );

        this.structureManager?.update(
            deltaTime
        );

        this.objectManager?.update(
            deltaTime
        );

    }

    destroy() {

        /*
         * Nettoyage général.
         */

        this.treeManager = null;

        this.structureManager = null;

        this.objectManager = null;

        this.initialized = false;

    }

}
