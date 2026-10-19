export class RestartState {

    constructor(game) {

        this.game = game;

        this.restartDelay = 3;

        this.elapsedTime = 0;

    }

    async initialize() {

        console.log("RestartState initialisé.");

    }

    enter(data = null) {

        this.elapsedTime = 0;

        this.game.uiManager?.showRestartScreen?.();

        this.game.eventBus?.emit(

            "restart:entered",

            data

        );

    }

    update(deltaTime) {

        this.elapsedTime += deltaTime;

        if (

            this.elapsedTime >= this.restartDelay

        ) {

            this.resetGame();

            this.game.clientStateMachine?.changeState(

                "lobby"

            );

        }

    }

    exit() {

        this.game.uiManager?.hideRestartScreen?.();

    }

    resetGame() {

        this.game.scoreController?.reset?.();

        this.game.progressionController?.reset?.();

        this.game.playerManager?.reset?.();

        this.game.entityManager?.reset?.();

        this.game.world?.reset?.();

        this.game.eventBus?.emit(

            "game:reset"

        );

    }

    setRestartDelay(seconds) {

        this.restartDelay = Math.max(

            0,

            seconds

        );

    }

}