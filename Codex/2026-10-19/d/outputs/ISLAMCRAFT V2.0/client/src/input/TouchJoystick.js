export class TouchJoystick {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.inputState = null;

        this.pointerId = null;

        this.centerX = 0;
        this.centerY = 0;

        this.radius = 70;

        this.currentX = 0;
        this.currentY = 0;

        this.base = null;
        this.knob = null;

    }


    async initialize() {

        this.inputState =
            this.game.inputState;


        this.createUI();

        this.installInput();


        console.log(
            "TouchJoystick initialisé."
        );

    }


    createUI() {

        if (
            document.getElementById(
                "islamcraft-touch-joystick"
            )
        ) {

            return;

        }


        /*
         * CONTENEUR DU JOYSTICK
         */

        const base =
            document.createElement(
                "div"
            );


        base.id =
            "islamcraft-touch-joystick";


        base.style.position =
            "fixed";

        base.style.left =
            "28px";

        base.style.bottom =
            "28px";

        base.style.width =
            "150px";

        base.style.height =
            "150px";

        base.style.borderRadius =
            "50%";

        base.style.background =
            "rgba(255,255,255,0.18)";

        base.style.border =
            "3px solid rgba(255,255,255,0.45)";

        base.style.boxSizing =
            "border-box";

        base.style.zIndex =
            "900";

        base.style.touchAction =
            "none";

        base.style.userSelect =
            "none";

        base.style.webkitUserSelect =
            "none";


        /*
         * EMPÊCHER LES TOUCHES DU JOYSTICK
         * DE PASSER AUX AUTRES SYSTÈMES.
         */

        base.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                event.stopPropagation();

            }
        );


        /*
         * BOUTON CENTRAL
         */

        const knob =
            document.createElement(
                "div"
            );


        knob.style.position =
            "absolute";

        knob.style.left =
            "50%";

        knob.style.top =
            "50%";

        knob.style.width =
            "68px";

        knob.style.height =
            "68px";

        knob.style.transform =
            "translate(-50%, -50%)";

        knob.style.borderRadius =
            "50%";

        knob.style.background =
            "rgba(255,255,255,0.42)";

        knob.style.border =
            "3px solid rgba(255,255,255,0.75)";

        knob.style.boxSizing =
            "border-box";

        knob.style.pointerEvents =
            "none";


        base.appendChild(
            knob
        );


        document.body.appendChild(
            base
        );


        this.base =
            base;

        this.knob =
            knob;

    }


    installInput() {

        if (!this.base) {

            return;

        }


        this.base.addEventListener(
            "pointerdown",
            event => {

                if (!this.enabled) {

                    return;

                }


                if (
                    this.pointerId !== null
                ) {

                    return;

                }


                event.preventDefault();
                event.stopPropagation();


                this.pointerId =
                    event.pointerId;


                const rect =
                    this.base.getBoundingClientRect();


                this.centerX =
                    rect.left +
                    rect.width / 2;


                this.centerY =
                    rect.top +
                    rect.height / 2;


                this.currentX =
                    event.clientX;

                this.currentY =
                    event.clientY;


                try {

                    this.base.setPointerCapture(
                        event.pointerId
                    );

                } catch {

                    // Certains appareils
                    // peuvent ne pas supporter
                    // correctement setPointerCapture.

                }


                this.updateFromPointer(
                    event.clientX,
                    event.clientY
                );

            }
        );


        this.base.addEventListener(
            "pointermove",
            event => {

                if (
                    !this.enabled ||
                    event.pointerId !==
                        this.pointerId
                ) {

                    return;

                }


                event.preventDefault();
                event.stopPropagation();


                this.updateFromPointer(
                    event.clientX,
                    event.clientY
                );

            }
        );


        const endPointer =
            event => {

                if (
                    event.pointerId !==
                    this.pointerId
                ) {

                    return;

                }


                event.preventDefault();
                event.stopPropagation();


                this.end(
                    event.pointerId
                );

            };


        this.base.addEventListener(
            "pointerup",
            endPointer
        );


        this.base.addEventListener(
            "pointercancel",
            endPointer
        );


        this.base.addEventListener(
            "lostpointercapture",
            event => {

                if (
                    event.pointerId ===
                    this.pointerId
                ) {

                    this.end(
                        event.pointerId
                    );

                }

            }
        );

    }


    updateFromPointer(
        x,
        y
    ) {

        const dx =
            x -
            this.centerX;


        const dy =
            y -
            this.centerY;


        const distance =
            Math.hypot(
                dx,
                dy
            );


        let normalizedX =
            0;

        let normalizedY =
            0;


        if (
            distance > 0
        ) {

            const limitedDistance =
                Math.min(
                    distance,
                    this.radius
                );


            const factor =
                limitedDistance /
                distance;


            normalizedX =
                (
                    dx *
                    factor
                ) /
                this.radius;


            normalizedY =
                (
                    dy *
                    factor
                ) /
                this.radius;

        }


        this.currentX =
            x;

        this.currentY =
            y;


        /*
         * Mise à jour de l'état global.
         */

        this.inputState?.setJoystick(
            normalizedX,
            normalizedY
        );


        /*
         * Déplacer visuellement
         * le bouton central.
         */

        if (this.knob) {

            const knobX =
                normalizedX *
                this.radius;


            const knobY =
                normalizedY *
                this.radius;


            this.knob.style.transform =
                `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;

        }

    }


    end(pointerId) {

        if (
            pointerId !==
            this.pointerId
        ) {

            return;

        }


        this.pointerId =
            null;


        this.inputState?.setJoystick(
            0,
            0
        );


        /*
         * Replacer le bouton
         * au centre.
         */

        if (this.knob) {

            this.knob.style.transform =
                "translate(-50%, -50%)";

        }

    }


    update(deltaTime) {

        /*
         * Rien à faire ici pour le moment.
         *
         * Le joystick fonctionne
         * directement avec les événements
         * pointer.
         */

    }


    setEnabled(enabled) {

        this.enabled =
            Boolean(enabled);


        if (!this.enabled) {

            this.end(
                this.pointerId
            );

        }


        if (this.base) {

            this.base.style.display =
                this.enabled
                    ? "block"
                    : "none";

        }

    }


    isEnabled() {

        return this.enabled;

    }

}