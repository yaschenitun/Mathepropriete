export class RateLimiter {

    constructor(options = {}) {

        this.maxRequests =
            Math.max(
                1,
                Number(options.maxRequests ?? 30)
            );

        this.windowMs =
            Math.max(
                1,
                Number(options.windowMs ?? 1000)
            );

        this.clients = new Map();

    }

    _getClient(id) {

        if (!this.clients.has(id)) {

            this.clients.set(
                id,
                {
                    count: 0,
                    startedAt: Date.now()
                }
            );

        }

        return this.clients.get(id);

    }

    check(id) {

        if (!id) {

            return {
                allowed: false,
                reason: "missing_client"
            };

        }

        const now =
            Date.now();

        const client =
            this._getClient(id);

        if (
            now - client.startedAt >=
            this.windowMs
        ) {

            client.count = 0;

            client.startedAt = now;

        }

        if (
            client.count >=
            this.maxRequests
        ) {

            return {

                allowed: false,

                reason:
                    "rate_limit_exceeded",

                remaining: 0,

                retryAfter:
                    Math.max(
                        0,
                        this.windowMs -
                        (now - client.startedAt)
                    )

            };

        }

        client.count++;

        return {

            allowed: true,

            remaining:
                Math.max(
                    0,
                    this.maxRequests -
                    client.count
                ),

            retryAfter: 0

        };

    }

    peek(id) {

        if (!id) {

            return {
                allowed: false,
                remaining: 0
            };

        }

        const client =
            this.clients.get(id);

        if (!client) {

            return {

                allowed: true,

                remaining:
                    this.maxRequests

            };

        }

        const elapsed =
            Date.now() -
            client.startedAt;

        if (
            elapsed >=
            this.windowMs
        ) {

            return {

                allowed: true,

                remaining:
                    this.maxRequests

            };

        }

        return {

            allowed:
                client.count <
                this.maxRequests,

            remaining:
                Math.max(
                    0,
                    this.maxRequests -
                    client.count
                ),

            retryAfter:
                Math.max(
                    0,
                    this.windowMs -
                    elapsed
                )

        };

    }

    reset(id) {

        return this.clients.delete(id);

    }

    resetAll() {

        this.clients.clear();

    }

    cleanup() {

        const now =
            Date.now();

        let removed = 0;

        for (
            const [id, client]
            of this.clients
        ) {

            if (
                now - client.startedAt >=
                this.windowMs
            ) {

                this.clients.delete(id);

                removed++;

            }

        }

        return removed;

    }

}