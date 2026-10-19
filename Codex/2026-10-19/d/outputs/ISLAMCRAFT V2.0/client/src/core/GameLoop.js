export class GameLoop {

    constructor(game) {

        this.game = game;

        this.running = false;

        this.lastFrameTime = 0;

        this.deltaTime = 0;

        this.fixedTimeStep = 1 / 60;

        this.accumulator = 0;

        this.maxFrameTime = 0.25;

        this.frameId = null;

        this.frameCount = 0;

        this.fps = 0;

        this.fpsTimer = 0;

        this.loop = this.loop.bind(this);

    }

    start() {

        if (this.running) return;

        this.running = true;

        this.lastFrameTime = performance.now() / 1000;

        this.frameId = requestAnimationFrame(this.loop);

    }

    stop() {

        this.running = false;

        if (this.frameId !== null) {

            cancelAnimationFrame(this.frameId);

            this.frameId = null;

        }

    }

    loop() {

        if (!this.running) return;

        const currentTime = performance.now() / 1000;

        let frameTime = currentTime - this.lastFrameTime;

        this.lastFrameTime = currentTime;

        if (frameTime > this.maxFrameTime) {

            frameTime = this.maxFrameTime;

        }

        this.deltaTime = frameTime;

        this.accumulator += frameTime;

        while (this.accumulator >= this.fixedTimeStep) {

            this.game.update(this.fixedTimeStep);

            this.accumulator -= this.fixedTimeStep;

        }

        const interpolation = this.accumulator / this.fixedTimeStep;

        this.game.render(interpolation);

        this.updateFPS(frameTime);

        this.frameId = requestAnimationFrame(this.loop);

    }

    updateFPS(deltaTime) {

        this.frameCount++;

        this.fpsTimer += deltaTime;

        if (this.fpsTimer >= 1) {

            this.fps = this.frameCount;

            this.frameCount = 0;

            this.fpsTimer = 0;

        }

    }

    getFPS() {

        return this.fps;

    }

    getDeltaTime() {

        return this.deltaTime;

    }

}