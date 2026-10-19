export class PlayingState {

    constructor(game) {

        this.game = game;

        this.elapsedTime = 0;

        this.paused = false;

    }

    async initialize() {

        console.log("PlayingState initialisé.");

    }

    enter(data = null) {

        this.elapsedTime = 0;

        this.paused = false;

        this.game.uiManager?.showGameplay?.();

        this.game.eventBus?.emit(

            "gameplay:started",

            data

        );

    }

    update(deltaTime) {

        if (this.paused) {

            return;

        }

        this.elapsedTime += deltaTime;

        this.game.world?.update?.(

            deltaTime

        );

        this.game.playerManager?.update?.(

            deltaTime

        );

        this.game.entityManager?.update?.(

            deltaTime

        );

        if (

            this.game.matchController?.isFinished?.()

        ) {

            this.game.clientStateMachine?.changeState(

                "victory"

            );

        }

    }

    exit() {

        this.game.uiManager?.hideGameplay?.();

    }

    pause() {

        this.paused = true;

    }

    resume() {

        this.paused = false;

    }

    isPaused() {

        return this.paused;

    }

    getElapsedTime() {

        return this.elapsedTime;

    }

}