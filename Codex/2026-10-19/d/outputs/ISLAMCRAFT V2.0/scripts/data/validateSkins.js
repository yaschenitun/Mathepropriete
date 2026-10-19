import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const skinsDirectory = path.resolve(

    __dirname,

    "../../data/skins"

);

let errors = 0;

function error(message) {

    console.error(`[SKINS] ERROR: ${message}`);

    errors++;

}

function loadJson(fileName) {

    const filePath = path.join(

        skinsDirectory,

        fileName

    );

    if (!fs.existsSync(filePath)) {

        error(`Fichier manquant: ${fileName}`);

        return null;

    }

    try {

        return JSON.parse(

            fs.readFileSync(filePath, "utf8")

        );

    } catch (exception) {

        error(

            `JSON invalide dans ${fileName}: ${exception.message}`

        );

        return null;

    }

}

function validateSkins() {

    const skinsData = loadJson("skins.json");
    const animationsData = loadJson("animations.json");

    if (!skinsData || !animationsData) {

        return false;

    }

    if (!Array.isArray(skinsData.skins)) {

        error(

            "skins.json doit contenir un tableau 'skins'."

        );

        return false;

    }

    if (!Array.isArray(animationsData.animations)) {

        error(

            "animations.json doit contenir un tableau 'animations'."

        );

        return false;

    }

    const animationIds = new Set(

        animationsData.animations.map(

            animation => animation.id

        )

    );

    const skinIds = new Set();

    for (const skin of skinsData.skins) {

        if (!skin.id) {

            error("Une skin ne possède pas d'identifiant.");

            continue;

        }

        if (skinIds.has(skin.id)) {

            error(`Skin dupliquée: ${skin.id}.`);

        }

        skinIds.add(skin.id);

        if (!Array.isArray(skin.animations)) {

            error(

                `Animations manquantes pour la skin ${skin.id}.`

            );

            continue;

        }

        for (const animationId of skin.animations) {

            if (!animationIds.has(animationId)) {

                error(

                    `Animation '${animationId}' introuvable pour ${skin.id}.`

                );

            }

        }

    }

    return errors === 0;

}

if (!validateSkins()) {

    process.exitCode = 1;

    console.error("Validation des skins échouée.");

} else {

    console.log("Validation des skins réussie.");

}