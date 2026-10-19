import * as THREE from "three";

export class PlayerNameplate {

    constructor(game, player) {

        this.game = game;

        this.player = player;

        this.sprite = null;

        this.canvas = null;

        this.context = null;

    }

    async initialize() {

        this.canvas = document.createElement("canvas");
        this.canvas.width = 512;
        this.canvas.height = 128;

        this.context = this.canvas.getContext("2d");

        this.updateText(this.player.username);

        const texture = new THREE.CanvasTexture(this.canvas);

        const material = new THREE.SpriteMaterial({

            map: texture,
            transparent: true

        });

        this.sprite = new THREE.Sprite(material);

        this.sprite.scale.set(

            3,
            0.75,
            1

        );

        if (this.player.mesh) {

            this.player.mesh.add(this.sprite);

            this.sprite.position.set(

                0,

                3,

                0

            );

        }

        console.log("PlayerNameplate initialisé.");

    }

    updateText(username) {

        if (!this.context) {

            return;

        }

        this.context.clearRect(

            0,
            0,
            this.canvas.width,
            this.canvas.height

        );

        this.context.fillStyle = "rgba(0,0,0,0.55)";

        this.context.fillRect(

            0,
            20,
            512,
            88

        );

        this.context.font = "Bold 54px Arial";

        this.context.fillStyle = "#ffffff";

        this.context.textAlign = "center";

        this.context.fillText(

            username,

            256,

            78

        );

        if (this.sprite) {

            this.sprite.material.map.needsUpdate = true;

        }

    }

    setUsername(username) {

        this.player.username = username;

        this.updateText(username);

    }

    update(camera) {

        if (!this.sprite || !camera) {

            return;

        }

        this.sprite.quaternion.copy(

            camera.quaternion

        );

    }

}