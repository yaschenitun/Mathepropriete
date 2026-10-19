export class NetworkClock {

    constructor() {

        this.serverTime = 0;

        this.localTime = 0;

        this.timeOffset = 0;

        this.latency = 0;

        this.lastSyncTime = 0;

    }

    async initialize() {

        console.log("NetworkClock initialisé.");

    }

    update(deltaTime) {

        this.localTime += deltaTime;

    }

    synchronize(serverTimestamp, roundTripTime = 0) {

        this.latency = roundTripTime * 0.5;

        this.serverTime = serverTimestamp;

        this.timeOffset =

            (serverTimestamp + this.latency)

            - this.localTime;

        this.lastSyncTime = this.localTime;

    }

    getServerTime() {

        return this.localTime + this.timeOffset;

    }

    getLocalTime() {

        return this.localTime;

    }

    getLatency() {

        return this.latency;

    }

    getTimeOffset() {

        return this.timeOffset;

    }

    reset() {

        this.serverTime = 0;

        this.localTime = 0;

        this.timeOffset = 0;

        this.latency = 0;

        this.lastSyncTime = 0;

    }

}