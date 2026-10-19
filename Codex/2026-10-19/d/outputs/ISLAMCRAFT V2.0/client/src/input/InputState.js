export class InputState {

    constructor() {

        this.reset();

    }

    reset() {

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.jump = false;
        this.sprint = false;
        this.crouch = false;

        this.interact = false;
        this.attack = false;

        this.lookX = 0;
        this.lookY = 0;

        this.joystickX = 0;
        this.joystickY = 0;

    }

    clearFrameInput() {

        this.jump = false;
        this.interact = false;
        this.attack = false;

        this.lookX = 0;
        this.lookY = 0;

    }

    setMovement(forward, backward, left, right) {

        this.moveForward = forward;
        this.moveBackward = backward;
        this.moveLeft = left;
        this.moveRight = right;

    }

    setJoystick(x, y) {

        this.joystickX = x;
        this.joystickY = y;

    }

    setLook(x, y) {

        this.lookX = x;
        this.lookY = y;

    }

}