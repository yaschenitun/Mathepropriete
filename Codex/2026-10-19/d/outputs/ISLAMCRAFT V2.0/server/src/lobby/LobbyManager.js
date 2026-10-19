import { Lobby } from "./Lobby.js";
import { RoomManager } from "./RoomManager.js";

export class LobbyManager {

    constructor(options = {}) {

        this.lobbies = new Map();

        this.roomManagers = new Map();

        this.defaultLobbyId =
            options.defaultLobbyId ??
            "main";

        this.defaultRoomOptions =
            {
                ...(options.defaultRoomOptions ?? {})
            };

        if (options.lobbies) {

            this.load(
                options.lobbies
            );

        }

    }

    createLobby(options = {}) {

        const lobby =
            options instanceof Lobby
                ? options
                : new Lobby(options);

        if (!lobby.id) {

            return {

                success: false,

                reason:
                    "invalid_lobby_id"

            };

        }

        if (
            this.lobbies.has(
                lobby.id
            )
        ) {

            return {

                success: false,

                reason:
                    "lobby_already_exists"

            };

        }

        this.lobbies.set(
            lobby.id,
            lobby
        );

        this.roomManagers.set(
            lobby.id,
            new RoomManager(
                this.defaultRoomOptions
            )
        );

        return {

            success: true,

            lobby

        };

    }

    getLobby(lobbyId = this.defaultLobbyId) {

        return (
            this.lobbies.get(
                lobbyId
            ) ?? null
        );

    }

    getRoomManager(
        lobbyId = this.defaultLobbyId
    ) {

        return (
            this.roomManagers.get(
                lobbyId
            ) ?? null
        );

    }

    ensureLobby(
        lobbyId = this.defaultLobbyId,
        options = {}
    ) {

        const existing =
            this.getLobby(
                lobbyId
            );

        if (existing) {

            return existing;

        }

        const result =
            this.createLobby({

                ...options,

                id:
                    lobbyId

            });

        return result.success
            ? result.lobby
            : null;

    }

    join(
        player,
        lobbyId = this.defaultLobbyId,
        roomId = null,
        roomOptions = {}
    ) {

        const lobby =
            this.ensureLobby(
                lobbyId
            );

        if (!lobby) {

            return {

                success: false,

                reason:
                    "lobby_not_found"

            };

        }

        const roomManager =
            this.getRoomManager(
                lobbyId
            );

        if (!roomManager) {

            return {

                success: false,

                reason:
                    "room_manager_not_found"

            };

        }

        let room =
            roomId
                ? roomManager.get(
                    roomId
                )
                : null;

        if (!room) {

            const result =
                roomManager.findOrCreate(
                    roomOptions
                );

            if (!result.success) {

                return result;

            }

            room =
                result.room;

            if (
                !lobby.getRoom(
                    room.id
                )
            ) {

                const addResult =
                    lobby.addRoom(
                        room
                    );

                if (!addResult.success) {

                    roomManager.remove(
                        room.id
                    );

                    return addResult;

                }

            }

        }

        return lobby.joinRoom(
            player,
            room.id
        );

    }

    leave(
        playerId,
        lobbyId = this.defaultLobbyId
    ) {

        const lobby =
            this.getLobby(
                lobbyId
            );

        if (!lobby) {

            return {

                success: false,

                reason:
                    "lobby_not_found"

            };

        }

        return lobby.leaveRoom(
            playerId
        );

    }

    removeLobby(lobbyId) {

        const lobby =
            this.lobbies.get(
                lobbyId
            );

        if (!lobby) {

            return false;

        }

        lobby.clear();

        this.lobbies.delete(
            lobbyId
        );

        this.roomManagers.delete(
            lobbyId
        );

        return true;

    }

    getAllLobbies() {

        return [
            ...this.lobbies.values()
        ];

    }

    getLobbyCount() {

        return this.lobbies.size;

    }

    load(definitions) {

        if (!Array.isArray(definitions)) {

            return this;

        }

        for (
            const definition
            of definitions
        ) {

            if (
                definition?.id
            ) {

                this.createLobby(
                    definition
                );

            }

        }

        return this;

    }

    clear() {

        for (
            const lobby
            of this.lobbies.values()
        ) {

            lobby.clear();

        }

        for (
            const manager
            of this.roomManagers.values()
        ) {

            manager.clear();

        }

        this.lobbies.clear();

        this.roomManagers.clear();

    }

    serialize() {

        return this.getAllLobbies()
            .map(
                lobby =>
                    lobby.serialize()
            );

    }

}