import { GameState } from "./GameState.js";

export class LobbyState extends GameState {

    constructor(data = {}) {

        super(data);

        this.name = "lobby";

        this.status = "waiting";

    }

    enter(context = {}) {

        super.enter(context);

        this.status = "waiting";

        this.data.readyPlayers =
            Array.isArray(
                context.readyPlayers
            )
                ? [...context.readyPlayers]
                : [];

        return this;

    }

    addReadyPlayer(playerId) {

        if (!playerId) {
            return false;
        }

        if (
            !Array.isArray(
                this.data.readyPlayers
            )
        ) {

            this.data.readyPlayers = [];

        }

        if (
            this.data.readyPlayers.includes(
                playerId
            )
        ) {

            return false;

        }

        this.data.readyPlayers.push(
            playerId
        );

        this.updatedAt =
            Date.now();

        return true;

    }

    removeReadyPlayer(playerId) {

        const players =
            this.data.readyPlayers ?? [];

        const index =
            players.indexOf(playerId);

        if (index === -1) {
            return false;
        }

        players.splice(
            index,
            1
        );

        this.updatedAt =
            Date.now();

        return true;

    }

    isReady(playerId) {

        return (
            this.data.readyPlayers ??
            []
        ).includes(playerId);

    }

}