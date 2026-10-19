export class Minimap {

    constructor(game) {

        this.game = game;

        this.visible = true;

        this.zoom = 1;

        this.center = {

            x: 0,

            y: 0

        };

        this.markers = [];

    }

    async initialize() {

        console.log("Minimap initialisée.");

    }

    setCenter(x, y) {

        this.center.x = Number(x) || 0;

        this.center.y = Number(y) || 0;

    }

    getCenter() {

        return {

            x: this.center.x,

            y: this.center.y

        };

    }

    setZoom(zoom) {

        this.zoom = Math.max(

            0.1,

            Number(zoom) || 1

        );

    }

    getZoom() {

        return this.zoom;

    }

    setMarkers(markers) {

        this.markers = Array.isArray(markers)

            ? [...markers]

            : [];

    }

    addMarker(marker) {

        if (!marker) {

            return;

        }

        this.markers.push(marker);

    }

    removeMarker(markerId) {

        this.markers = this.markers.filter(

            marker => marker?.id !== markerId

        );

    }

    getMarkers() {

        return [...this.markers];

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

    }

}