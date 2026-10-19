export class GameLoop {

    constructor({

        clock,

        update,

        tickRate = 20

    } = {}) {

        this.clock = clock;

        this.updateCallback =

            typeof update === "function"

                ? update

                : null;

        this.tickRate = Math.max(

            1,

            Number(tickRate) || 20

        );

        this.interval =

            1000 / this.tickRate;

        this.timer = null;

        this.running = false;

        this.processing = false;

    }

    start() {

        if (this.running) {

            return;

        }

        this.running = true;

        this.clock?.start();

        this.timer = setInterval(

            () => this.step(),

            this.interval

        );

    }

    async step() {

        if (!this.running || this.processing) {

            return;

        }

        this.processing = true;

        try {

            const deltaTime =

                this.clock

                    ? this.clock.update()

                    : this.interval / 1000;

            if (this.updateCallback) {

                await this.updateCallback(

                    deltaTime,

                    this.clock?.getTick() ?? 0

                );

            }

        } finally {

            this.processing = false;

        }

    }

    stop() {

        if (this.timer !== null) {

            clearInterval(this.timer);

            this.timer = null;

        }

        this.running = false;

        this.clock?.stop();

    }

    isRunning() {

        return this.running;

    }

    getTickRate() {

        return this.tickRate;

    }

}