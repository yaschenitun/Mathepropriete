import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "../..");
const assetsDirectory = path.join(projectRoot, "client", "assets");

const requiredDirectories = [
    "models",
    "textures",
    "animations",
    "audio"
];

let errors = 0;

function reportError(message) {

    console.error(`[ASSETS] ERROR: ${message}`);

    errors++;

}

function reportSuccess(message) {

    console.log(`[ASSETS] OK: ${message}`);

}

function validateDirectory(directory) {

    if (!fs.existsSync(directory)) {

        reportError(`Dossier manquant: ${directory}`);

        return false;

    }

    if (!fs.statSync(directory).isDirectory()) {

        reportError(`Ce chemin n'est pas un dossier: ${directory}`);

        return false;

    }

    reportSuccess(`Dossier trouvé: ${path.relative(projectRoot, directory)}`);

    return true;

}

function validateAssets() {

    console.log("Validation des assets ISLAMCRAFT...");

    if (!validateDirectory(assetsDirectory)) {

        return false;

    }

    for (const directory of requiredDirectories) {

        validateDirectory(

            path.join(assetsDirectory, directory)

        );

    }

    return errors === 0;

}

const valid = validateAssets();

if (!valid) {

    process.exitCode = 1;

    console.error(

        `Validation des assets échouée avec ${errors} erreur(s).`

    );

} else {

    console.log("Validation des assets réussie.");

}