export class QuizSession {

    constructor(game) {

        this.game = game;

        this.active = false;

        this.source = null;

        this.questions = [];

        this.currentIndex = 0;

        this.score = 0;

        this.correctAnswers = 0;

        this.wrongAnswers = 0;

        this.startTime = 0;

        this.elapsedTime = 0;

    }

    async initialize() {

        console.log("QuizSession initialisée.");

    }

    setSource(source) {

        this.source = source;

    }

    reset() {

        this.active = false;

        this.questions = [];

        this.currentIndex = 0;

        this.score = 0;

        this.correctAnswers = 0;

        this.wrongAnswers = 0;

        this.elapsedTime = 0;

    }

    start() {

        this.questions =

            this.game.questionSelector?.select(

                this.source

            ) ?? [];

        this.active = true;

        this.startTime = performance.now();

    }

    getCurrentQuestion() {

        return this.questions[

            this.currentIndex

        ] ?? null;

    }

    submitAnswer(answer) {

        const question =

            this.getCurrentQuestion();

        if (!question) {

            return {

                correct: false,

                finished: true

            };

        }

        const correct =

            this.game.answerController?.check(

                question,

                answer

            ) ?? false;

        if (correct) {

            this.correctAnswers++;

            this.score +=

                question.points ?? 1;

        } else {

            this.wrongAnswers++;

        }

        this.currentIndex++;

        return {

            correct,

            finished:

                this.currentIndex >=

                this.questions.length,

            score: this.score,

            currentQuestion:

                this.getCurrentQuestion()

        };

    }

    finish() {

        this.active = false;

    }

    cancel() {

        this.active = false;

    }

    update(deltaTime) {

        if (!this.active) {

            return;

        }

        this.elapsedTime += deltaTime;

    }

}