export class AnswerController {

    constructor(game) {

        this.game = game;

        this.caseSensitive = false;

    }

    async initialize() {

        console.log("AnswerController initialisé.");

    }

    check(question, answer) {

        if (!question) {

            return false;

        }

        if (Array.isArray(question.correctAnswers)) {

            return this.checkMultiple(

                question,

                answer

            );

        }

        return this.checkSingle(

            question,

            answer

        );

    }

    checkSingle(question, answer) {

        const expected =

            this.normalize(

                question.correctAnswer

            );

        const received =

            this.normalize(

                answer

            );

        return expected === received;

    }

    checkMultiple(question, answers) {

        if (!Array.isArray(answers)) {

            return false;

        }

        const expected =

            question.correctAnswers

                .map(value => this.normalize(value))

                .sort();

        const received =

            answers

                .map(value => this.normalize(value))

                .sort();

        if (expected.length !== received.length) {

            return false;

        }

        for (let i = 0; i < expected.length; i++) {

            if (expected[i] !== received[i]) {

                return false;

            }

        }

        return true;

    }

    normalize(value) {

        if (value === undefined || value === null) {

            return "";

        }

        value = String(value).trim();

        if (!this.caseSensitive) {

            value = value.toLowerCase();

        }

        return value;

    }

}