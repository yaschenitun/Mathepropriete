export class RemoteInterpolation {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.interpolationDelay = 100;

    }

    async initialize() {

        console.log("RemoteInterpolation initialisé.");

    }

    interpolate(entity, alpha) {

        if (

            !this.enabled ||

            !entity ||

            !entity.previousSnapshot ||

            !entity.nextSnapshot

        ) {

            return;

        }

        const previous = entity.previousSnapshot;

        const next = entity.nextSnapshot;

        entity.position.x = previous.position.x +

            (next.position.x - previous.position.x) * alpha;

        entity.position.y = previous.position.y +

            (next.position.y - previous.position.y) * alpha;

        entity.position.z = previous.position.z +

            (next.position.z - previous.position.z) * alpha;

        entity.rotation.x = previous.rotation.x +

            (next.rotation.x - previous.rotation.x) * alpha;

        entity.rotation.y = previous.rotation.y +

            (next.rotation.y - previous.rotation.y) * alpha;

        entity.rotation.z = previous.rotation.z +

            (next.rotation.z - previous.rotation.z) * alpha;

    }

    interpolateAll(entities, alpha) {

        if (!Array.isArray(entities)) {

            return;

        }

        for (const entity of entities) {

            this.interpolate(

                entity,

                alpha

            );

        }

    }

    setInterpolationDelay(milliseconds) {

        this.interpolationDelay = Math.max(

            0,

            milliseconds

        );

    }

    getInterpolationDelay() {

        return this.interpolationDelay;

    }

    setEnabled(enabled) {

        this.enabled = enabled;

    }

    isEnabled() {

        return this.enabled;

    }

    update(deltaTime) {

        // L'interpolation est déclenchée
        // par NetworkManager à chaque frame.

    }

}