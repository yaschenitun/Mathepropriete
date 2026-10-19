export class DefeatScreen {

    constructor(game) {

        this.game = game;

        this.visible = false;

        this.data = null;

    }

    async initialize() {

        console.log("DefeatScreen initialisé.");

    }

    show(data = null) {

        this.data = data;

        this.visible = true;

        this.game.eventBus?.emit(

            "screen:defeat-shown",

            data

        );

    }

    hide() {

        this.visible = false;

        this.data = null;

        this.game.eventBus?.emit(

            "screen:defeat-hidden"

        );

    }

    getData() {

        return this.data;

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