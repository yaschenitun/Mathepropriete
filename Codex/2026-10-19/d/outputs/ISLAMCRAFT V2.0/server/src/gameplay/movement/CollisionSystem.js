export class CollisionSystem {

    constructor(options = {}) {

        this.world =
            options.world ?? null;

        this.entityRadius =
            Number(options.entityRadius ?? 0.3);

        this.playerHeight =
            Number(options.playerHeight ?? 1.8);

    }

    initialize(world) {

        this.world = world;

        return this;

    }

    isSolid(x, y, z) {

        if (!this.world) {

            return false;

        }

        const chunkSize =
            Number(
                this.world.chunkSize ?? 16
            );

        const chunkX =
            Math.floor(x / chunkSize);

        const chunkZ =
            Math.floor(z / chunkSize);

        const chunk =
            this.world.getChunk?.(
                chunkX,
                chunkZ
            );

        if (!chunk) {

            return false;

        }

        const localX =
            Math.floor(
                x - chunkX * chunkSize
            );

        const localY =
            Math.floor(y);

        const localZ =
            Math.floor(
                z - chunkZ * chunkSize
            );

        const block =
            chunk.getBlock?.(
                localX,
                localY,
                localZ
            );

        if (block === null || block === undefined) {

            return false;

        }

        if (typeof block === "string") {

            return (
                block !== "air" &&
                block !== "water" &&
                block !== "lava"
            );

        }

        return block.solid !== false;

    }

    collides(position) {

        if (!position) {

            return true;

        }

        const radius =
            this.entityRadius;

        const height =
            this.playerHeight;

        const points = [

            [position.x - radius, position.z - radius],
            [position.x + radius, position.z - radius],
            [position.x - radius, position.z + radius],
            [position.x + radius, position.z + radius]

        ];

        const bottom =
            Math.floor(position.y);

        const top =
            Math.ceil(
                position.y + height
            );

        for (const [x, z] of points) {

            for (
                let y = bottom;
                y < top;
                y++
            ) {

                if (
                    this.isSolid(
                        x,
                        y,
                        z
                    )
                ) {

                    return true;

                }

            }

        }

        return false;

    }

    canMove(from, to) {

        if (!from || !to) {

            return false;

        }

        if (this.collides(to)) {

            return false;

        }

        return true;

    }

    resolvePosition(position, fallback = null) {

        if (
            !this.collides(position)
        ) {

            return {
                ...position
            };

        }

        if (fallback) {

            return {
                ...fallback
            };

        }

        return null;

    }

}