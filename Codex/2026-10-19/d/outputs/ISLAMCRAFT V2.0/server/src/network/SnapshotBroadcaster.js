export class SnapshotBroadcaster {

    constructor(options = {}) {

        this.connectionManager =
            options.connectionManager ?? null;

        this.intervalMs =
            Math.max(
                0,
                Number(options.intervalMs ?? 50)
            );

        this.snapshotProvider =
            typeof options.snapshotProvider === "function"
                ? options.snapshotProvider
                : null;

        this.timer = null;

        this.sequence = 0;

        this.lastSnapshot = null;

        this.running = false;

    }

    initialize(connectionManager) {

        this.connectionManager =
            connectionManager;

        return this;

    }

    setSnapshotProvider(provider) {

        if (
            provider !== null &&
            typeof provider !== "function"
        ) {

            throw new TypeError(
                "Snapshot provider must be a function."
            );

        }

        this.snapshotProvider =
            provider;

        return this;

    }

    createSnapshot() {

        if (!this.snapshotProvider) {

            return {

                sequence:
                    ++this.sequence,

                timestamp:
                    Date.now(),

                data: {}

            };

        }

        const data =
            this.snapshotProvider();

        return {

            sequence:
                ++this.sequence,

            timestamp:
                Date.now(),

            data

        };

    }

    broadcast(snapshot = null) {

        if (
            !this.connectionManager
        ) {

            return {

                sent: 0,

                snapshot: null,

                reason:
                    "connection_manager_not_configured"

            };

        }

        const current =
            snapshot ??
            this.createSnapshot();

        this.lastSnapshot =
            current;

        const sent =
            this.connectionManager.broadcast(
                "snapshot",
                current
            );

        return {

            sent,

            snapshot:
                current

        };

    }

    tick() {

        return this.broadcast();

    }

    start() {

        if (this.running) {

            return false;

        }

        if (
            !this.connectionManager
        ) {

            return false;

        }

        this.running = true;

        if (this.intervalMs > 0) {

            this.timer =
                setInterval(
                    () => {

                        try {

                            this.tick();

                        } catch {
                            // Snapshot failures must not
                            // terminate the broadcaster.
                        }

                    },
                    this.intervalMs
                );

        }

        return true;

    }

    stop() {

        if (this.timer) {

            clearInterval(
                this.timer
            );

            this.timer = null;

        }

        this.running = false;

        return this;

    }

    getLastSnapshot() {

        return this.lastSnapshot;

    }

    isRunning() {

        return this.running;

    }

}