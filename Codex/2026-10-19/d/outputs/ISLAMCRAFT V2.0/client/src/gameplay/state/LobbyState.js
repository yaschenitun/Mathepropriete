export class LobbyState {

    constructor(game) {

        this.game = game;

        this.readyPlayers = 0;

        this.requiredPlayers = 1;

    }

    async initialize() {

        console.log("LobbyState initialisé.");

    }

    enter(data = null) {

        this.readyPlayers = 0;

        this.game.uiManager?.showLobby?.();

        this.game.eventBus?.emit(

            "lobby:entered",

            data

        );

    }

    update(deltaTime) {

        if (this.readyPlayers >= this.requiredPlayers) {

            this.game.clientStateMachine?.changeState(

                "playing"

            );

        }

    }

    exit() {

        this.game.uiManager?.hideLobby?.();

    }

    setReadyPlayers(count) {

        this.readyPlayers = Math.max(

            0,

            count

        );

    }

    setRequiredPlayers(count) {

        this.requiredPlayers = Math.max(

            1,

            count

        );

    }

}