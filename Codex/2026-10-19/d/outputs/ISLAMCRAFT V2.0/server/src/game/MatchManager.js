import { MatchTimer } from "./MatchTimer.js";

export class MatchManager {

    constructor(options = {}) {

        this.matches = new Map();

        this.defaultDuration =
            Number(
                options.matchDuration ?? 600000
            );

        this.nextId = 1;

    }

    generateId() {

        return `match_${this.nextId++}`;

    }

    create(options = {}) {

        const id =
            options.id ??
            this.generateId();

        if (this.matches.has(id)) {

            throw new Error(
                `Match déjà existant: ${id}`
            );

        }

        const match = {

            id,

            status:
                "waiting",

            players:
                new Set(),

            timer:
                new MatchTimer(
                    options.duration ??
                    this.defaultDuration
                ),

            createdAt:
                Date.now(),

            metadata:
                {
                    ...(options.metadata ?? {})
                }

        };

        this.matches.set(
            id,
            match
        );

        return match;

    }

    get(id) {

        return (
            this.matches.get(id) ??
            null
        );

    }

    has(id) {

        return this.matches.has(id);

    }

    addPlayer(matchId, playerId) {

        const match =
            this.get(matchId);

        if (!match || !playerId) {

            return false;

        }

        match.players.add(
            playerId
        );

        return true;

    }

    removePlayer(matchId, playerId) {

        const match =
            this.get(matchId);

        if (!match) {

            return false;

        }

        return match.players.delete(
            playerId
        );

    }

    start(matchId, timestamp = Date.now()) {

        const match =
            this.get(matchId);

        if (!match) {

            return false;

        }

        match.status = "active";

        match.startedAt =
            timestamp;

        match.timer.start(
            timestamp
        );

        return true;

    }

    stop(matchId, timestamp = Date.now()) {

        const match =
            this.get(matchId);

        if (!match) {

            return false;

        }

        match.timer.pause(
            timestamp
        );

        match.status = "finished";

        match.endedAt =
            timestamp;

        return true;

    }

    update(timestamp = Date.now()) {

        for (const match of this.matches.values()) {

            if (
                match.status !== "active"
            ) {

                continue;

            }

            match.timer.update(
                timestamp
            );

            if (
                match.timer.isFinished(
                    timestamp
                )
            ) {

                match.status =
                    "finished";

                match.endedAt =
                    timestamp;

            }

        }

    }

    delete(matchId) {

        return this.matches.delete(
            matchId
        );

    }

    getAll() {

        return [
            ...this.matches.values()
        ];

    }

    getActive() {

        return this.getAll().filter(
            match =>
                match.status === "active"
        );

    }

    clear() {

        this.matches.clear();

    }

}