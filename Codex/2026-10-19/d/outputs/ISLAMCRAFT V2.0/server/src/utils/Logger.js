export class Logger {

    constructor(options = {}) {

        this.name =
            options.name ?? "IslamCraft";

        this.level =
            options.level ?? "info";

        this.enabled =
            options.enabled !== false;

        this.levels = {

            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
            silent: 4

        };

    }

    shouldLog(level) {

        if (!this.enabled) {

            return false;

        }

        const current =
            this.levels[
                this.level
            ] ??
            this.levels.info;

        const target =
            this.levels[
                level
            ] ??
            this.levels.info;

        return target >= current;

    }

    format(level, message) {

        const timestamp =
            new Date().toISOString();

        const prefix =
            `[${timestamp}] ` +
            `[${this.name}] ` +
            `[${level.toUpperCase()}]`;

        return `${prefix} ${message}`;

    }

    write(level, message, ...args) {

        if (
            !this.shouldLog(level)
        ) {

            return;

        }

        const formatted =
            this.format(
                level,
                message
            );

        if (level === "error") {

            console.error(
                formatted,
                ...args
            );

            return;

        }

        if (level === "warn") {

            console.warn(
                formatted,
                ...args
            );

            return;

        }

        console.log(
            formatted,
            ...args
        );

    }

    debug(message, ...args) {

        this.write(
            "debug",
            message,
            ...args
        );

    }

    info(message, ...args) {

        this.write(
            "info",
            message,
            ...args
        );

    }

    warn(message, ...args) {

        this.write(
            "warn",
            message,
            ...args
        );

    }

    error(message, ...args) {

        this.write(
            "error",
            message,
            ...args
        );

    }

    child(name) {

        return new Logger({

            name:
                `${this.name}:${name}`,

            level:
                this.level,

            enabled:
                this.enabled

        });

    }

    setLevel(level) {

        if (
            this.levels[level] === undefined
        ) {

            throw new Error(
                `Unknown log level: ${level}`
            );

        }

        this.level =
            level;

        return this;

    }

    setEnabled(enabled) {

        this.enabled =
            Boolean(enabled);

        return this;

    }

}