export class TimeManager {

    constructor() {

        this.startTime = performance.now();

        this.currentTime = this.startTime;

        this.previousTime = this.startTime;

        this.deltaTime = 0;

        this.elapsedTime = 0;

        this.timeScale = 1;

        this.paused = false;

    }

    update() {

        this.currentTime = performance.now();

        if (this.paused) {

            this.deltaTime = 0;

            this.previousTime = this.currentTime;

            return;

        }

        this.deltaTime =
            ((this.currentTime - this.previousTime) / 1000) *
            this.timeScale;

        this.previousTime = this.currentTime;

        this.elapsedTime += this.deltaTime;

    }

    pause() {

        this.paused = true;

    }

    resume() {

        this.paused = false;

        this.previousTime = performance.now();

    }

    reset() {

        this.startTime = performance.now();

        this.currentTime = this.startTime;

        this.previousTime = this.startTime;

        this.deltaTime = 0;

        this.elapsedTime = 0;

    }

    setTimeScale(scale) {

        this.timeScale = Math.max(0, scale);

    }

    getDeltaTime() {

        return this.deltaTime;

    }

    getElapsedTime() {

        return this.elapsedTime;

    }

    getElapsedMilliseconds() {

        return this.elapsedTime * 1000;

    }

    isPaused() {

        return this.paused;

    }

}