import { PlayerSpawn } from "./PlayerSpawn.js";
import { ChestSpawn } from "./ChestSpawn.js";
import { DynamicSpawnManager } from "./DynamicSpawnManager.js";

export class SpawnManager {

    constructor(options = {}) {

        this.playerSpawns = new Map();

        this.chestSpawns = new Map();

        this.dynamic =
            options.dynamicSpawnManager ??
            new DynamicSpawnManager(options);

        this.defaultPlayerSpawn =
            new PlayerSpawn({

                id: "default",

                x: options.x ?? 0,

                y: options.y ?? 5,

                z: options.z ?? 0

            });

        this.registerPlayerSpawn(
            this.defaultPlayerSpawn
        );

    }

    initialize(server) {

        this.server = server;

        return this;

    }

    registerPlayerSpawn(spawn) {

        const playerSpawn =
            spawn instanceof PlayerSpawn
                ? spawn
                : new PlayerSpawn(spawn);

        this.playerSpawns.set(
            playerSpawn.id,
            playerSpawn
        );

        return playerSpawn;

    }

    registerChestSpawn(spawn) {

        const chestSpawn =
            spawn instanceof ChestSpawn
                ? spawn
                : new ChestSpawn(spawn);

        if (!chestSpawn.id) {

            throw new Error(
                "Un identifiant de coffre est requis."
            );

        }

        this.chestSpawns.set(
            chestSpawn.id,
            chestSpawn
        );

        return chestSpawn;

    }

    getPlayerSpawn(id = null) {

        if (
            id &&
            this.playerSpawns.has(id)
        ) {

            return this.playerSpawns.get(id);

        }

        const available =
            [
                ...this.playerSpawns.values()
            ]
            .filter(
                spawn =>
                    spawn.isAvailable()
            )
            .sort(
                (a, b) =>
                    b.priority -
                    a.priority
            );

        return (
            available[0] ??
            this.defaultPlayerSpawn
        );

    }

    getChestSpawn(id) {

        return (
            this.chestSpawns.get(id) ??
            null
        );

    }

    spawnPlayer(player, spawnId = null) {

        if (!player) {

            return null;

        }

        const spawn =
            this.getPlayerSpawn(spawnId);

        player.setPosition(

            spawn.position.x,

            spawn.position.y,

            spawn.position.z

        );

        player.setRotation(

            spawn.rotation.x,

            spawn.rotation.y,

            spawn.rotation.z

        );

        return spawn;

    }

    createDynamicSpawn(
        position,
        options = {}
    ) {

        return this.dynamic.add(
            position,
            options
        );

    }

    update(deltaTime, tick) {

        return this.dynamic.update();

    }

    getPlayerSpawns() {

        return [
            ...this.playerSpawns.values()
        ];

    }

    getChestSpawns() {

        return [
            ...this.chestSpawns.values()
        ];

    }

    clear() {

        this.playerSpawns.clear();

        this.chestSpawns.clear();

        this.dynamic.clear();

        this.registerPlayerSpawn(
            this.defaultPlayerSpawn
        );

    }

}