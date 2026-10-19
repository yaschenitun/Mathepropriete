export class NetworkManager {

    constructor(game) {

        this.game = game;

        this.connected = false;

        this.socketClient = null;

        this.connectionManager = null;

        this.networkClock = null;

        this.networkMetrics = null;

        this.snapshotBuffer = null;

        this.clientPrediction = null;

        this.clientReconciliation = null;

        this.remoteInterpolation = null;

        this.remoteExtrapolation = null;

    }

    async initialize() {

        this.socketClient = this.game.socketClient;

        this.connectionManager = this.game.connectionManager;

        this.networkClock = this.game.networkClock;

        this.networkMetrics = this.game.networkMetrics;

        this.snapshotBuffer = this.game.snapshotBuffer;

        this.clientPrediction = this.game.clientPrediction;

        this.clientReconciliation = this.game.clientReconciliation;

        this.remoteInterpolation = this.game.remoteInterpolation;

        this.remoteExtrapolation = this.game.remoteExtrapolation;

        console.log("NetworkManager initialisé.");

    }

    async connect(serverUrl) {

        await this.connectionManager?.connect?.(

            serverUrl

        );

        this.connected =

            this.connectionManager?.isConnected?.() ?? false;

    }

    disconnect() {

        this.connectionManager?.disconnect?.();

        this.connected = false;

    }

    update(deltaTime) {

        if (!this.connected) {

            return;

        }

        this.networkClock?.update?.(

            deltaTime

        );

        this.networkMetrics?.update?.(

            deltaTime

        );

        this.socketClient?.update?.(

            deltaTime

        );

        this.snapshotBuffer?.update?.(

            deltaTime

        );

        this.clientPrediction?.update?.(

            deltaTime

        );

        this.clientReconciliation?.update?.(

            deltaTime

        );

        this.remoteInterpolation?.update?.(

            deltaTime

        );

        this.remoteExtrapolation?.update?.(

            deltaTime

        );

    }

    isConnected() {

        return this.connected;

    }

}