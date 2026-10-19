import { PlayerEntity } from "./PlayerEntity.js";
import { PlayerState } from "./PlayerState.js";

export class PlayerManager {

    constructor(options = {}) {

        this.players = new Map();

        this.maxPlayers =

            Number(options.maxPlayers ?? 100);

    }

    initialize(server) {

        this.server = server;

        return this;

    }

    addPlayer(data = {}) {

        if (this.players.size >= this.maxPlayers) {

            throw new Error(

                "Nombre maximum de joueurs atteint."

            );

        }

        const player =

            data instanceof PlayerEntity

                ? data

                : new PlayerEntity(data);

        if (!player.id) {

            throw new Error(

                "Un identifiant joueur est requis."

            );

        }

        if (this.players.has(player.id)) {

            throw new Error(

                `Joueur déjà présent: ${player.id}`

            );

        }

        player.setState(PlayerState.ACTIVE);

        this.players.set(player.id, player);

        return player;

    }

    removePlayer(playerId) {

        const player = this.players.get(playerId);

        if (!player) {

            return false;

        }

        player.destroy();

        this.players.delete(playerId);

        return true;

    }

    getPlayer(playerId) {

        return this.players.get(playerId) ?? null;

    }

    getPlayerBySocket(socketId) {

        for (const player of this.players.values()) {

            if (player.socketId === socketId) {

                return player;

            }

        }

        return null;

    }

    hasPlayer(playerId) {

        return this.players.has(playerId);

    }

    getPlayers() {

        return [...this.players.values()];

    }

    update(deltaTime, tick) {

        for (const player of this.players.values()) {

            player.update(deltaTime, tick);

        }

    }

    broadcast(callback) {

        if (typeof callback !== "function") {

            return;

        }

        for (const player of this.players.values()) {

            callback(player);

        }

    }

    clear() {

        for (const player of this.players.values()) {

            player.destroy();

        }

        this.players.clear();

    }

    get size() {

        return this.players.size;

    }

}