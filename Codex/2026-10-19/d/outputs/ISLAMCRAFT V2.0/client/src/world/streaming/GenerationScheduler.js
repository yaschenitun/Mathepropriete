export class GenerationScheduler {

    constructor(game) {

        this.game = game;

        this.queue = [];

        this.running = false;

        this.maxConcurrent = 1;

        this.activeJobs = 0;

    }

    async initialize() {

        this.queue = [];

        this.running = false;

        this.activeJobs = 0;

        console.log("GenerationScheduler initialisé.");

    }

    schedule(task, priority = 0) {

        if (typeof task !== "function") {

            return false;

        }

        this.queue.push({

            task,

            priority

        });

        this.queue.sort(

            (a, b) => b.priority - a.priority

        );

        this.process();

        return true;

    }

    process() {

        if (this.running) {

            return;

        }

        this.running = true;

        while (

            this.activeJobs < this.maxConcurrent &&

            this.queue.length > 0

        ) {

            const job = this.queue.shift();

            this.activeJobs++;

            Promise.resolve()

                .then(() => job.task())

                .catch(error => {

                    this.game.eventBus?.emit(

                        "world:generation-error",

                        error

                    );

                })

                .finally(() => {

                    this.activeJobs--;

                    this.running = false;

                    this.process();

                });

        }

        if (this.activeJobs === 0) {

            this.running = false;

        }

    }

    clear() {

        this.queue.length = 0;

    }

    getQueueSize() {

        return this.queue.length;

    }

    isRunning() {

        return this.running;

    }

}