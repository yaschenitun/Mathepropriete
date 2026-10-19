import { GameState } from "./GameState.js";

export class VictoryState extends GameState {

    constructor(data = {}) {

        super(data);

        this.name = "victory";

        this.status = "finished";

        this.winnerId =
            data.winnerId ?? null;

    }

    enter(context = {}) {

        super.enter(context);

        this.status = "finished";

        this.winnerId =
            context.winnerId ??
            this.winnerId;

        this.data.winnerId =
            this.winnerId;

        this.data.reason =
            context.reason ??
            "victory";

        return this;

    }

    getWinner() {

        return this.winnerId;

    }

    isWinner(playerId) {

        return (
            this.winnerId !== null &&
            this.winnerId === playerId
        );

    }

}