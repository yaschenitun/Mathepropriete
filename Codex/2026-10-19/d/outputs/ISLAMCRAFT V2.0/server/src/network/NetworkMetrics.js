export class NetworkMetrics {

    constructor() {

        this.startedAt =
            Date.now();

        this.receivedPackets = 0;

        this.sentPackets = 0;

        this.rejectedPackets = 0;

        this.errors = 0;

        this.bytesReceived = 0;

        this.bytesSent = 0;

        this.latencies = [];

    }

    recordReceived(bytes = 0) {

        this.receivedPackets++;

        this.bytesReceived +=
            Math.max(
                0,
                Number(bytes) || 0
            );

    }

    recordSent(bytes = 0) {

        this.sentPackets++;

        this.bytesSent +=
            Math.max(
                0,
                Number(bytes) || 0
            );

    }

    recordRejected() {

        this.rejectedPackets++;

    }

    recordError() {

        this.errors++;

    }

    recordLatency(milliseconds) {

        const value =
            Number(milliseconds);

        if (!Number.isFinite(value)) {

            return;

        }

        this.latencies.push(
            Math.max(0, value)
        );

        if (
            this.latencies.length > 1000
        ) {

            this.latencies.shift();

        }

    }

    getAverageLatency() {

        if (this.latencies.length === 0) {

            return 0;

        }

        const total =
            this.latencies.reduce(
                (sum, value) =>
                    sum + value,
                0
            );

        return total /
            this.latencies.length;

    }

    getUptime() {

        return Date.now() -
            this.startedAt;

    }

    snapshot() {

        return {

            uptime:
                this.getUptime(),

            receivedPackets:
                this.receivedPackets,

            sentPackets:
                this.sentPackets,

            rejectedPackets:
                this.rejectedPackets,

            errors:
                this.errors,

            bytesReceived:
                this.bytesReceived,

            bytesSent:
                this.bytesSent,

            averageLatency:
                this.getAverageLatency()

        };

    }

    reset() {

        this.startedAt =
            Date.now();

        this.receivedPackets = 0;

        this.sentPackets = 0;

        this.rejectedPackets = 0;

        this.errors = 0;

        this.bytesReceived = 0;

        this.bytesSent = 0;

        this.latencies.length = 0;

    }

}