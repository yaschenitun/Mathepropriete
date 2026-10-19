export class CameraOrbit {

    constructor(game) {

        this.game = game;

        this.camera = null;

        this.target = null;

        this.distance = 6;

        this.minDistance = 2;

        this.maxDistance = 20;

        this.yaw = 0;

        this.pitch = 0.35;

        this.minPitch = -1.2;

        this.maxPitch = 1.2;

        this.enabled = true;

    }

    async initialize() {

        this.camera =
            this.game.scene?.getCamera?.() ?? null;;

        this.target = this.game.localPlayer ?? null;

        console.log("CameraOrbit initialisé.");

    }

    setCamera(camera) {

        this.camera = camera;

    }

    setTarget(target) {

        this.target = target;

    }

    setDistance(distance) {

        this.distance = Math.max(

            this.minDistance,

            Math.min(

                this.maxDistance,

                Number(distance) || this.distance

            )

        );

    }

    setYaw(yaw) {

        this.yaw = Number(yaw) || 0;

    }

    setPitch(pitch) {

        this.pitch = Math.max(

            this.minPitch,

            Math.min(

                this.maxPitch,

                Number(pitch) || 0

            )

        );

    }

    rotate(deltaYaw, deltaPitch) {

        this.yaw += Number(deltaYaw) || 0;

        this.setPitch(

            this.pitch + (Number(deltaPitch) || 0)

        );

    }

    zoom(delta) {

        this.setDistance(

            this.distance + (Number(delta) || 0)

        );

    }

    update() {

        if (

            !this.enabled ||

            !this.camera ||

            !this.target ||

            !this.target.position

        ) {

            return;

        }

        const target = this.target.position;

const cosPitch = Math.cos(this.pitch);
const sinPitch = Math.sin(this.pitch);

/*
 * La caméra reste toujours derrière le joueur.
 * La rotation du joueur détermine donc le yaw
 * de la caméra.
 */
const playerYaw =
    this.target.rotation?.y ?? 0;

const cameraYaw =
    playerYaw - Math.PI;

const cosYaw =
    Math.cos(cameraYaw);

const sinYaw =
    Math.sin(cameraYaw);

        this.camera.position.x =

            target.x +

            this.distance *

            cosPitch *

            sinYaw;

        this.camera.position.y =

            target.y +

            this.distance *

            sinPitch;

        this.camera.position.z =

            target.z +

            this.distance *

            cosPitch *

            cosYaw;
        
        this.camera.lookAt(
    target.x,
    target.y + 0.9,
    target.z
);

    }

    setEnabled(enabled) {

        this.enabled = Boolean(enabled);

    }

    isEnabled() {

        return this.enabled;

    }

}