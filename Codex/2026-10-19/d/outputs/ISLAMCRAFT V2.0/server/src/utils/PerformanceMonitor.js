export class PerformanceMonitor {

    constructor(options = {}) {

        this.samples = new Map();

        this.maxSamples =
            Math.max(
                1,
                Number(options.maxSamples ?? 1000)
            );

        this.startedAt =
            Date.now();

    }

    start(name) {

        if (!name) {

            throw new TypeError(
                "Performance sample name is required."
            );

        }

        return {

            name,

            startedAt:
                this.now()

        };

    }

    end(timer) {

        if (
            !timer ||
            !timer.name
        ) {

            return null;

        }

        const duration =
            Math.max(
                0,
                this.now() -
                timer.startedAt
            );

        this.record(
            timer.name,
            duration
        );

        return duration;

    }

    measure(name, callback) {

        const timer =
            this.start(name);

        try {

            const result =
                callback();

            if (
                result &&
                typeof result.then ===
                "function"
            ) {

                return result
                    .then(
                        value => {

                            this.end(timer);

                            return value;

                        }
                    )
                    .catch(
                        error => {

                            this.end(timer);

                            throw error;

                        }
                    );

            }

            this.end(timer);

            return result;

        } catch (error) {

            this.end(timer);

            throw error;

        }

    }

    record(name, duration) {

        const value =
            Number(duration);

        if (
            !Number.isFinite(value)
        ) {

            return;

        }

        if (!this.samples.has(name)) {

            this.samples.set(
                name,
                []
            );

        }

        const samples =
            this.samples.get(name);

        samples.push(
            value
        );

        if (
            samples.length >
            this.maxSamples
        ) {

            samples.shift();

        }

    }

    get(name) {

        const samples =
            this.samples.get(name) ??
            [];

        if (samples.length === 0) {

            return {

                name,

                count: 0,

                average: 0,

                minimum: 0,

                maximum: 0

            };

        }

        const total =
            samples.reduce(
                (sum, value) =>
                    sum + value,
                0
            );

        return {

            name,

            count:
                samples.length,

            average:
                total /
                samples.length,

            minimum:
                Math.min(...samples),

            maximum:
                Math.max(...samples)

        };

    }

    getAll() {

        const result = {};

        for (
            const name
            of this.samples.keys()
        ) {

            result[name] =
                this.get(name);

        }

        return result;

    }

    clear(name = null) {

        if (name === null) {

            this.samples.clear();

            return;

        }

        this.samples.delete(
            name
        );

    }

    now() {

        if (
            typeof performance !==
            "undefined" &&
            typeof performance.now ===
            "function"
        ) {

            return performance.now();

        }

        return Date.now();

    }

    uptime() {

        return Date.now() -
            this.startedAt;

    }

}