export class RemoteExtrapolation {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.maxExtrapolationTime = 0.25;

    }

    async initialize() {

        console.log("RemoteExtrapolation initialisé.");

    }

    extrapolate(entity, deltaTime) {

        if (

            !this.enabled ||

            !entity

        ) {

            return;

        }

        const velocity = entity.velocity;

        if (!velocity) {

            return;

        }

        const time = Math.min(

            deltaTime,

            this.maxExtrapolationTime

        );

        entity.position.x += velocity.x * time;

        entity.position.y += velocity.y * time;

        entity.position.z += velocity.z * time;

    }

    extrapolateAll(entities, deltaTime) {

        if (!Array.isArray(entities)) {

            return;

        }

        for (const entity of entities) {

            this.extrapolate(

                entity,

                deltaTime

            );

        }

    }

    setEnabled(enabled) {

        this.enabled = enabled;

    }

    isEnabled() {

        return this.enabled;

    }

    update(deltaTime) {

        // Les extrapolations sont appliquées
        // après la dernière mise à jour réseau.

    }

}