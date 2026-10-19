export class NetworkMetrics {

    constructor() {

        this.ping = 0;

        this.jitter = 0;

        this.packetLoss = 0;

        this.bytesSent = 0;

        this.bytesReceived = 0;

        this.lastPingTime = 0;

    }

    async initialize() {

        console.log("NetworkMetrics initialisé.");

    }

    update(deltaTime) {

        this.lastPingTime += deltaTime;

    }

    setPing(ping) {

        this.ping = Math.max(

            0,

            ping

        );

    }

    setJitter(jitter) {

        this.jitter = Math.max(

            0,

            jitter

        );

    }

    setPacketLoss(packetLoss) {

        this.packetLoss = Math.max(

            0,

            Math.min(

                packetLoss,

                100

            )

        );

    }

    addBytesSent(bytes) {

        this.bytesSent += Math.max(

            0,

            bytes

        );

    }

    addBytesReceived(bytes) {

        this.bytesReceived += Math.max(

            0,

            bytes

        );

    }

    getStats() {

        return {

            ping: this.ping,

            jitter: this.jitter,

            packetLoss: this.packetLoss,

            bytesSent: this.bytesSent,

            bytesReceived: this.bytesReceived

        };

    }

    reset() {

        this.ping = 0;

        this.jitter = 0;

        this.packetLoss = 0;

        this.bytesSent = 0;

        this.bytesReceived = 0;

        this.lastPingTime = 0;

    }

}