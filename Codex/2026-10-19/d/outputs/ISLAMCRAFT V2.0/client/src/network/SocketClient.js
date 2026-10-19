export class SocketClient {

    constructor(game) {

        this.game = game;

        this.socket = null;

        this.connected = false;

        this.serverUrl = "";

    }

    async initialize() {

        console.log("SocketClient initialisé.");

    }

    async connect(serverUrl) {

        if (this.connected) {

            return;

        }

        this.serverUrl = serverUrl;

        if (!serverUrl) {

            throw new Error(

                "URL du serveur manquante."

            );

        }

        if (typeof WebSocket === "undefined") {

            throw new Error(

                "WebSocket n'est pas disponible."

            );

        }

        await new Promise((resolve, reject) => {

            const socket = new WebSocket(serverUrl);

            this.socket = socket;

            socket.addEventListener(

                "open",

                () => {

                    this.connected = true;

                    this.game.eventBus?.emit(

                        "socket:connected"

                    );

                    resolve();

                },

                { once: true }

            );

            socket.addEventListener(

                "message",

                event => {

                    this.handleMessage(

                        event.data

                    );

                }

            );

            socket.addEventListener(

                "close",

                () => {

                    this.connected = false;

                    this.game.eventBus?.emit(

                        "socket:disconnected"

                    );

                }

            );

            socket.addEventListener(

                "error",

                error => {

                    this.connected = false;

                    this.game.eventBus?.emit(

                        "socket:error",

                        error

                    );

                    reject(error);

                },

                { once: true }

            );

        });

    }

    disconnect() {

        if (!this.socket) {

            return;

        }

        this.socket.close();

        this.socket = null;

        this.connected = false;

    }

    send(type, data = null) {

        if (

            !this.connected ||

            !this.socket

        ) {

            return false;

        }

        const message = JSON.stringify({

            type,

            data

        });

        this.socket.send(message);

        return true;

    }

    handleMessage(rawMessage) {

        let message;

        try {

            message = JSON.parse(rawMessage);

        } catch {

            return;

        }

        this.game.eventBus?.emit(

            "network:message",

            message

        );

    }

    update(deltaTime) {

        // La communication est gérée
        // par les événements WebSocket.

    }

    isConnected() {

        return this.connected;

    }

}