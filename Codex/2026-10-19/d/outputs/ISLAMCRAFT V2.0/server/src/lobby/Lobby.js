export class Lobby {

    constructor(options = {}) {

        this.id =
            options.id ?? "main";

        this.name =
            options.name ?? "Main Lobby";

        this.maxRooms =
            Math.max(
                1,
                Number(options.maxRooms ?? 100)
            );

        this.rooms = new Map();

        this.players = new Map();

        this.status =
            options.status ?? "active";

        this.createdAt =
            Number(
                options.createdAt ?? Date.now()
            );

    }

    addRoom(room) {

        if (!room?.id) {

            return {
                success: false,
                reason: "invalid_room"
            };

        }

        if (this.rooms.has(room.id)) {

            return {
                success: false,
                reason: "room_already_exists"
            };

        }

        if (
            this.rooms.size >=
            this.maxRooms
        ) {

            return {
                success: false,
                reason: "lobby_full"
            };

        }

        this.rooms.set(
            room.id,
            room
        );

        return {

            success: true,

            roomId:
                room.id

        };

    }

    removeRoom(roomId) {

        const room =
            this.rooms.get(
                roomId
            );

        if (!room) {

            return {
                success: false,
                reason: "room_not_found"
            };

        }

        for (
            const playerId
            of room.getPlayerIds()
        ) {

            this.players.delete(
                playerId
            );

        }

        this.rooms.delete(
            roomId
        );

        return {

            success: true,

            roomId

        };

    }

    getRoom(roomId) {

        return (
            this.rooms.get(
                roomId
            ) ?? null
        );

    }

    getRooms() {

        return [
            ...this.rooms.values()
        ];

    }

    joinRoom(player, roomId) {

        const playerId =
            typeof player === "object"
                ? player?.id
                : player;

        if (!playerId) {

            return {
                success: false,
                reason: "invalid_player"
            };

        }

        const room =
            this.getRoom(roomId);

        if (!room) {

            return {
                success: false,
                reason: "room_not_found"
            };

        }

        const currentRoomId =
            this.players.get(
                playerId
            );

        if (
            currentRoomId &&
            currentRoomId !== roomId
        ) {

            return {
                success: false,
                reason: "player_already_in_room"
            };

        }

        const result =
            room.addPlayer(
                player
            );

        if (!result.success) {

            return result;

        }

        this.players.set(
            playerId,
            roomId
        );

        return {

            success: true,

            roomId,

            playerId

        };

    }

    leaveRoom(playerId) {

        const roomId =
            this.players.get(
                playerId
            );

        if (!roomId) {

            return {
                success: false,
                reason: "player_not_in_room"
            };

        }

        const room =
            this.getRoom(roomId);

        if (room) {

            room.removePlayer(
                playerId
            );

        }

        this.players.delete(
            playerId
        );

        return {

            success: true,

            playerId,

            roomId

        };

    }

    getPlayerRoom(playerId) {

        const roomId =
            this.players.get(
                playerId
            );

        if (!roomId) {

            return null;

        }

        return this.getRoom(
            roomId
        );

    }

    getAvailableRooms() {

        return this.getRooms()
            .filter(
                room =>
                    room.isJoinable()
            );

    }

    getPlayerCount() {

        return this.players.size;

    }

    getRoomCount() {

        return this.rooms.size;

    }

    clear() {

        for (
            const room
            of this.rooms.values()
        ) {

            for (
                const playerId
                of room.getPlayerIds()
            ) {

                this.players.delete(
                    playerId
                );

            }

        }

        this.rooms.clear();

    }

    serialize() {

        return {

            id:
                this.id,

            name:
                this.name,

            status:
                this.status,

            roomCount:
                this.getRoomCount(),

            playerCount:
                this.getPlayerCount(),

            rooms:
                this.getRooms().map(
                    room =>
                        room.serialize()
                ),

            createdAt:
                this.createdAt

        };

    }

}