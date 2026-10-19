export class LevelDisplay {
    constructor(game) {
        this.game = game;

        this.visible = true;
        this.level = 1;

        this.element = null;
    }

    async initialize() {
        this.createDOM();
        this.render();

        console.log("LevelDisplay initialisé.");
    }

    createDOM() {
        if (this.element) {
            return;
        }

        const element =
            document.createElement("div");

        Object.assign(element.style, {
            position: "absolute",
            top: "64px",
            right: "16px",
            padding: "7px 12px",
            borderRadius: "10px",
            background:
                "rgba(0, 0, 0, 0.52)",
            border:
                "1px solid rgba(255,255,255,0.16)",
            color: "#ffffff",
            fontFamily:
                "Arial, Helvetica, sans-serif",
            fontSize: "14px",
            fontWeight: "700",
            pointerEvents: "none",
            zIndex: "1001",
            textShadow:
                "0 1px 3px rgba(0,0,0,0.8)"
        });

        document.body.appendChild(element);

        this.element = element;

        this.applyVisibility();
    }

    setLevel(level) {
        this.level = Math.max(
            1,
            Number(level) || 1
        );

        this.render();

        this.game.eventBus?.emit(
            "hud:level-changed",
            this.level
        );
    }

    getLevel() {
        return this.level;
    }

    render() {
        if (!this.element) {
            return;
        }

        this.element.textContent =
            `Niveau : ${this.level}`;
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
        if (!this.element) {
            return;
        }

        this.element.style.display =
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
        if (this.element?.parentNode) {
            this.element.parentNode.removeChild(
                this.element
            );
        }

        this.element = null;
    }
}