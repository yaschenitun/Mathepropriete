export class LobbyUI {

    constructor(game) {

        this.game = game;

        this.visible = false;

        this.players = [];

    }

    async initialize() {

        console.log("LobbyUI initialisé.");

    }

    show() {

        this.visible = true;

        this.game.eventBus?.emit(

            "lobby:ui-shown"

        );

    }

    hide() {

        this.visible = false;

        this.game.eventBus?.emit(

            "lobby:ui-hidden"

        );

    }

    setPlayers(players) {

        this.players = Array.isArray(players)

            ? [...players]

            : [];

        this.game.eventBus?.emit(

            "lobby:players-updated",

            this.players

        );

    }

    addPlayer(player) {

        if (!player) {

            return;

        }

        this.players.push(player);

    }

    removePlayer(playerId) {

        this.players = this.players.filter(

            player => player?.id !== playerId

        );

    }

    getPlayers() {

        return [...this.players];

    }

    isVisible() {

        return this.visible;

    }

    update(deltaTime) {

        if (!this.visible) {

            return;

        }

    }

}