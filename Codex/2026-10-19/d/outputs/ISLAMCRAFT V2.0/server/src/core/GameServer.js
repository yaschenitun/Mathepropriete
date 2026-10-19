import { ServerConfig } from "./ServerConfig.js";
import { ServerClock } from "./ServerClock.js";
import { GameLoop } from "./GameLoop.js";
import { CleanupManager } from "./CleanupManager.js";

export class GameServer {

    constructor(options = {}) {

        this.config = options.config ??

            new ServerConfig(options);

        this.clock = options.clock ??

            new ServerClock();

        this.cleanup = options.cleanup ??

            new CleanupManager();

        this.loop = null;

        this.started = false;

        this.starting = false;

        this.stopping = false;

        this.components = new Map();

    }

    registerComponent(name, component) {

        if (!name) {

            throw new TypeError(

                "Le nom du composant est obligatoire."

            );

        }

        if (!component) {

            throw new TypeError(

                `Composant invalide: ${name}.`

            );

        }

        this.components.set(name, component);

        if (typeof component.stop === "function") {

            this.cleanup.register(

                () => component.stop()

            );

        } else if (typeof component.destroy === "function") {

            this.cleanup.register(

                () => component.destroy()

            );

        }

        return component;

    }

    getComponent(name) {

        return this.components.get(name) ?? null;

    }

    async initialize() {

        if (this.started || this.starting) {

            return;

        }

        this.starting = true;

        try {

            this.config.load();

            this.clock.tickRate = this.config.getTickRate();

            this.clock.tickDuration =

                1000 / this.clock.tickRate;

            this.loop = new GameLoop({

                clock: this.clock,

                tickRate: this.config.getTickRate(),

                update: (

                    deltaTime,

                    tick

                ) => this.update(

                    deltaTime,

                    tick

                )

            });

            for (const component of this.components.values()) {

                if (

                    typeof component.initialize ===

                    "function"

                ) {

                    await component.initialize(this);

                }

            }

        } finally {

            this.starting = false;

        }

    }

    async start() {

        if (this.started) {

            return;

        }

        await this.initialize();

        this.started = true;

        this.stopping = false;

        this.loop.start();

        console.log(

            `ISLAMCRAFT server started on ` +

            `${this.config.getHost()}:` +

            `${this.config.getPort()}`

        );

    }

    async update(deltaTime, tick) {

        for (const component of this.components.values()) {

            if (typeof component.update !== "function") {

                continue;

            }

            await component.update(

                deltaTime,

                tick

            );

        }

    }

    async stop() {

        if (!this.started || this.stopping) {

            return;

        }

        this.stopping = true;

        this.loop?.stop();

        await this.cleanup.cleanup();

        this.started = false;

        this.stopping = false;

        console.log("ISLAMCRAFT server stopped.");

    }

    isRunning() {

        return this.started;

    }

    getStatus() {

        return {

            running: this.started,

            starting: this.starting,

            stopping: this.stopping,

            tick: this.clock.getTick(),

            uptime: this.clock.getElapsedTime(),

            components: this.components.size

        };

    }

}