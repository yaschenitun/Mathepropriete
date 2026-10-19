export class TouchInput {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.inputState = null;

        this.activeTouches = new Map();

    }

    async initialize() {

        this.inputState = this.game.inputState;

        window.addEventListener(

            "touchstart",

            this.onTouchStart.bind(this),

            { passive: false }

        );

        window.addEventListener(

            "touchmove",

            this.onTouchMove.bind(this),

            { passive: false }

        );

        window.addEventListener(

            "touchend",

            this.onTouchEnd.bind(this),

            { passive: false }

        );

        window.addEventListener(

            "touchcancel",

            this.onTouchEnd.bind(this),

            { passive: false }

        );

        console.log("TouchInput initialisé.");

    }

    onTouchStart(event) {

        if (!this.enabled) {

            return;

        }

        for (const touch of event.changedTouches) {

            this.activeTouches.set(

                touch.identifier,

                {

                    x: touch.clientX,

                    y: touch.clientY

                }

            );

        }

    }

    onTouchMove(event) {

        if (!this.enabled) {

            return;

        }

        for (const touch of event.changedTouches) {

            if (!this.activeTouches.has(touch.identifier)) {

                continue;

            }

            this.activeTouches.set(

                touch.identifier,

                {

                    x: touch.clientX,

                    y: touch.clientY

                }

            );

        }

    }

    onTouchEnd(event) {

        for (const touch of event.changedTouches) {

            this.activeTouches.delete(

                touch.identifier

            );

        }

    }

    update(deltaTime) {

        // Les gestes tactiles seront interprétés
        // par TouchJoystick et CameraTouchInput.

    }

    setEnabled(enabled) {

        this.enabled = enabled;

    }

    isEnabled() {

        return this.enabled;

    }

}