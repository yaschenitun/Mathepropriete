export class ConnectionManager {

    constructor(options = {}) {

        this.connections = new Map();

        this.maxConnections =
            Number(options.maxConnections ?? 1000);

        this.createdAt =
            Date.now();

    }

    add(connection) {

        if (!connection?.id) {

            return {
                success: false,
                reason: "invalid_connection"
            };

        }

        if (this.connections.has(connection.id)) {

            return {
                success: false,
                reason: "connection_exists"
            };

        }

        if (
            this.connections.size >=
            this.maxConnections
        ) {

            return {
                success: false,
                reason: "connection_limit_reached"
            };

        }

        this.connections.set(
            connection.id,
            {
                connection,
                connectedAt: Date.now()
            }
        );

        return {
            success: true,
            connectionId: connection.id
        };

    }

    remove(connectionId) {

        return this.connections.delete(
            connectionId
        );

    }

    get(connectionId) {

        return (
            this.connections.get(
                connectionId
            )?.connection ?? null
        );

    }

    has(connectionId) {

        return this.connections.has(
            connectionId
        );

    }

    count() {

        return this.connections.size;

    }

    getAll() {

        return [
            ...this.connections.values()
        ].map(
            entry => entry.connection
        );

    }

    broadcast(event, payload) {

        let sent = 0;

        for (
            const entry
            of this.connections.values()
        ) {

            const connection =
                entry.connection;

            if (
                typeof connection.send ===
                "function"
            ) {

                try {

                    connection.send(
                        event,
                        payload
                    );

                    sent++;

                } catch {
                    // Individual connection failures
                    // must not stop the broadcast.
                }

            }

        }

        return sent;

    }

    clear() {

        for (
            const entry
            of this.connections.values()
        ) {

            try {

                entry.connection.close?.();

            } catch {
                // Ignore connection cleanup errors.
            }

        }

        this.connections.clear();

    }

}