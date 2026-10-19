export class InteractiveEnvironment {

    constructor(game) {

        this.game = game;

        this.interactives = new Map();

    }

    async initialize() {

        console.log(
            "InteractiveEnvironment initialisé."
        );

    }

    register(object) {

        if (!object) {

            return null;

        }

        const id =
            object.userData?.id ??
            crypto.randomUUID();

        /*
         * Enregistrer l'identifiant
         * directement sur l'objet.
         */

        if (!object.userData) {

            object.userData = {};

        }

        object.userData.id = id;

        this.interactives.set(
            id,
            object
        );

        return id;

    }

    unregister(id) {

        if (!id) {

            return false;

        }

        return this.interactives.delete(
            id
        );

    }

    get(id) {

        if (!id) {

            return null;

        }

        return this.interactives.get(
            id
        ) ?? null;

    }

    getNearby(position, radius = 3) {

        if (!position) {

            return [];

        }

        const numericRadius =
            Number(radius);

        if (
            !Number.isFinite(
                numericRadius
            ) ||
            numericRadius < 0
        ) {

            return [];

        }

        const results = [];

        const radiusSquared =
            numericRadius *
            numericRadius;

        for (
            const object of
            this.interactives.values()
        ) {

            if (!object?.position) {

                continue;

            }

            const distanceSquared =
                position.distanceToSquared(
                    object.position
                );

            if (
                distanceSquared <=
                radiusSquared
            ) {

                results.push(
                    object
                );

            }

        }

        return results;

    }

    update(playerPosition) {

        if (!playerPosition) {

            this.game.nearbyInteractives = [];

            return;

        }

        const nearby =
            this.getNearby(
                playerPosition,
                3
            );

        this.game.nearbyInteractives =
            nearby;

    }

    clear() {

        this.interactives.clear();

        if (this.game) {

            this.game.nearbyInteractives =
                [];

        }

    }

    destroy() {

        this.clear();

        this.game = null;

    }

}
