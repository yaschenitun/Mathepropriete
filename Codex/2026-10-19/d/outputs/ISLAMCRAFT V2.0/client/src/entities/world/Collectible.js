import { InteractiveObject } from "./InteractiveObject.js";

export class Collectible extends InteractiveObject {

    constructor(game, data = {}) {

        super(game, data);

        this.reward = data.reward ?? null;

        this.value = data.value ?? 0;

        this.collected = false;

        this.rotationSpeed = 1.5;

        this.floatAmplitude = 0;

        this.floatSpeed = 0;

        this.baseY = this.position.y;

        this.elapsedTime = 0;

    }

    async initialize() {

        await super.initialize();

        console.log("Collectible initialisé.");

    }

    collect(player) {

        if (this.collected) {

            return false;

        }

        this.collected = true;

        this.disableInteraction();

        if (this.game.lootController?.collectReward) {

            this.game.lootController.collectReward(

                player,

                this.reward,

                this.value

            );

        }

        if (this.game.audioManager?.play) {

            this.game.audioManager.play("collect");

        }

        if (this.game.scene && this.mesh) {

            this.game.scene.remove(this.mesh);

        }

        return true;

    }

    update(deltaTime) {

        super.update(deltaTime);

        if (this.collected || !this.mesh) {

            return;

        }

        this.mesh.rotation.y +=
    this.rotationSpeed * deltaTime;

    }

}