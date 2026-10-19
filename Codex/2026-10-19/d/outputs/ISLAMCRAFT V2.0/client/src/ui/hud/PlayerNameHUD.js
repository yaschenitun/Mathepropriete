export class PlayerNameHUD {
    constructor(game) {
        this.game = game;

        this.visible = true;
        this.playerName = "";

        this.element = null;
    }

    async initialize() {
        this.createDOM();
        this.render();

        console.log("PlayerNameHUD initialisé.");
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
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "60vw",
            padding: "7px 14px",
            borderRadius: "10px",
            background:
                "rgba(0, 0, 0, 0.45)",
            border:
                "1px solid rgba(255,255,255,0.14)",
            color: "#ffffff",
            fontFamily:
                "Arial, Helvetica, sans-serif",
            fontSize: "15px",
            fontWeight: "700",
            pointerEvents: "none",
            zIndex: "1001",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textShadow:
                "0 1px 3px rgba(0,0,0,0.8)"
        });

        document.body.appendChild(element);

        this.element = element;

        this.applyVisibility();
    }

    setPlayerName(name) {
        this.playerName =
            typeof name === "string"
                ? name.trim()
                : "";

        this.render();

        this.game.eventBus?.emit(
            "hud:player-name-changed",
            this.playerName
        );
    }

    getPlayerName() {
        return this.playerName;
    }

    render() {
        if (!this.element) {
            return;
        }

        this.element.textContent =
            this.playerName
                ? this.playerName
                : "Joueur";
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