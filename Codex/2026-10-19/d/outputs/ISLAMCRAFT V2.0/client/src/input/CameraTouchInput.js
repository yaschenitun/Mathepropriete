export class CameraTouchInput {

    constructor(game) {

        this.game = game;

        this.enabled = true;


        /*
         * Doigt utilisé pour la rotation.
         */

        this.pointerId = null;

        this.startX = 0;

        this.startY = 0;


        /*
         * Doigts utilisés pour le pinch.
         */

        this.pinchTouches = new Map();

        this.previousPinchDistance = null;


        /*
         * Sensibilité rotation.
         */

        this.sensitivity = 0.25;


        /*
         * Sensibilité zoom.
         */

        this.zoomSensitivity = 0.02;

    }


    async initialize() {

        window.addEventListener(
            "touchstart",
            this.onTouchStart.bind(this),
            {
                passive: false
            }
        );


        window.addEventListener(
            "touchmove",
            this.onTouchMove.bind(this),
            {
                passive: false
            }
        );


        window.addEventListener(
            "touchend",
            this.onTouchEnd.bind(this),
            {
                passive: false
            }
        );


        window.addEventListener(
            "touchcancel",
            this.onTouchEnd.bind(this),
            {
                passive: false
            }
        );


        console.log(
            "CameraTouchInput initialisé."
        );

    }


    onTouchStart(event) {

        if (!this.enabled) {

            return;

        }

        const target =
    event.target;

if (
    target?.closest?.(
        "#islamcraft-touch-joystick"
    )
) {

    return;

}


        for (
            const touch of event.changedTouches
        ) {

            this.pinchTouches.set(
                touch.identifier,
                {
                    x: touch.clientX,
                    y: touch.clientY
                }
            );

        }


        /*
         * Deux doigts :
         * début du pinch.
         */

        if (
            this.pinchTouches.size >= 2
        ) {

            this.previousPinchDistance =
                this.getPinchDistance();


            /*
             * On arrête la rotation
             * pendant le pinch.
             */

            this.pointerId = null;

            return;

        }


        /*
         * Un doigt :
         * rotation de caméra.
         */

        const touch =
            event.changedTouches[0];


        if (!touch) {

            return;

        }


        this.pointerId =
            touch.identifier;


        this.startX =
            touch.clientX;

        this.startY =
            touch.clientY;

    }


    onTouchMove(event) {

        if (!this.enabled) {

            return;

        }


        /*
         * Mise à jour des positions.
         */

        for (
            const touch of event.changedTouches
        ) {

            if (
                this.pinchTouches.has(
                    touch.identifier
                )
            ) {

                this.pinchTouches.set(
                    touch.identifier,
                    {
                        x: touch.clientX,
                        y: touch.clientY
                    }
                );

            }

        }


        /*
         * =========================
         * PINCH
         * =========================
         */

        if (
            this.pinchTouches.size >= 2
        ) {

            const currentDistance =
                this.getPinchDistance();


            if (
                this.previousPinchDistance !== null
            ) {

                const delta =
                    currentDistance -
                    this.previousPinchDistance;


                /*
                 * IMPORTANT :
                 *
                 * doigts qui s'écartent
                 * → caméra plus proche
                 *
                 * doigts qui se rapprochent
                 * → caméra plus loin
                 */

                this.game.cameraController?.zoom?.(
                    -delta *
                    this.zoomSensitivity
                );

            }


            this.previousPinchDistance =
                currentDistance;


            return;

        }


        /*
         * =========================
         * ROTATION
         * =========================
         */

        if (
            this.pointerId === null
        ) {

            return;

        }


        for (
            const touch of event.changedTouches
        ) {

            if (
                touch.identifier !==
                this.pointerId
            ) {

                continue;

            }


            const deltaX =
                (
                    touch.clientX -
                    this.startX
                ) *
                this.sensitivity;


            const deltaY =
                (
                    touch.clientY -
                    this.startY
                ) *
                this.sensitivity;


            this.game.cameraController?.rotate?.(
                deltaX,
                deltaY
            );


            this.startX =
                touch.clientX;

            this.startY =
                touch.clientY;

        }

    }


    onTouchEnd(event) {

        for (
            const touch of event.changedTouches
        ) {

            this.pinchTouches.delete(
                touch.identifier
            );


            if (
                touch.identifier ===
                this.pointerId
            ) {

                this.pointerId =
                    null;

            }

        }


        /*
         * Fin du pinch.
         */

        if (
            this.pinchTouches.size < 2
        ) {

            this.previousPinchDistance =
                null;

        }

    }


    getPinchDistance() {

        const touches =
            [...this.pinchTouches.values()];


        if (
            touches.length < 2
        ) {

            return 0;

        }


        const first =
            touches[0];

        const second =
            touches[1];


        return Math.hypot(
            second.x - first.x,
            second.y - first.y
        );

    }


    setEnabled(enabled) {

        this.enabled =
            Boolean(enabled);

    }


    isEnabled() {

        return this.enabled;

    }

}