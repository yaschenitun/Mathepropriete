export class JoinButton {

    constructor(game) {

        this.game = game;

        this.enabled = true;

        this.visible = true;

    }

    async initialize() {

        console.log("JoinButton initialisé.");

    }

    click() {

        if (!this.enabled || !this.visible) {

            return;

        }

        this.game.eventBus?.emit(

            "lobby:join-requested"

        );

    }

    enable() {

        this.enabled = true;

    }

    disable() {

        this.enabled = false;

    }

    show() {

        this.visible = true;

    }

    hide() {

        this.visible = false;

    }

    isEnabled() {

        return this.enabled;

    }

    isVisible() {

        return this.visible;

    }

    update(deltaTime) {

        if (!this.visible) {

            return;

        }

    }

}