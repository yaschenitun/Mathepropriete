import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDirectory = path.resolve(

    __dirname,

    "../../data/items"

);

const files = [

    "items.json",

    "bonuses.json",

    "lootTables.json"

];

let errors = 0;

function error(message) {

    console.error(`[ITEMS] ERROR: ${message}`);

    errors++;

}

function loadJson(fileName) {

    const filePath = path.join(

        dataDirectory,

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

function validateItems() {

    const itemsData = loadJson("items.json");

    const bonusesData = loadJson("bonuses.json");

    const lootData = loadJson("lootTables.json");

    if (!itemsData || !bonusesData || !lootData) {

        return false;

    }

    if (!Array.isArray(itemsData.items)) {

        error("items.json doit contenir un tableau 'items'.");

    }

    if (!Array.isArray(bonusesData.bonuses)) {

        error("bonuses.json doit contenir un tableau 'bonuses'.");

    }

    if (!Array.isArray(lootData.lootTables)) {

        error(

            "lootTables.json doit contenir un tableau 'lootTables'."

        );

    }

    const itemIds = new Set(

        (itemsData.items || []).map(item => item.id)

    );

    for (const table of lootData.lootTables || []) {

        if (!table.id || !Array.isArray(table.entries)) {

            error(

                `Table de loot invalide: ${table.id ?? "sans id"}.`

            );

            continue;

        }

        for (const entry of table.entries) {

            if (!itemIds.has(entry.item)) {

                error(

                    `Item '${entry.item}' utilisé par '${table.id}' introuvable.`

                );

            }

        }

    }

    return errors === 0;

}

if (!validateItems()) {

    process.exitCode = 1;

    console.error("Validation des items échouée.");

} else {

    console.log("Validation des items réussie.");

}