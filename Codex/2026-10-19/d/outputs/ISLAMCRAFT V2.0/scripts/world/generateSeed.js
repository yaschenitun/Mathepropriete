import crypto from "node:crypto";

const DEFAULT_SEED_LENGTH = 16;

export function generateSeed(length = DEFAULT_SEED_LENGTH) {

    if (!Number.isInteger(length) || length <= 0) {

        throw new TypeError(

            "La longueur de la seed doit être un entier positif."

        );

    }

    return crypto.randomBytes(length).toString("hex");

}

export function generateNumericSeed() {

    const buffer = crypto.randomBytes(8);

    return Number(

        BigInt.asUintN(

            32,

            buffer.readBigUInt64BE(0)

        )

    );

}

export function normalizeSeed(seed) {

    if (seed === undefined || seed === null) {

        return generateSeed();

    }

    if (typeof seed === "number") {

        if (!Number.isFinite(seed)) {

            throw new TypeError("Seed numérique invalide.");

        }

        return Math.trunc(seed).toString();

    }

    const normalized = String(seed).trim();

    if (!normalized) {

        return generateSeed();

    }

    return normalized;

}

export function hashSeed(seed) {

    return crypto

        .createHash("sha256")

        .update(normalizeSeed(seed))

        .digest("hex");

}

if (import.meta.url === `file://${process.argv[1]}`) {

    const seed = normalizeSeed(process.argv[2]);

    console.log(seed);

}