import express from "express";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Server as SocketIOServer } from "socket.io";

import { GameServer } from "./core/GameServer.js";

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const ROOT_DIR =
    path.resolve(
        __dirname,
        "../.."
    );

const CLIENT_DIR =
    path.join(
        ROOT_DIR,
        "client"
    );

const DATA_DIR =
    path.join(
        ROOT_DIR,
        "data"
    );

const HOST =
    process.env.HOST ??
    "0.0.0.0";

const PORT =
    Number(
        process.env.PORT ?? 3000
    );

const app =
    express();

const httpServer =
    http.createServer(app);

const io =
    new SocketIOServer(
        httpServer,
        {
            cors: {
                origin: true,
                credentials: true
            }
        }
    );

const gameServer =
    new GameServer();

app.disable(
    "x-powered-by"
);

app.use(
    express.json({
        limit: "1mb"
    })
);

app.get(
    "/health",
    (_req, res) => {

        res.status(200).json({

            status: "ok",

            server:
                "ISLAMCRAFT",

            timestamp:
                Date.now()

        });

    }
);

const NODE_MODULES_DIR =
    path.join(
        ROOT_DIR,
        "node_modules"
    );

app.use(
    "/node_modules",
    express.static(
        NODE_MODULES_DIR
    )
);

app.use(
    express.static(
        CLIENT_DIR
    )
);

app.use(
    "/data",
    express.static(
        DATA_DIR
    )
);

app.get(
    "/",
    (_req, res) => {

        res.sendFile(
            path.join(
                CLIENT_DIR,
                "index.html"
            )
        );

    }
);

io.on(
    "connection",
    socket => {

        console.log(
            `Client connected: ${socket.id}`
        );

        socket.emit(
            "connection:accepted",
            {
                id:
                    socket.id,

                timestamp:
                    Date.now()
            }
        );

        socket.on(
            "disconnect",
            reason => {

                console.log(
                    `Client disconnected: ${socket.id} (${reason})`
                );

            }
        );

    }
);

async function start() {

    await gameServer.start();

    await new Promise(
        (resolve, reject) => {

            httpServer.once(
                "error",
                reject
            );

            httpServer.listen(
                PORT,
                HOST,
                resolve
            );

        }
    );

    console.log(
        `ISLAMCRAFT HTTP server listening on ${HOST}:${PORT}`
    );

    console.log(
        `ISLAMCRAFT client available at http://localhost:${PORT}`
    );

    console.log(
        `ISLAMCRAFT Socket.IO available at http://localhost:${PORT}`
    );

}

async function shutdown() {

    console.log(
        "Stopping ISLAMCRAFT..."
    );

    io.close();

    await new Promise(
        resolve => {

            httpServer.close(
                () => resolve()
            );

        }
    );

    if (
        typeof gameServer.stop ===
        "function"
    ) {

        await gameServer.stop();

    }

    process.exit(
        0
    );

}

process.on(
    "SIGINT",
    shutdown
);

process.on(
    "SIGTERM",
    shutdown
);

start().catch(
    error => {

        console.error(
            "Failed to start ISLAMCRAFT:",
            error
        );

        process.exit(
            1
        );

    }
);
