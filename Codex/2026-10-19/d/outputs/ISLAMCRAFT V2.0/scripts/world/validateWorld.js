import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "../..");
const worldDirectory = path.join(projectRoot, "data");

const requiredFiles = [
    "biomes/biomes.json",
    "biomes/desert.json",
    "biomes/forest.json",
    "biomes/plains.json"
];

let errors = 0;

function reportError(message) {

    console.error(`[WORLD] ERROR: ${message}`);

    errors++;

}

function loadJson(relativePath) {

    const filePath = path.join(

        worldDirectory,

        relativePath

    );

    if (!fs.existsSync(filePath)) {

        reportError(`Fichier manquant: ${relativePath}`);

        return null;

    }

    try {

        return JSON.parse(

            fs.readFileSync(filePath, "utf8")

        );

    } catch (error) {

        reportError(

            `JSON invalide dans ${relativePath}: ${error.message}`

        );

        return null;

    }

}

function validateBiome(biome, expectedId) {

    if (!biome || typeof biome !== "object") {

        reportError(

            `Biome invalide: ${expectedId}`

        );

        return;

    }

    if (biome.id !== expectedId) {

        reportError(

            `Identifiant incorrect pour ${expectedId}.`

        );

    }

    if (typeof biome.name !== "string" || !biome.name.trim()) {

        reportError(

            `Nom manquant pour le biome ${expectedId}.`

        );

    }

    if (!biome.terrain || typeof biome.terrain !== "object") {

        reportError(

            `Terrain manquant pour ${expectedId}.`

        );

    }

    if (

        !biome.environment ||

        typeof biome.environment !== "object"

    ) {

        reportError(

            `Environnement manquant pour ${expectedId}.`

        );

    }

    if (!Array.isArray(biome.vegetation)) {

        reportError(

            `Végétation invalide pour ${expectedId}.`

        );

    }

    if (!Array.isArray(biome.objects)) {

        reportError(

            `Objets invalides pour ${expectedId}.`

        );

    }

}

function validateWorld() {

    const registry = loadJson("biomes/biomes.json");

    const desert = loadJson("biomes/desert.json");
    const forest = loadJson("biomes/forest.json");
    const plains = loadJson("biomes/plains.json");

    if (!registry || !desert || !forest || !plains) {

        return false;

    }

    if (!Array.isArray(registry.biomes)) {

        reportError(

            "biomes.json doit contenir un tableau 'biomes'."

        );

        return false;

    }

    const expectedBiomes = {

        desert,

        forest,

        plains

    };

    for (const [id, biome] of Object.entries(expectedBiomes)) {

        validateBiome(biome, id);

    }

    const registryIds = new Set();

    for (const entry of registry.biomes) {

        if (!entry || typeof entry !== "object") {

            reportError("Entrée de biome invalide dans biomes.json.");

            continue;

        }

        if (!entry.id) {

            reportError(

                "Une entrée de biomes.json ne possède pas d'id."

            );

            continue;

        }

        if (registryIds.has(entry.id)) {

            reportError(

                `Biome dupliqué dans biomes.json: ${entry.id}.`

            );

        }

        registryIds.add(entry.id);

        if (!expectedBiomes[entry.id]) {

            reportError(

                `Biome référencé mais absent: ${entry.id}.`

            );

        }

        if (typeof entry.file !== "string") {

            reportError(

                `Fichier manquant pour le biome ${entry.id}.`

            );

        }

    }

    for (const id of Object.keys(expectedBiomes)) {

        if (!registryIds.has(id)) {

            reportError(

                `Biome ${id} absent de biomes.json.`

            );

        }

    }

    return errors === 0;

}

const valid = validateWorld();

if (!valid) {

    process.exitCode = 1;

    console.error(

        `Validation du monde échouée avec ${errors} erreur(s).`

    );

} else {

    console.log("Validation du monde réussie.");

}