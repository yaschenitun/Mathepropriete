import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const quizDirectory = path.resolve(

    __dirname,

    "../../data/quiz"

);

let errors = 0;

function error(message) {

    console.error(`[QUIZ] ERROR: ${message}`);

    errors++;

}

function loadJson(fileName) {

    const filePath = path.join(

        quizDirectory,

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

function validateQuiz() {

    const categories = loadJson("categories.json");
    const difficulties = loadJson("difficulties.json");
    const questions = loadJson("questions.json");

    if (!categories || !difficulties || !questions) {

        return false;

    }

    if (!Array.isArray(categories.categories)) {

        error(

            "categories.json doit contenir 'categories'."

        );

    }

    if (!Array.isArray(difficulties.difficulties)) {

        error(

            "difficulties.json doit contenir 'difficulties'."

        );

    }

    if (!Array.isArray(questions.questions)) {

        error(

            "questions.json doit contenir 'questions'."

        );

        return false;

    }

    const categoryIds = new Set(

        (categories.categories || []).map(

            category => category.id

        )

    );

    const difficultyIds = new Set(

        (difficulties.difficulties || []).map(

            difficulty => difficulty.id

        )

    );

    const questionIds = new Set();

    for (const question of questions.questions) {

        if (!question.id) {

            error("Une question ne possède pas d'identifiant.");

        } else if (questionIds.has(question.id)) {

            error(`Identifiant de question dupliqué: ${question.id}.`);

        } else {

            questionIds.add(question.id);

        }

        if (!categoryIds.has(question.category)) {

            error(

                `Catégorie '${question.category}' introuvable pour ${question.id}.`

            );

        }

        if (!difficultyIds.has(question.difficulty)) {

            error(

                `Difficulté '${question.difficulty}' introuvable pour ${question.id}.`

            );

        }

        if (!Array.isArray(question.answers)) {

            error(

                `Réponses manquantes pour ${question.id}.`

            );

            continue;

        }

        if (

            !Number.isInteger(question.correctAnswer) ||

            question.correctAnswer < 0 ||

            question.correctAnswer >= question.answers.length

        ) {

            error(

                `Réponse correcte invalide pour ${question.id}.`

            );

        }

    }

    return errors === 0;

}

if (!validateQuiz()) {

    process.exitCode = 1;

    console.error("Validation du quiz échouée.");

} else {

    console.log("Validation du quiz réussie.");

}