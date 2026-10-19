export class IdGenerator {

    constructor(options = {}) {

        this.prefix =
            options.prefix ?? "";

        this.counter =
            Number(options.start ?? 0);

        this.randomLength =
            Math.max(
                0,
                Number(options.randomLength ?? 8)
            );

    }

    next(prefix = this.prefix) {

        this.counter++;

        const timestamp =
            Date.now().toString(36);

        const counter =
            this.counter.toString(36);

        const random =
            this.random(
                this.randomLength
            );

        const parts = [
            prefix,
            timestamp,
            counter,
            random
        ].filter(Boolean);

        return parts.join("_");

    }

    random(length = this.randomLength) {

        if (length <= 0) {

            return "";

        }

        const characters =
            "abcdefghijklmnopqrstuvwxyz" +
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "0123456789";

        let result = "";

        for (
            let index = 0;
            index < length;
            index++
        ) {

            result +=
                characters[
                    Math.floor(
                        Math.random() *
                        characters.length
                    )
                ];

        }

        return result;

    }

    uuid() {

        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
        ) {

            return crypto.randomUUID();

        }

        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
            .replace(
                /[xy]/g,
                character => {

                    const random =
                        Math.random() * 16 | 0;

                    const value =
                        character === "x"
                            ? random
                            : (
                                random & 0x3 |
                                0x8
                            );

                    return value.toString(16);

                }
            );

    }

    numeric() {

        this.counter++;

        return this.counter;

    }

    reset(value = 0) {

        this.counter =
            Number(value) || 0;

        return this;

    }

}