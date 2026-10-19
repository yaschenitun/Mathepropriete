export class XPBar {
    constructor(game) {
        this.game = game;

        this.visible = true;

        this.currentXP = 0;
        this.requiredXP = 100;

        this.container = null;
        this.textElement = null;
        this.fillElement = null;
    }

    async initialize() {
        this.createDOM();
        this.render();

        console.log("XPBar initialisée.");
    }

    createDOM() {
        if (this.container) {
            return;
        }

        const container =
            document.createElement("div");

        Object.assign(container.style, {
            position: "absolute",
            left: "50%",
            bottom: "18px",
            transform: "translateX(-50%)",
            width: "min(420px, 55vw)",
            pointerEvents: "none",
            zIndex: "1001",
            fontFamily:
                "Arial, Helvetica, sans-serif",
            color: "#ffffff",
            textShadow:
                "0 1px 3px rgba(0,0,0,0.8)"
        });

        const text =
            document.createElement("div");

        Object.assign(text.style, {
            textAlign: "center",
            fontSize: "13px",
            fontWeight: "700",
            marginBottom: "5px"
        });

        text.textContent = "XP : 0 / 100";

        const background =
            document.createElement("div");

        Object.assign(background.style, {
            width: "100%",
            height: "12px",
            borderRadius: "999px",
            overflow: "hidden",
            background:
                "rgba(0,0,0,0.58)",
            border:
                "1px solid rgba(255,255,255,0.2)"
        });

        const fill =
            document.createElement("div");

        Object.assign(fill.style, {
            width: "0%",
            height: "100%",
            borderRadius: "999px",
            background:
                "linear-gradient(90deg, #d4af37, #f4d675)",
            transition:
                "width 180ms ease-out"
        });

        background.appendChild(fill);

        container.appendChild(text);
        container.appendChild(background);

        document.body.appendChild(container);

        this.container = container;
        this.textElement = text;
        this.fillElement = fill;

        this.applyVisibility();
    }

    setXP(
        currentXP,
        requiredXP = this.requiredXP
    ) {
        this.currentXP = Math.max(
            0,
            Number(currentXP) || 0
        );

        this.requiredXP = Math.max(
            1,
            Number(requiredXP) || 1
        );

        this.render();

        this.game.eventBus?.emit(
            "hud:xp-changed",
            {
                currentXP: this.currentXP,
                requiredXP: this.requiredXP
            }
        );
    }

    addXP(amount) {
        this.setXP(
            this.currentXP +
            (Number(amount) || 0),
            this.requiredXP
        );
    }

    getProgress() {
        return Math.min(
            this.currentXP /
            this.requiredXP,
            1
        );
    }

    getXP() {
        return this.currentXP;
    }

    getRequiredXP() {
        return this.requiredXP;
    }

    render() {
        if (!this.textElement || !this.fillElement) {
            return;
        }

        const progress =
            this.getProgress();

        this.textElement.textContent =
            `XP : ${this.currentXP} / ${this.requiredXP}`;

        this.fillElement.style.width =
            `${progress * 100}%`;
    }

    show() {
        this.visible = true;
        this.applyVisibility();
    }

    hide() {
        this.visible = false;
        this.applyVisibility();
    }

    applyVisibility() {
        if (!this.container) {
            return;
        }

        this.container.style.display =
            this.visible
                ? "block"
                : "none";
    }

    isVisible() {
        return this.visible;
    }

    update(deltaTime) {
        if (!this.visible) {
            return;
        }
    }

    destroy() {
        if (this.container?.parentNode) {
            this.container.parentNode.removeChild(
                this.container
            );
        }

        this.container = null;
        this.textElement = null;
        this.fillElement = null;
    }
}