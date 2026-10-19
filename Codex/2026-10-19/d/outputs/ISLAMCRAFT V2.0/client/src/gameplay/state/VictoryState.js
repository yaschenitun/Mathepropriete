export class VictoryState {

    constructor(game) {

        this.game = game;

        this.results = null;

        this.nextStateDelay = 5;

        this.elapsedTime = 0;

    }

    async initialize() {

        console.log("VictoryState initialisé.");

    }

    enter(results = null) {

        this.results = results;

        this.elapsedTime = 0;

        this.game.uiManager?.showVictoryScreen?.(

            this.results

        );

        this.game.eventBus?.emit(

            "victory:entered",

            this.results

        );

    }

    update(deltaTime) {

        this.elapsedTime += deltaTime;

        if (

            this.elapsedTime >= this.nextStateDelay

        ) {

            this.game.clientStateMachine?.changeState(

                "restart"

            );

        }

    }

    exit() {

        this.game.uiManager?.hideVictoryScreen?.();

    }

    setResults(results) {

        this.results = results;

    }

    getResults() {

        return this.results;

    }

    setDelay(seconds) {

        this.nextStateDelay = Math.max(

            0,

            seconds

        );

    }

}