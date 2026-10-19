export class Room {

    constructor(options = {}) {

        this.id =
            options.id ?? null;

        this.name =
            options.name ??
            this.id ??
            "room";

        this.maxPlayers =
            Math.max(
                1,
                Number(options.maxPlayers ?? 16)
            );

        this.players = new Map();

        this.status =
            options.status ?? "waiting";

        this.createdAt =
            Number(
                options.createdAt ?? Date.now()
            );

        this.updatedAt =
            Number(
                options.updatedAt ?? this.createdAt
            );

        this.metadata = {
            ...(options.metadata ?? {})
        };

    }

    addPlayer(player, metadata = {}) {

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

        if (this.players.has(playerId)) {

            return {
                success: false,
                reason: "player_already_in_room"
            };

        }

        if (
            this.players.size >=
            this.maxPlayers
        ) {

            return {
                success: false,
                reason: "room_full"
            };

        }

        this.players.set(
            playerId,
            {

                player:
                    typeof player === "object"
                        ? player
                        : null,

                metadata: {
                    ...metadata
                },

                joinedAt:
                    Date.now()

            }
        );

        this.updatedAt =
            Date.now();

        return {

            success: true,

            playerId,

            roomId:
                this.id

        };

    }

    removePlayer(playerId) {

        if (!this.players.has(playerId)) {

            return {
                success: false,
                reason: "player_not_in_room"
            };

        }

        this.players.delete(
            playerId
        );

        this.updatedAt =
            Date.now();

        return {

            success: true,

            playerId,

            roomId:
                this.id

        };

    }

    hasPlayer(playerId) {

        return this.players.has(
            playerId
        );

    }

    getPlayer(playerId) {

        return (
            this.players.get(
                playerId
            ) ?? null
        );

    }

    getPlayers() {

        return [
            ...this.players.entries()
        ].map(
            ([playerId, data]) => ({

                playerId,

                ...data

            })
        );

    }

    getPlayerIds() {

        return [
            ...this.players.keys()
        ];

    }

    getPlayerCount() {

        return this.players.size;

    }

    isFull() {

        return (
            this.players.size >=
            this.maxPlayers
        );

    }

    isEmpty() {

        return this.players.size === 0;

    }

    setStatus(status) {

        this.status =
            String(status);

        this.updatedAt =
            Date.now();

        return this;

    }

    isJoinable() {

        return (
            this.status === "waiting" &&
            !this.isFull()
        );

    }

    updateMetadata(metadata = {}) {

        this.metadata = {

            ...this.metadata,

            ...metadata

        };

        this.updatedAt =
            Date.now();

        return this;

    }

    serialize() {

        return {

            id:
                this.id,

            name:
                this.name,

            maxPlayers:
                this.maxPlayers,

            playerCount:
                this.getPlayerCount(),

            players:
                this.getPlayerIds(),

            status:
                this.status,

            createdAt:
                this.createdAt,

            updatedAt:
                this.updatedAt,

            metadata: {
                ...this.metadata
            }

        };

    }

}