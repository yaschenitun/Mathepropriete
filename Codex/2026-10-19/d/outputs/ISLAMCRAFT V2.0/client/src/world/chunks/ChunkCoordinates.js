export class ChunkCoordinates {

    static getChunkSize(game) {

        return game.config.world.chunkSize;

    }

    static worldToChunk(game, x, z) {

        const size = this.getChunkSize(game);

        return {

            chunkX: Math.floor(x / size),

            chunkZ: Math.floor(z / size)

        };

    }

    static chunkToWorld(game, chunkX, chunkZ) {

        const size = this.getChunkSize(game);

        return {

            x: chunkX * size,

            z: chunkZ * size

        };

    }

    static getChunkKey(chunkX, chunkZ) {

        return `${chunkX}:${chunkZ}`;

    }

    static parseChunkKey(key) {

        const [x, z] = key.split(":").map(Number);

        return {

            chunkX: x,

            chunkZ: z

        };

    }

    static localPosition(game, x, z) {

        const size = this.getChunkSize(game);

        const chunk = this.worldToChunk(game, x, z);

        return {

            chunkX: chunk.chunkX,

            chunkZ: chunk.chunkZ,

            localX: x - chunk.chunkX * size,

            localZ: z - chunk.chunkZ * size

        };

    }

    static worldPosition(game, chunkX, chunkZ, localX, localZ) {

        const size = this.getChunkSize(game);

        return {

            x: chunkX * size + localX,

            z: chunkZ * size + localZ

        };

    }

    static distance(chunkAX, chunkAZ, chunkBX, chunkBZ) {

        return Math.max(

            Math.abs(chunkAX - chunkBX),

            Math.abs(chunkAZ - chunkBZ)

        );

    }

    static insideRadius(

        chunkAX,

        chunkAZ,

        chunkBX,

        chunkBZ,

        radius

    ) {

        return (

            this.distance(

                chunkAX,

                chunkAZ,

                chunkBX,

                chunkBZ

            ) <= radius

        );

    }

}