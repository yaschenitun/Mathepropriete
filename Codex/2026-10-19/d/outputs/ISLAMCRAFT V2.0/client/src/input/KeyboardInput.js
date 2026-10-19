export class KeyboardInput {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.state = null;

        this.keys = new Set();

    }

    async initialize() {

        this.state = this.game.inputState;

        window.addEventListener(

            "keydown",

            this.onKeyDown.bind(this)

        );

        window.addEventListener(

            "keyup",

            this.onKeyUp.bind(this)

        );


        console.log("KeyboardInput initialisé.");

    }

    onKeyDown(event) {

        if (!this.enabled) {

            return;

        }

        this.keys.add(event.code);

        this.updateMovement();

    }

    onKeyUp(event) {

        this.keys.delete(event.code);

        this.updateMovement();

    }

    

    updateMovement() {

        this.state?.setMovement(
    this.keys.has("KeyW") ||
    this.keys.has("ArrowUp"),

    this.keys.has("KeyS") ||
    this.keys.has("ArrowDown"),

    this.keys.has("KeyA") ||
    this.keys.has("ArrowLeft"),

    this.keys.has("KeyD") ||
    this.keys.has("ArrowRight")
);

        this.state.jump = this.keys.has("Space");

        this.state.sprint =

            this.keys.has("ShiftLeft") ||

            this.keys.has("ShiftRight");

        this.state.crouch =

            this.keys.has("ControlLeft") ||

            this.keys.has("ControlRight");

        this.state.interact =

            this.keys.has("KeyE");

    }

    update(deltaTime) {

        // Réservé pour les traitements continus

    }

    setEnabled(enabled) {

        this.enabled = enabled;

    }

}