export const MovementStates = Object.freeze({

    IDLE: "idle",

    WALKING: "walking",

    RUNNING: "running",

    JUMPING: "jumping",

    FALLING: "falling",

    LANDING: "landing",

    SLIDING: "sliding"

});

export class MovementState {

    constructor(game) {

        this.game = game;

        this.currentState = MovementStates.IDLE;

        this.previousState = null;

        this.stateTime = 0;

    }

    async initialize() {

        console.log("MovementState initialisé.");

    }

    setState(newState) {

        if (newState === this.currentState) {

            return;

        }

        this.previousState = this.currentState;

        this.currentState = newState;

        this.stateTime = 0;

    }

    is(state) {

        return this.currentState === state;

    }

    update(deltaTime, velocity, isGrounded = true) {

        this.stateTime += deltaTime;

        const speed = velocity.length();

        if (!isGrounded) {

            if (velocity.y > 0) {

                this.setState(

                    MovementStates.JUMPING

                );

            } else {

                this.setState(

                    MovementStates.FALLING

                );

            }

            return;

        }

        if (speed < 0.05) {

            this.setState(

                MovementStates.IDLE

            );

            return;

        }

        if (speed < 5) {

            this.setState(

                MovementStates.WALKING

            );

            return;

        }

        this.setState(

            MovementStates.RUNNING

        );

    }

    reset() {

        this.previousState = null;

        this.currentState = MovementStates.IDLE;

        this.stateTime = 0;

    }

}