import { GameState } from "./GameState.js";

export class RestartState extends GameState {

    constructor(data = {}) {

        super(data);

        this.name = "restart";

        this.status = "restarting";

        this.delay =
            Math.max(
                0,
                Number(data.delay ?? 5)
            );

        this.restartAt = null;

    }

    enter(context = {}) {

        super.enter(context);

        this.status = "restarting";

        this.restartAt =
            Date.now() +
            this.delay * 1000;

        this.data.reason =
            context.reason ??
            "game_restart";

        return this;

    }

    isReady(timestamp = Date.now()) {

        return (
            this.restartAt !== null &&
            timestamp >= this.restartAt
        );

    }

    getRemainingTime(
        timestamp = Date.now()
    ) {

        if (this.restartAt === null) {
            return this.delay;
        }

        return Math.max(
            0,
            (this.restartAt - timestamp) /
            1000
        );

    }

}