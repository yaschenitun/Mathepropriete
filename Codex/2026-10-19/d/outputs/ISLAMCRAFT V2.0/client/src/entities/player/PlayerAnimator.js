export class PlayerAnimator {

    constructor(game, playerModel) {

        this.game = game;

        this.playerModel = playerModel;

        this.walkTime = 0;

        this.walkSpeed = 8;

        this.walkAmplitude = 0.7;

        this.currentState = "idle";

    }

    async initialize() {

        console.log("PlayerAnimator initialisé.");

    }

    setState(state) {

        this.currentState = state;

    }

    update(deltaTime, velocity) {

        if (!this.playerModel) {

            return;

        }

        const speed = velocity.length();

        if (speed > 0.05) {

            this.currentState = "walk";

        } else {

            this.currentState = "idle";

        }

        switch (this.currentState) {

            case "walk":

                this.animateWalk(deltaTime);

                break;

            default:

                this.animateIdle(deltaTime);

                break;

        }

    }

    animateIdle(deltaTime) {

        this.walkTime += deltaTime;

        const offset =

            Math.sin(this.walkTime * 2) * 0.02;

        this.playerModel.group.position.y = offset;

        this.playerModel.leftArm.rotation.x = 0;

        this.playerModel.rightArm.rotation.x = 0;

        this.playerModel.leftLeg.rotation.x = 0;

        this.playerModel.rightLeg.rotation.x = 0;

    }

    animateWalk(deltaTime) {

        this.walkTime += deltaTime * this.walkSpeed;

        const armAngle =

            Math.sin(this.walkTime) * this.walkAmplitude;

        const legAngle =

            Math.sin(this.walkTime) * this.walkAmplitude;

        this.playerModel.leftArm.rotation.x = armAngle;

        this.playerModel.rightArm.rotation.x = -armAngle;

        this.playerModel.leftLeg.rotation.x = -legAngle;

        this.playerModel.rightLeg.rotation.x = legAngle;

    }

}