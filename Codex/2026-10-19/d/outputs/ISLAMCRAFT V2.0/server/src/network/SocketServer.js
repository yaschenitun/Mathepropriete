import { ConnectionManager } from "./ConnectionManager.js";
import { EventRouter } from "./EventRouter.js";
import { InputReceiver } from "./InputReceiver.js";
import { NetworkMetrics } from "./NetworkMetrics.js";
import { PacketValidator } from "./PacketValidator.js";
import { RateLimiter } from "./RateLimiter.js";
import { SnapshotBroadcaster } from "./SnapshotBroadcaster.js";

export class SocketServer {

    constructor(options = {}) {

        this.options = {
            ...options
        };

        this.connectionManager =
            options.connectionManager ??
            new ConnectionManager(
                options
            );

        this.eventRouter =
            options.eventRouter ??
            new EventRouter();

        this.inputReceiver =
            options.inputReceiver ??
            new InputReceiver({
                router:
                    this.eventRouter
            });

        this.metrics =
            options.metrics ??
            new NetworkMetrics();

        this.packetValidator =
            options.packetValidator ??
            new PacketValidator(
                options
            );

        this.rateLimiter =
            options.rateLimiter ??
            new RateLimiter(
                options
            );

        this.snapshotBroadcaster =
            options.snapshotBroadcaster ??
            new SnapshotBroadcaster({
                connectionManager:
                    this.connectionManager,

                intervalMs:
                    options.snapshotIntervalMs,

                snapshotProvider:
                    options.snapshotProvider

            });

        this.server = null;

        this.running = false;

        this.connections = new Map();

    }

    async start(server = null) {

        if (this.running) {

            return {

                success: true,

                alreadyRunning: true

            };

        }

        this.server =
            server;

        this.running = true;

        this.eventRouter.emit(
            "serverStarted",
            {
                timestamp:
                    Date.now()
            }
        );

        this.snapshotBroadcaster.start();

        return {

            success: true,

            timestamp:
                Date.now()

        };

    }

    async stop() {

        if (!this.running) {

            return {

                success: true,

                alreadyStopped: true

            };

        }

        this.snapshotBroadcaster.stop();

        for (
            const connection
            of this.connectionManager.getAll()
        ) {

            try {

                connection.close?.();

            } catch {
                // Ignore individual close failures.
            }

        }

        this.connections.clear();

        this.running = false;

        await this.eventRouter.emit(
            "serverStopped",
            {
                timestamp:
                    Date.now()
            }
        );

        return {

            success: true,

            timestamp:
                Date.now()

        };

    }

    registerConnection(connection) {

        const result =
            this.connectionManager.add(
                connection
            );

        if (!result.success) {

            this.metrics.recordRejected();

            return result;

        }

        this.connections.set(
            connection.id,
            connection
        );

        this.eventRouter.emit(
            "connection",
            {
                connection
            }
        );

        return result;

    }

    removeConnection(connectionId) {

        const connection =
            this.connections.get(
                connectionId
            );

        this.connections.delete(
            connectionId
        );

        const removed =
            this.connectionManager.remove(
                connectionId
            );

        if (removed) {

            this.eventRouter.emit(
                "disconnect",
                {
                    connectionId,
                    connection
                }
            );

        }

        return removed;

    }

    receive(
        connectionId,
        packet
    ) {

        const connection =
            this.connections.get(
                connectionId
            );

        if (!connection) {

            this.metrics.recordRejected();

            return {

                accepted: false,

                reason:
                    "connection_not_found"

            };

        }

        const rate =
            this.rateLimiter.check(
                connectionId
            );

        if (!rate.allowed) {

            this.metrics.recordRejected();

            return {

                accepted: false,

                reason:
                    rate.reason,

                retryAfter:
                    rate.retryAfter

            };

        }

        const rawSize =
            typeof packet === "string"
                ? packet.length
                : JSON.stringify(packet ?? {})
                    .length;

        this.metrics.recordReceived(
            rawSize
        );

        const validation =
            this.packetValidator.validate(
                packet
            );

        if (!validation.valid) {

            this.metrics.recordRejected();

            return {

                accepted: false,

                reason:
                    validation.reason

            };

        }

        const input =
            this.inputReceiver.receive(
                connection.playerId ??
                connection.id,
                validation.packet
            );

        if (!input.accepted) {

            this.metrics.recordRejected();

            return input;

        }

        this.eventRouter.emit(
            validation.packet.type,
            {

                connectionId,

                connection,

                packet:
                    validation.packet

            }
        );

        return {

            accepted: true,

            packet:
                validation.packet

        };

    }

    send(
        connectionId,
        event,
        payload
    ) {

        const connection =
            this.connections.get(
                connectionId
            );

        if (!connection) {

            return {

                success: false,

                reason:
                    "connection_not_found"

            };

        }

        try {

            if (
                typeof connection.send ===
                "function"
            ) {

                connection.send(
                    event,
                    payload
                );

            } else {

                return {

                    success: false,

                    reason:
                        "connection_send_unavailable"

                };

            }

            this.metrics.recordSent(
                JSON.stringify(
                    payload ?? {}
                ).length
            );

            return {

                success: true

            };

        } catch (error) {

            this.metrics.recordError();

            return {

                success: false,

                reason:
                    "send_failed",

                error

            };

        }

    }

    broadcast(event, payload) {

        const sent =
            this.connectionManager.broadcast(
                event,
                payload
            );

        this.metrics.sentPackets += sent;

        return {

            success: true,

            sent

        };

    }

    on(event, handler) {

        return this.eventRouter.on(
            event,
            handler
        );

    }

    once(event, handler) {

        return this.eventRouter.once(
            event,
            handler
        );

    }

    getMetrics() {

        return this.metrics.snapshot();

    }

    getConnectionCount() {

        return this.connectionManager.count();

    }

    isRunning() {

        return this.running;

    }

}