export class ServerClock {

    constructor(tickRate = 20) {

        this.tickRate = Math.max(

            1,

            Number(tickRate) || 20

        );

        this.tickDuration =

            1000 / this.tickRate;

        this.startTime = 0;

        this.lastTime = 0;

        this.tick = 0;

        this.deltaTime = 0;

        this.running = false;

    }

    start() {

        const now = Date.now();

        this.startTime = now;

        this.lastTime = now;

        this.tick = 0;

        this.deltaTime = 0;

        this.running = true;

    }

    update() {

        if (!this.running) {

            return 0;

        }

        const now = Date.now();

        this.deltaTime = Math.max(

            0,

            (now - this.lastTime) / 1000

        );

        this.lastTime = now;

        this.tick++;

        return this.deltaTime;

    }

    stop() {

        this.running = false;

    }

    getTick() {

        return this.tick;

    }

    getDeltaTime() {

        return this.deltaTime;

    }

    getElapsedTime() {

        if (!this.startTime) {

            return 0;

        }

        return (Date.now() - this.startTime) / 1000;

    }

    getTickDuration() {

        return this.tickDuration;

    }

    getTickRate() {

        return this.tickRate;

    }

    isRunning() {

        return this.running;

    }

}