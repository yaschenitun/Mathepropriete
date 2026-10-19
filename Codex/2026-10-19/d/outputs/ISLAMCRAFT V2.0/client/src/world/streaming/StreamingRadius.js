export class StreamingRadius {

    constructor(game) {

        this.game = game;

        this.radius = 4;

        this.previousRadius = this.radius;

    }

    async initialize() {

        const configuredRadius =

            this.game.config?.world?.renderDistance;

        if (Number.isFinite(configuredRadius)) {

            this.radius = Math.max(

                0,

                Math.floor(configuredRadius)

            );

            this.previousRadius = this.radius;

        }

        console.log("StreamingRadius initialisé.");

    }

    setRadius(radius) {

        const value = Number(radius);

        if (!Number.isFinite(value)) {

            return;

        }

        const nextRadius = Math.max(

            0,

            Math.floor(value)

        );

        if (nextRadius === this.radius) {

            return;

        }

        this.previousRadius = this.radius;

        this.radius = nextRadius;

        this.game.eventBus?.emit(

            "world:streaming-radius-changed",

            {

                radius: this.radius,

                previousRadius: this.previousRadius

            }

        );

    }

    getRadius() {

        return this.radius;

    }

    getPreviousRadius() {

        return this.previousRadius;

    }

    getRequiredChunks(centerX, centerZ) {

        const chunks = [];

        for (

            let x = centerX - this.radius;

            x <= centerX + this.radius;

            x++

        ) {

            for (

                let z = centerZ - this.radius;

                z <= centerZ + this.radius;

                z++

            ) {

                chunks.push({

                    x,

                    z

                });

            }

        }

        return chunks;

    }

    contains(centerX, centerZ, chunkX, chunkZ) {

        return (

            Math.abs(chunkX - centerX) <= this.radius &&

            Math.abs(chunkZ - centerZ) <= this.radius

        );

    }

}