import { GameSession } from "./GameSession.js";
import { MatchManager } from "./MatchManager.js";

export class GameManager {

    constructor(options = {}) {

        this.sessions = new Map();

        this.matchManager =
            options.matchManager ??
            new MatchManager(options);

        this.nextSessionId = 1;

        this.server = null;

        this.running = false;

    }

    initialize(server = null) {

        this.server = server;

        return this;

    }

    generateSessionId() {

        return `session_${this.nextSessionId++}`;

    }

    createSession(data = {}) {

        const id =
            data.id ??
            this.generateSessionId();

        if (this.sessions.has(id)) {

            throw new Error(
                `Session déjà existante: ${id}`
            );

        }

        const session =
            new GameSession({

                ...data,

                id

            });

        this.sessions.set(
            id,
            session
        );

        return session;

    }

    getSession(id) {

        return (
            this.sessions.get(id) ??
            null
        );

    }

    hasSession(id) {

        return this.sessions.has(id);

    }

    removeSession(id) {

        const session =
            this.sessions.get(id);

        if (!session) {

            return false;

        }

        session.clearPlayers();

        this.sessions.delete(id);

        return true;

    }

    addPlayer(sessionId, player) {

        const session =
            this.getSession(sessionId);

        if (!session) {

            return false;

        }

        return session.addPlayer(
            player
        );

    }

    removePlayer(sessionId, playerId) {

        const session =
            this.getSession(sessionId);

        if (!session) {

            return false;

        }

        return session.removePlayer(
            playerId
        );

    }

    startSession(
        sessionId,
        timestamp = Date.now()
    ) {

        const session =
            this.getSession(sessionId);

        if (!session) {

            return false;

        }

        return session.start(
            timestamp
        );

    }

    finishSession(
        sessionId,
        timestamp = Date.now()
    ) {

        const session =
            this.getSession(sessionId);

        if (!session) {

            return false;

        }

        return session.finish(
            timestamp
        );

    }

    start() {

        this.running = true;

        return this;

    }

    stop() {

        this.running = false;

        this.matchManager.update();

        return this;

    }

    update(
        deltaTime = 0,
        timestamp = Date.now()
    ) {

        if (!this.running) {

            return;

        }

        this.matchManager.update(
            timestamp
        );

        for (const session of this.sessions.values()) {

            if (
                session.status !== "active"
            ) {

                continue;

            }

            for (
                const player
                of session.getPlayers()
            ) {

                if (
                    typeof player.update ===
                    "function"
                ) {

                    player.update(
                        deltaTime
                    );

                }

            }

        }

    }

    getSessions() {

        return [
            ...this.sessions.values()
        ];

    }

    getActiveSessions() {

        return this.getSessions().filter(
            session =>
                session.status === "active"
        );

    }

    clear() {

        for (const session of this.sessions.values()) {

            session.clearPlayers();

        }

        this.sessions.clear();

        this.matchManager.clear();

    }

    destroy() {

        this.stop();

        this.clear();

        this.server = null;

    }

}