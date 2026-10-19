export class InteractionPrompt {

    constructor(game) {

        this.game = game;

        this.target = null;

        this.visible = false;

        this.element = null;

    }

    async initialize() {

        this.element = document.createElement("div");

        this.element.id = "interactionPrompt";

        this.element.style.position = "absolute";
        this.element.style.bottom = "12%";
        this.element.style.left = "50%";
        this.element.style.transform = "translateX(-50%)";

        this.element.style.padding = "12px 20px";

        this.element.style.borderRadius = "10px";

        this.element.style.background = "rgba(0,0,0,0.75)";

        this.element.style.color = "white";

        this.element.style.fontFamily = "Arial";

        this.element.style.fontSize = "18px";

        this.element.style.display = "none";

        this.element.style.pointerEvents = "none";

        this.element.style.zIndex = "1000";

        document.body.appendChild(this.element);

        console.log("InteractionPrompt initialisé.");

    }

    setTarget(target) {

        this.target = target;

        if (!target) {

            this.hide();

            return;

        }

        this.show(

            target.displayName ||

            "Interagir"

        );

    }

    show(label) {

        this.visible = true;

        this.element.style.display = "block";

        const mobile =

            "ontouchstart" in window;

        const key = mobile ? "👆" : "[E]";

        this.element.innerHTML =

            `${key} ${label}`;

    }

    hide() {

        this.visible = false;

        this.target = null;

        this.element.style.display = "none";

    }

    update(deltaTime) {

        if (!this.visible) {

            return;

        }

        // Futures animations :
        // Fade In
        // Fade Out
        // Pulse
        // Icônes

    }

}