export class MatchTimer {

    constructor(duration = 0) {

        this.duration = Math.max(
            0,
            Number(duration)
        );

        this.remaining = this.duration;

        this.running = false;

        this.startedAt = 0;

        this.lastUpdate = 0;

    }

    start(timestamp = Date.now()) {

        if (this.running) {

            return false;

        }

        this.running = true;

        this.startedAt = timestamp;

        this.lastUpdate = timestamp;

        return true;

    }

    pause(timestamp = Date.now()) {

        if (!this.running) {

            return false;

        }

        this.update(timestamp);

        this.running = false;

        return true;

    }

    resume(timestamp = Date.now()) {

        if (this.running || this.remaining <= 0) {

            return false;

        }

        this.running = true;

        this.lastUpdate = timestamp;

        return true;

    }

    reset(duration = this.duration) {

        this.duration = Math.max(
            0,
            Number(duration)
        );

        this.remaining = this.duration;

        this.running = false;

        this.startedAt = 0;

        this.lastUpdate = 0;

    }

    update(timestamp = Date.now()) {

        if (!this.running) {

            return this.remaining;

        }

        const elapsed =
            Math.max(
                0,
                timestamp - this.lastUpdate
            );

        this.remaining = Math.max(
            0,
            this.remaining - elapsed
        );

        this.lastUpdate = timestamp;

        if (this.remaining <= 0) {

            this.running = false;

        }

        return this.remaining;

    }

    isFinished(timestamp = Date.now()) {

        this.update(timestamp);

        return this.remaining <= 0;

    }

    getRemaining(timestamp = Date.now()) {

        return this.update(timestamp);

    }

    getRemainingSeconds(timestamp = Date.now()) {

        return this.getRemaining(timestamp) / 1000;

    }

    serialize(timestamp = Date.now()) {

        return {

            duration: this.duration,

            remaining: this.getRemaining(timestamp),

            running: this.running,

            startedAt: this.startedAt

        };

    }

}