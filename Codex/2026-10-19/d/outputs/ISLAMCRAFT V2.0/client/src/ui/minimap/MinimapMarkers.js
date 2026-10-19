export class MinimapMarkers {

    constructor(game) {

        this.game = game;

        this.markers = new Map();

        this.visible = true;

    }

    async initialize() {

        console.log("MinimapMarkers initialisé.");

    }

    add(marker) {

        if (!marker || marker.id === undefined) {

            return;

        }

        this.markers.set(

            marker.id,

            { ...marker }

        );

    }

    remove(markerId) {

        this.markers.delete(markerId);

    }

    update(markerId, data) {

        if (!this.markers.has(markerId)) {

            return;

        }

        const marker = this.markers.get(markerId);

        this.markers.set(

            markerId,

            {

                ...marker,

                ...data

            }

        );

    }

    clear() {

        this.markers.clear();

    }

    get(markerId) {

        return this.markers.get(markerId) ?? null;

    }

    getAll() {

        return [...this.markers.values()];

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

    updateDisplay(deltaTime) {

        if (!this.visible) {

            return;

        }

    }

}