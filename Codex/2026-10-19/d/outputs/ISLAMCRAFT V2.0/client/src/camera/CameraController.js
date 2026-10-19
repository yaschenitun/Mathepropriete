export class CameraController {

    constructor(game) {

        this.game = game;

        this.camera = null;

        this.target = null;

        this.orbit = null;

        this.enabled = true;

    }

    async initialize() {

        this.camera =
            this.game.scene?.getCamera?.() ?? null;

        this.target =
            this.game.localPlayer ?? null;

        this.orbit =
            this.game.cameraOrbit ?? null;

        console.log(
            "CameraController initialisé."
        );

    }

    setCamera(camera) {

        this.camera = camera;

    }

    setTarget(target) {

        this.target = target;

    }

    setOrbit(orbit) {

        this.orbit = orbit;

    }

    rotate(deltaYaw, deltaPitch) {

        if (!this.enabled) {
            return;
        }

        if (!this.orbit) {
            return;
        }

        this.orbit.rotate(
            deltaYaw,
            deltaPitch
        );

    }

    zoom(delta) {

        if (!this.enabled) {
            return;
        }

        if (!this.orbit) {
            return;
        }

        this.orbit.zoom(delta);

    }

    getCamera() {

        return this.camera;

    }

    getTarget() {

        return this.target;

    }

    setEnabled(enabled) {

        this.enabled = Boolean(enabled);

    }

    isEnabled() {

        return this.enabled;

    }

    update(deltaTime) {

        if (!this.enabled) {
            return;
        }

        if (!this.camera || !this.target) {
            return;
        }

        this.game.eventBus?.emit(
            "camera:target-updated",
            this.target.position
        );

    }

}