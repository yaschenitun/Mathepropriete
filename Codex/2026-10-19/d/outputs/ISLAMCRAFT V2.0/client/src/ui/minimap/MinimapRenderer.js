export class MinimapRenderer {

    constructor(game) {

        this.game = game;

        this.visible = true;

        this.minimap = null;

    }

    async initialize() {

        this.minimap = this.game.minimap ?? null;

        console.log("MinimapRenderer initialisé.");

    }

    render() {

        if (!this.visible || !this.minimap) {

            return;

        }

        const markers = this.game.minimapMarkers
            ?.getAll?.() ?? [];

        const player = this.game.minimapPlayer;

        this.game.eventBus?.emit(

            "minimap:render",

            {

                center: this.minimap.getCenter?.(),

                zoom: this.minimap.getZoom?.(),

                player: player?.getPosition?.(),

                rotation: player?.getRotation?.(),

                markers

            }

        );

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

        this.render();

    }

}