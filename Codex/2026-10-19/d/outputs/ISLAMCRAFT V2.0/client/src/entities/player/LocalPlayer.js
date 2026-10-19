import * as THREE from "three";
import { PlayerModel } from "./PlayerModel.js";

export class LocalPlayer {

    constructor(game, data = {}) {

        this.game = game;

        this.id =
            data.id ??
            crypto.randomUUID();

        this.username =
            data.username ??
            "Player";

        this.name =
            this.username;

        this.skin =
            data.skin ??
            "default";

        this.position =
            new THREE.Vector3();

        this.rotation =
            new THREE.Euler();

        this.velocity =
            new THREE.Vector3();

        this.mesh = null;

        this.model = null;

        this.enabled = true;

    }


    async initialize() {

        /*
         * Position initiale
         */

        this.position.set(
            0,
            0,
            0
        );


        /*
         * Création du modèle 3D
         */

        this.model =
            new PlayerModel(this.game);

        await this.model.initialize();


        /*
         * Récupération du groupe 3D
         */

        this.setMesh(
            this.model.getMesh()
        );
        this.mesh.scale.set(
    0.85,
    0.85,
    0.85
);


        /*
         * Placement dans la scène
         */

        if (
            this.mesh &&
            this.game.scene
        ) {

            this.game.scene.add(
                this.mesh
            );

        }


        /*
         * Position initiale
         */

        this.mesh?.position.copy(
            this.position
        );

        this.mesh?.rotation.copy(
            this.rotation
        );


        console.log(
            "LocalPlayer initialisé avec modèle 3D."
        );

    }


    setMesh(mesh) {

        this.mesh = mesh;

    }


    setPosition(x, y, z) {

        this.position.set(
            x,
            y,
            z
        );

        if (this.mesh) {

            this.mesh.position.copy(
                this.position
            );

        }

    }


    setRotation(x, y, z) {

        this.rotation.set(
            x,
            y,
            z
        );

        if (this.mesh) {

            this.mesh.rotation.copy(
                this.rotation
            );

        }

    }


    translate(vector) {

        this.position.add(
            vector
        );

        if (this.mesh) {

            this.mesh.position.copy(
                this.position
            );

        }

    }


    update(deltaTime) {

        if (!this.enabled) {
            return;
        }

        if (this.mesh) {

            this.mesh.position.copy(
                this.position
            );

            this.mesh.rotation.copy(
                this.rotation
            );

        }

    }


    destroy() {

        if (
            this.mesh &&
            this.game.scene
        ) {

            this.game.scene.remove(
                this.mesh
            );

        }

        if (this.model?.group) {

            this.model.group.traverse(
                object => {

                    if (object.geometry) {

                        object.geometry.dispose();

                    }

                    if (object.material) {

                        if (
                            Array.isArray(
                                object.material
                            )
                        ) {

                            object.material.forEach(
                                material =>
                                    material.dispose()
                            );

                        }
                        else {

                            object.material.dispose();

                        }

                    }

                }
            );

        }

        this.mesh = null;
        this.model = null;

    }

}
