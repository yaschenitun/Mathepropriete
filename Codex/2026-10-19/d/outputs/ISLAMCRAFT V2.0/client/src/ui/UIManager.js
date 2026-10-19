export class UIManager {
    constructor(game) {
        this.game = game;

        this.components = new Map();

        this.initialized = false;
    }

    async initialize() {
        this.register(
            "hud",
            this.game.hud
        );

        this.register(
            "lobby",
            this.game.lobbyUI
        );

        this.register(
            "minimap",
            this.game.minimap
        );

        this.register(
            "victory",
            this.game.victoryScreen
        );

        this.register(
            "defeat",
            this.game.defeatScreen
        );

        this.register(
            "loading",
            this.game.loadingScreen
        );

        this.register(
            "restart",
            this.game.restartScreen
        );

        this.initialized = true;

        console.log(
            "UIManager initialisé."
        );
    }

    register(name, component) {
        if (!name || !component) {
            return;
        }

        this.components.set(
            name,
            component
        );
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

    show(name, data = null) {
        const component =
            this.get(name);

        component?.show?.(data);
    }

    hide(name) {
        const component =
            this.get(name);

        component?.hide?.();
    }

    update(deltaTime) {
        for (
            const component
            of this.components.values()
        ) {
            component?.update?.(
                deltaTime
            );
        }
    }

    showGameplay() {
        this.show("hud");

        this.game.minimap?.show?.();

        this.game.interactionPrompt?.show?.();
    }

    hideGameplay() {
        this.hide("hud");

        this.game.minimap?.hide?.();

        this.game.interactionPrompt?.hide?.();

        this.game.lootPresentation?.clear?.();
    }

    updateScore(
        score,
        bestScore = null
    ) {
        const hud =
            this.game.hud;

        if (!hud) {
            return;
        }

        const scoreHUD =
            hud.get?.("score");

        if (
            scoreHUD &&
            typeof scoreHUD.setScore ===
                "function"
        ) {
            scoreHUD.setScore(
                score
            );
        }

        this.game.eventBus?.emit?.(
            "hud:score-updated",
            {
                score,
                bestScore
            }
        );
    }

    updateXP(
        currentXP,
        requiredXP
    ) {
        const hud =
            this.game.hud;

        if (!hud) {
            return;
        }

        const xpBar =
            hud.get?.("xp");

        if (
            xpBar &&
            typeof xpBar.setXP ===
                "function"
        ) {
            xpBar.setXP(
                currentXP,
                requiredXP
            );
        }
    }

    updateLevel(level) {
        const hud =
            this.game.hud;

        if (!hud) {
            return;
        }

        const levelDisplay =
            hud.get?.("level");

        if (
            levelDisplay &&
            typeof levelDisplay.setLevel ===
                "function"
        ) {
            levelDisplay.setLevel(
                level
            );
        }
    }

    updatePlayerName(name) {
        const hud =
            this.game.hud;

        if (!hud) {
            return;
        }

        const playerNameHUD =
            hud.get?.("playerName");

        if (
            playerNameHUD &&
            typeof playerNameHUD.setPlayerName ===
                "function"
        ) {
            playerNameHUD.setPlayerName(
                name
            );
        }
    }

    showLootReward(reward) {
        const rewardPopup =
            this.game.rewardPopup;

        rewardPopup?.show?.(
            reward
        );
    }

    hideLootReward() {
        const rewardPopup =
            this.game.rewardPopup;

        rewardPopup?.hide?.();
    }

    showVictoryScreen(data = null) {
        this.show(
            "victory",
            data
        );
    }

    hideVictoryScreen() {
        this.hide(
            "victory"
        );
    }

    showDefeatScreen(data = null) {
        this.show(
            "defeat",
            data
        );
    }

    hideDefeatScreen() {
        this.hide(
            "defeat"
        );
    }

    showRestartScreen(data = null) {
        this.show(
            "restart",
            data
        );
    }

    hideRestartScreen() {
        this.hide(
            "restart"
        );
    }

    showLobby(data = null) {
        this.show(
            "lobby",
            data
        );
    }

    hideLobby() {
        this.hide(
            "lobby"
        );
    }

    showMinimap(data = null) {
        this.show(
            "minimap",
            data
        );
    }

    hideMinimap() {
        this.hide(
            "minimap"
        );
    }

    showLoading(data = null) {
        this.show(
            "loading",
            data
        );
    }

    hideLoading() {
        this.hide(
            "loading"
        );
    }

    isInitialized() {
        return this.initialized;
    }
}