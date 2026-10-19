export class PlayerSpawnManager {

    constructor(options = {}) {

        this.spawns = [];

        this.defaultSpawn = {

            x: Number(options.x ?? 0),

            y: Number(options.y ?? 0),

            z: Number(options.z ?? 0)

        };

        if (Array.isArray(options.spawns)) {

            for (const spawn of options.spawns) {

                this.addSpawn(spawn);

            }

        }

    }

    addSpawn(position) {

        if (!this.isValidPosition(position)) {

            throw new TypeError(

                "Position de spawn invalide."

            );

        }

        const spawn = {

            x: Number(position.x),

            y: Number(position.y),

            z: Number(position.z)

        };

        this.spawns.push(spawn);

        return spawn;

    }

    removeSpawn(index) {

        if (

            !Number.isInteger(index) ||

            index < 0 ||

            index >= this.spawns.length

        ) {

            return false;

        }

        this.spawns.splice(index, 1);

        return true;

    }

    getSpawn(index = null) {

        if (this.spawns.length === 0) {

            return { ...this.defaultSpawn };

        }

        if (

            Number.isInteger(index) &&

            this.spawns[index]

        ) {

            return { ...this.spawns[index] };

        }

        const randomIndex = Math.floor(

            Math.random() * this.spawns.length

        );

        return { ...this.spawns[randomIndex] };

    }

    spawnPlayer(player, index = null) {

        if (!player) {

            throw new TypeError(

                "Un joueur est requis."

            );

        }

        const position = this.getSpawn(index);

        player.respawn(position);

        return position;

    }

    isValidPosition(position) {

        return Boolean(

            position &&

            Number.isFinite(Number(position.x)) &&

            Number.isFinite(Number(position.y)) &&

            Number.isFinite(Number(position.z))

        );

    }

    getAllSpawns() {

        return this.spawns.map(

            spawn => ({ ...spawn })

        );

    }

    clear() {

        this.spawns.length = 0;

    }

}