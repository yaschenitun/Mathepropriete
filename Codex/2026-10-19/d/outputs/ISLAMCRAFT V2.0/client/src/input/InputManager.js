export class InputManager {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.keyboardInput = null;

        this.touchInput = null;

        this.cameraTouchInput = null;

        this.touchJoystick = null;

        this.inputState = null;

    }

    async initialize() {

        this.keyboardInput ??= this.game.keyboardInput;

        this.touchInput ??= this.game.touchInput;

        this.cameraTouchInput ??= this.game.cameraTouchInput;

        this.touchJoystick ??= this.game.touchJoystick;

        this.inputState ??= this.game.inputState;

        console.log("InputManager initialisé.");

    }

    update(deltaTime) {

        if (!this.enabled) {

            return;

        }

        this.keyboardInput?.update?.(deltaTime);

        this.touchInput?.update?.(deltaTime);

        this.cameraTouchInput?.update?.(deltaTime);

        this.touchJoystick?.update?.(deltaTime);

    }

    enable() {

        this.enabled = true;

    }

    disable() {

        this.enabled = false;

    }

    isEnabled() {

        return this.enabled;

    }

    getState() {
        return this.inputState;
    }

    getMovement() {

    if (!this.inputState) {

        return null;

    }


    /*
     * ==================================================
     * JOYSTICK
     * ==================================================
     */

    const joystickX =
        Number(
            this.inputState.joystickX
        ) || 0;


    const joystickY =
        Number(
            this.inputState.joystickY
        ) || 0;


    /*
     * Le joystick est prioritaire
     * lorsqu'il est utilisé.
     */

    const joystickMagnitude =
        Math.hypot(
            joystickX,
            joystickY
        );


    if (
        joystickMagnitude > 0.05
    ) {

        return {

            forward:
                -joystickY,

            right:
                joystickX

        };

    }


    /*
     * ==================================================
     * CLAVIER
     * ==================================================
     *
     * On conserve entièrement
     * le fonctionnement PC.
     */

    return {

        forward:
            (
                this.inputState.moveForward
                    ? 1
                    : 0
            ) -
            (
                this.inputState.moveBackward
                    ? 1
                    : 0
            ),

        right:
    (
        this.inputState.moveRight
            ? 1
            : 0
    ) -
    (
        this.inputState.moveLeft
            ? 1
            : 0
    )

    };

}

    reset() {
        this.inputState?.reset?.();
    }

}