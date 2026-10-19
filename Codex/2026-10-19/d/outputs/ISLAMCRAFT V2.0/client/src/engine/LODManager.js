import * as THREE from "three";

export class LODManager {

    constructor(game) {

        this.game = game;

        this.camera = null;

        this.enabled = true;

        this.objects = new Set();

        this.defaultDistances = {

            HIGH: 35,
            MEDIUM: 80,
            LOW: 180,
            HIDDEN: 300

        };

    }

    async initialize() {

        this.camera = this.game.scene.getCamera();

        console.log("LODManager initialisé.");

    }

    register(object, options = {}) {

        if (!object) return;

        object.userData.lod = {

            high: options.high ?? this.defaultDistances.HIGH,

            medium: options.medium ?? this.defaultDistances.MEDIUM,

            low: options.low ?? this.defaultDistances.LOW,

            hidden: options.hidden ?? this.defaultDistances.HIDDEN,

            current: "HIGH"

        };

        this.objects.add(object);

    }

    unregister(object) {

        this.objects.delete(object);

    }

    update() {

        if (!this.enabled) return;

        if (!this.camera) return;

        const cameraPosition = this.camera.position;

        for (const object of this.objects) {

            if (!object) continue;

            const distance = cameraPosition.distanceTo(

                object.position

            );

            const lod = object.userData.lod;

            if (!lod) continue;

            if (distance > lod.hidden) {

                object.visible = false;

                lod.current = "HIDDEN";

            }

            else {

                object.visible = true;

                if (distance <= lod.high) {

                    lod.current = "HIGH";

                }

                else if (distance <= lod.medium) {

                    lod.current = "MEDIUM";

                }

                else {

                    lod.current = "LOW";

                }

            }

        }

    }

    clear() {

        this.objects.clear();

    }

    setEnabled(enabled) {

        this.enabled = enabled;

    }

}