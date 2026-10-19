export class MinimapPlayer {

    constructor(game) {

        this.game = game;

        this.visible = true;

        this.position = {

            x: 0,

            y: 0

        };

        this.rotation = 0;

    }

    async initialize() {

        console.log("MinimapPlayer initialisé.");

    }

    setPosition(x, y) {

        this.position.x = Number(x) || 0;

        this.position.y = Number(y) || 0;

    }

    setRotation(rotation) {

        this.rotation = Number(rotation) || 0;

    }

    updateFromPlayer(player) {

        if (!player) {

            return;

        }

        if (player.position) {

            this.setPosition(

                player.position.x,

                player.position.z

            );

        }

        if (player.rotation) {

            this.setRotation(

                player.rotation.y ?? 0

            );

        }

    }

    getPosition() {

        return {

            x: this.position.x,

            y: this.position.y

        };

    }

    getRotation() {

        return this.rotation;

    }

    show() {

        this.visible = true;

    }

    hide() {

        this.visible = false;

    }

    isVisible() {

        return this.visible;

    }

    update(deltaTime) {

        if (!this.visible) {

            return;

        }

        this.updateFromPlayer(

            this.game.localPlayer

        );

    }

}