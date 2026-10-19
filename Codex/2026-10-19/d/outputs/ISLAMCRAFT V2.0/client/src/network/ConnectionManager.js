export class ConnectionManager {

    constructor(game) {

        this.game = game;

        this.connected = false;

        this.connecting = false;

        this.serverUrl = "";

        this.retryCount = 0;

        this.maxRetries = 5;

    }

    async initialize() {

        console.log("ConnectionManager initialisé.");

    }

    async connect(serverUrl) {

        if (this.connected || this.connecting) {

            return;

        }

        this.serverUrl = serverUrl;

        this.connecting = true;

        try {

            await this.game.socketClient?.connect?.(

                serverUrl

            );

            this.connected = true;

            this.retryCount = 0;

            this.game.eventBus?.emit(

                "network:connected"

            );

        } catch (error) {

            this.retryCount++;

            this.game.eventBus?.emit(

                "network:connection-failed",

                error

            );

        } finally {

            this.connecting = false;

        }

    }

    disconnect() {

        this.game.socketClient?.disconnect?.();

        this.connected = false;

        this.game.eventBus?.emit(

            "network:disconnected"

        );

    }

    reconnect() {

        if (

            this.retryCount >= this.maxRetries ||

            !this.serverUrl

        ) {

            return;

        }

        this.connect(

            this.serverUrl

        );

    }

    isConnected() {

        return this.connected;

    }

    update(deltaTime) {

        // Réservé :
        // heartbeat
        // reconnexion automatique
        // timeout

    }

}