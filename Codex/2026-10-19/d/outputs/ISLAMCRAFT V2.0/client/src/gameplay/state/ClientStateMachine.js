export class ClientStateMachine {

    constructor(game) {

        this.game = game;

        this.states = new Map();

        this.currentState = null;

    }

    async initialize() {

        console.log("ClientStateMachine initialisé.");

    }

    register(name, state) {

        this.states.set(

            name,

            state

        );

    }

    changeState(name, data = null) {

        const nextState =

            this.states.get(name);

        if (!nextState) {

            console.warn(

                `État inconnu : ${name}`

            );

            return false;

        }

        if (this.currentState?.exit) {

            this.currentState.exit();

        }

        this.currentState = nextState;

        if (this.currentState.enter) {

            this.currentState.enter(data);

        }

        this.game.eventBus?.emit(

            "state:changed",

            {

                state: name,

                data

            }

        );

        return true;

    }

    update(deltaTime) {

        this.currentState?.update?.(

            deltaTime

        );

    }

    render() {

        this.currentState?.render?.();

    }

    getCurrentState() {

        return this.currentState;

    }

}