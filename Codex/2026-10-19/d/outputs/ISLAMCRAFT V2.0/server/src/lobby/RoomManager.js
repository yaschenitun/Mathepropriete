import { Room } from "./Room.js";

export class RoomManager {

    constructor(options = {}) {

        this.rooms = new Map();

        this.defaultMaxPlayers =
            Math.max(
                1,
                Number(
                    options.defaultMaxPlayers ?? 16
                )
            );

        this.nextRoomNumber = 1;

    }

    generateId() {

        let id;

        do {

            id =
                `room_${this.nextRoomNumber++}`;

        } while (
            this.rooms.has(id)
        );

        return id;

    }

    create(options = {}) {

        const room =
            options instanceof Room
                ? options
                : new Room({

                    ...options,

                    id:
                        options.id ??
                        this.generateId(),

                    maxPlayers:
                        options.maxPlayers ??
                        this.defaultMaxPlayers

                });

        if (
            !room.id ||
            this.rooms.has(room.id)
        ) {

            return {

                success: false,

                reason:
                    "room_already_exists"

            };

        }

        this.rooms.set(
            room.id,
            room
        );

        return {

            success: true,

            room

        };

    }

    get(roomId) {

        return (
            this.rooms.get(
                roomId
            ) ?? null
        );

    }

    has(roomId) {

        return this.rooms.has(
            roomId
        );

    }

    remove(roomId) {

        return this.rooms.delete(
            roomId
        );

    }

    findJoinable(filters = {}) {

        const rooms =
            [
                ...this.rooms.values()
            ].filter(
                room =>
                    room.isJoinable()
            );

        if (filters.name) {

            return rooms.find(
                room =>
                    room.name ===
                    filters.name
            ) ?? null;

        }

        if (filters.metadata) {

            return rooms.find(
                room => {

                    return Object.entries(
                        filters.metadata
                    ).every(
                        ([key, value]) =>
                            room.metadata[key] ===
                            value
                    );

                }
            ) ?? null;

        }

        return rooms[0] ?? null;

    }

    findOrCreate(options = {}) {

        const existing =
            this.findJoinable(
                options
            );

        if (existing) {

            return {

                success: true,

                created: false,

                room:
                    existing

            };

        }

        return {

            ...this.create(
                options
            ),

            created: true

        };

    }

    getAll() {

        return [
            ...this.rooms.values()
        ];

    }

    getJoinable() {

        return this.getAll()
            .filter(
                room =>
                    room.isJoinable()
            );

    }

    getCount() {

        return this.rooms.size;

    }

    clearEmpty() {

        let removed = 0;

        for (
            const [id, room]
            of this.rooms
        ) {

            if (room.isEmpty()) {

                this.rooms.delete(id);

                removed++;

            }

        }

        return removed;

    }

    clear() {

        this.rooms.clear();

    }

    serialize() {

        return this.getAll().map(
            room =>
                room.serialize()
        );

    }

}