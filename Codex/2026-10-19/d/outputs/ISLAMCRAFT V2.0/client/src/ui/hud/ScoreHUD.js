export class ScoreHUD {
    constructor(game) {
        this.game = game;

        this.visible = true;
        this.score = 0;

        this.element = null;
    }

    async initialize() {
        this.createDOM();
        this.render();

        console.log("ScoreHUD initialisé.");
    }

    createDOM() {
        if (this.element) {
            return;
        }

        const element =
            document.createElement("div");

        Object.assign(element.style, {
            position: "absolute",
            top: "16px",
            right: "16px",
            padding: "9px 14px",
            borderRadius: "12px",
            background:
                "rgba(0, 0, 0, 0.58)",
            border:
                "1px solid rgba(255,255,255,0.18)",
            color: "#ffffff",
            fontFamily:
                "Arial, Helvetica, sans-serif",
            fontSize: "16px",
            fontWeight: "700",
            pointerEvents: "none",
            zIndex: "1001",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            textShadow:
                "0 1px 3px rgba(0,0,0,0.8)"
        });

        element.textContent = "Score : 0";

        document.body.appendChild(element);

        this.element = element;

        this.applyVisibility();
    }

    setScore(score) {
        this.score = Math.max(
            0,
            Number(score) || 0
        );

        this.render();

        this.game.eventBus?.emit(
            "hud:score-changed",
            this.score
        );
    }

    addScore(amount) {
        this.setScore(
            this.score +
            (Number(amount) || 0)
        );
    }

    getScore() {
        return this.score;
    }

    render() {
        if (!this.element) {
            return;
        }

        this.element.textContent =
            `Score : ${this.score}`;
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