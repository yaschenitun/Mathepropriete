export class ChunkCleanup {

    constructor(options = {}) {

        this.maxInactiveTime = Number(

            options.maxInactiveTime ?? 300000

        );

    }

    cleanup(manager, timestamp = Date.now()) {

        if (!manager) {

            return 0;

        }

        const removed = [];

        for (const chunk of manager.getLoadedChunks()) {

            const inactiveTime =

                timestamp -

                chunk.lastAccess;

            if (

                !chunk.dirty &&

                inactiveTime >=

                    this.maxInactiveTime

            ) {

                removed.push(

                    manager.unloadChunk(

                        chunk.x,

                        chunk.z

                    )

                );

            }

        }

        return removed.filter(Boolean).length;

    }

}