export class HUD {
    constructor(game) {
        this.game = game;

        this.visible = true;
        this.components = new Map();

        this.container = null;
        this.playerNameElement = null;
        this.scoreElement = null;
        this.levelElement = null;
        this.xpTextElement = null;
        this.xpFillElement = null;

        this.boundHandlers = [];
    }

    async initialize() {
        this.createDOM();
        this.bindEvents();
        this.refreshFromComponents();

        console.log("HUD initialisé.");
    }

    createDOM() {
        if (this.container) {
            return;
        }

        const container = document.createElement("div");

        container.id = "islamcraft-hud";

        Object.assign(container.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: "1000",
            fontFamily:
                "Arial, Helvetica, sans-serif",
            boxSizing: "border-box"
        });

        const panel = document.createElement("div");

        Object.assign(panel.style, {
            position: "absolute",
            top: "16px",
            left: "16px",
            minWidth: "230px",
            padding: "12px 14px",
            borderRadius: "14px",
            background:
                "rgba(0, 0, 0, 0.58)",
            border:
                "1px solid rgba(255,255,255,0.18)",
            color: "#ffffff",
            boxSizing: "border-box",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            textShadow:
                "0 1px 3px rgba(0,0,0,0.8)"
        });

        const playerName = document.createElement("div");

        Object.assign(playerName.style, {
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "8px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "300px"
        });

        playerName.textContent = "Joueur";

        const score = document.createElement("div");

        Object.assign(score.style, {
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "4px"
        });

        score.textContent = "Score : 0";

        const level = document.createElement("div");

        Object.assign(level.style, {
            fontSize: "15px",
            fontWeight: "600",
            marginBottom: "8px"
        });

        level.textContent = "Niveau : 1";

        const xpText = document.createElement("div");

        Object.assign(xpText.style, {
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "5px"
        });

        xpText.textContent = "XP : 0 / 100";

        const xpBackground =
            document.createElement("div");

        Object.assign(xpBackground.style, {
            width: "100%",
            height: "10px",
            borderRadius: "999px",
            background:
                "rgba(255,255,255,0.18)",
            overflow: "hidden"
        });

        const xpFill =
            document.createElement("div");

        Object.assign(xpFill.style, {
            width: "0%",
            height: "100%",
            borderRadius: "999px",
            background:
                "linear-gradient(90deg, #d4af37, #f4d675)",
            transition:
                "width 180ms ease-out"
        });

        xpBackground.appendChild(xpFill);

        panel.appendChild(playerName);
        panel.appendChild(score);
        panel.appendChild(level);
        panel.appendChild(xpText);
        panel.appendChild(xpBackground);

        container.appendChild(panel);

        document.body.appendChild(container);

        this.container = container;
        this.playerNameElement = playerName;
        this.scoreElement = score;
        this.levelElement = level;
        this.xpTextElement = xpText;
        this.xpFillElement = xpFill;

        this.applyVisibility();
    }

    bindEvents() {
        const eventBus = this.game?.eventBus;

        if (!eventBus?.on) {
            return;
        }

        const events = [
            [
                "hud:player-name-changed",
                value => {
                    this.updatePlayerName(value);
                }
            ],
            [
                "hud:score-changed",
                value => {
                    this.updateScore(value);
                }
            ],
            [
                "hud:level-changed",
                value => {
                    this.updateLevel(value);
                }
            ],
            [
                "hud:xp-changed",
                value => {
                    this.updateXP(value);
                }
            ]
        ];

        for (const [eventName, handler] of events) {
            eventBus.on(eventName, handler);
            this.boundHandlers.push([
                eventName,
                handler
            ]);
        }
    }

    unregisterEvents() {
        const eventBus = this.game?.eventBus;

        if (!eventBus) {
            return;
        }

        for (const [eventName, handler] of this.boundHandlers) {
            if (typeof eventBus.off === "function") {
                eventBus.off(
                    eventName,
                    handler
                );
            }

            if (typeof eventBus.removeListener === "function") {
                eventBus.removeListener(
                    eventName,
                    handler
                );
            }
        }

        this.boundHandlers.length = 0;
    }

    refreshFromComponents() {
        const playerName =
            this.get("playerName") ??
            this.get("player-name");

        const score =
            this.get("score");

        const level =
            this.get("level");

        const xp =
            this.get("xp");

        if (playerName?.getPlayerName) {
            this.updatePlayerName(
                playerName.getPlayerName()
            );
        }

        if (score?.getScore) {
            this.updateScore(
                score.getScore()
            );
        }

        if (level?.getLevel) {
            this.updateLevel(
                level.getLevel()
            );
        }

        if (xp?.getXP) {
            this.updateXP({
                currentXP: xp.getXP(),
                requiredXP:
                    xp.getRequiredXP?.() ?? 100
            });
        }
    }

    updatePlayerName(name) {
        if (!this.playerNameElement) {
            return;
        }

        const value =
            typeof name === "string" &&
            name.trim().length > 0
                ? name.trim()
                : "Joueur";

        this.playerNameElement.textContent =
            value;
    }

    updateScore(score) {
        if (!this.scoreElement) {
            return;
        }

        const value = Math.max(
            0,
            Number(score) || 0
        );

        this.scoreElement.textContent =
            `Score : ${value}`;
    }

    updateLevel(level) {
        if (!this.levelElement) {
            return;
        }

        const value = Math.max(
            1,
            Number(level) || 1
        );

        this.levelElement.textContent =
            `Niveau : ${value}`;
    }

    updateXP(data) {
        if (!this.xpTextElement || !this.xpFillElement) {
            return;
        }

        const currentXP = Math.max(
            0,
            Number(data?.currentXP) || 0
        );

        const requiredXP = Math.max(
            1,
            Number(data?.requiredXP) || 1
        );

        const progress = Math.max(
            0,
            Math.min(
                1,
                currentXP / requiredXP
            )
        );

        this.xpTextElement.textContent =
            `XP : ${currentXP} / ${requiredXP}`;

        this.xpFillElement.style.width =
            `${progress * 100}%`;
    }

    register(name, component) {
        if (!name || !component) {
            return;
        }

        this.components.set(
            name,
            component
        );

        this.refreshFromComponents();
    }

    unregister(name) {
        this.components.delete(name);
    }

    get(name) {
        return (
            this.components.get(name) ??
            null
        );
    }

    show() {
        this.visible = true;
        this.applyVisibility();

        for (const component of this.components.values()) {
            component.show?.();
        }
    }

    hide() {
        this.visible = false;
        this.applyVisibility();

        for (const component of this.components.values()) {
            component.hide?.();
        }
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

    update(deltaTime) {
        if (!this.visible) {
            return;
        }

        for (const component of this.components.values()) {
            component.update?.(deltaTime);
        }
    }

    isVisible() {
        return this.visible;
    }

    destroy() {
        this.unregisterEvents();

        for (const component of this.components.values()) {
            component.destroy?.();
        }

        this.components.clear();

        if (this.container?.parentNode) {
            this.container.parentNode.removeChild(
                this.container
            );
        }

        this.container = null;
        this.playerNameElement = null;
        this.scoreElement = null;
        this.levelElement = null;
        this.xpTextElement = null;
        this.xpFillElement = null;
    }
}