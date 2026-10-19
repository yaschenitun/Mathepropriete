export class UsernameInput {

    constructor(game) {

        this.game = game;

        this.value = "";

        this.enabled = true;

        this.visible = true;

        this.maxLength = 16;

    }

    async initialize() {

        console.log("UsernameInput initialisé.");

    }

    setValue(value) {

        if (!this.enabled) {

            return;

        }

        this.value = String(value ?? "")

            .slice(0, this.maxLength);

        this.game.eventBus?.emit(

            "lobby:username-changed",

            this.value

        );

    }

    getValue() {

        return this.value;

    }

    clear() {

        this.setValue("");

    }

    isValid() {

        const username = this.value.trim();

        return username.length >= 3;

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