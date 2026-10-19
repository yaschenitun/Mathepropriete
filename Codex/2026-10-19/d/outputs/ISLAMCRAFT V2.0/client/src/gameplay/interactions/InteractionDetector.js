export class InteractionDetector {

    constructor(game) {

        this.game = game;

        this.interactionRadius = 3;

        this.interactiveObjects = [];

    }

    async initialize() {

        console.log("InteractionDetector initialisé.");

    }

    register(object) {

        if (!object) {

            return;

        }

        if (!this.interactiveObjects.includes(object)) {

            this.interactiveObjects.push(object);

        }

    }

    unregister(object) {

        this.interactiveObjects = this.interactiveObjects.filter(

            entry => entry !== object

        );

    }

    findNearest(playerPosition) {

        let nearestObject = null;

        let nearestDistance = Infinity;

        for (const object of this.interactiveObjects) {

            if (!object.enabled || !object.canInteract) {

                continue;

            }

            const distance = playerPosition.distanceTo(

                object.position

            );

            if (

                distance <= this.interactionRadius &&

                distance < nearestDistance

            ) {

                nearestDistance = distance;

                nearestObject = object;

            }

        }

        return nearestObject;

    }

    clear() {

        this.interactiveObjects.length = 0;

    }

    update(deltaTime) {

        // Réservé aux futures optimisations :
        // - Spatial Hash
        // - QuadTree
        // - Chunk Culling
        // - Détection par secteur
        // - Priorité des interactions

    }

}