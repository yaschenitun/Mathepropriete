import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "../../..");

export class ServerConfig {

    constructor(options = {}) {

        this.projectRoot = projectRoot;

        this.configPath = options.configPath ??

            path.join(

                this.projectRoot,

                "config",

                "server.json"

            );

        this.values = {};

    }

    load() {

        if (!fs.existsSync(this.configPath)) {

            throw new Error(

                `Configuration serveur introuvable: ${this.configPath}`

            );

        }

        const raw = fs.readFileSync(

            this.configPath,

            "utf8"

        );

        this.values = JSON.parse(raw);

        return this.values;

    }

    get(path, fallback = undefined) {

        const parts = String(path).split(".");

        let current = this.values;

        for (const part of parts) {

            if (

                current === null ||

                current === undefined ||

                typeof current !== "object" ||

                !(part in current)

            ) {

                return fallback;

            }

            current = current[part];

        }

        return current;

    }

    getHost() {

        return this.get(

            "server.host",

            "0.0.0.0"

        );

    }

    getPort() {

        return this.get(

            "server.port",

            3000

        );

    }

    getMaxPlayers() {

        return this.get(

            "server.maxPlayers",

            100

        );

    }

    getTickRate() {

        return this.get(

            "server.tickRate",

            20

        );

    }

    getWorldChunkSize() {

        return this.get(

            "world.chunkSize",

            16

        );

    }

    getWorldRenderDistance() {

        return this.get(

            "world.renderDistance",

            8

        );

    }

    getNetworkTimeout() {

        return this.get(

            "network.timeout",

            10000

        );

    }

    getHeartbeatInterval() {

        return this.get(

            "network.heartbeatInterval",

            5000

        );

    }

}