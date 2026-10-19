export class QuizSession {

    constructor(data = {}) {

        this.id =
            data.id ?? null;

        this.playerId =
            data.playerId ?? null;

        this.questions =
            Array.isArray(data.questions)
                ? [...data.questions]
                : [];

        this.currentIndex =
            Number(data.currentIndex ?? 0);

        this.score =
            Number(data.score ?? 0);

        this.correctAnswers =
            Number(
                data.correctAnswers ?? 0
            );

        this.wrongAnswers =
            Number(
                data.wrongAnswers ?? 0
            );

        this.startedAt =
            Number(
                data.startedAt ?? 0
            );

        this.finishedAt =
            Number(
                data.finishedAt ?? 0
            );

        this.status =
            data.status ?? "waiting";

        this.answers =
            Array.isArray(data.answers)
                ? [...data.answers]
                : [];

    }

    start(timestamp = Date.now()) {

        if (
            this.status !== "waiting"
        ) {

            return false;

        }

        this.status = "active";

        this.startedAt =
            timestamp;

        return true;

    }

    getCurrentQuestion() {

        if (
            this.currentIndex < 0 ||
            this.currentIndex >=
                this.questions.length
        ) {

            return null;

        }

        return this.questions[
            this.currentIndex
        ];

    }

    submitAnswer(result) {

        if (
            this.status !== "active"
        ) {

            return {
                accepted: false,
                reason: "session_not_active"
            };

        }

        const question =
            this.getCurrentQuestion();

        if (!question) {

            return {
                accepted: false,
                reason: "no_current_question"
            };

        }

        const answer = {

            questionId:
                question.id,

            answer:
                result.answer,

            correct:
                Boolean(result.correct),

            timestamp:
                Date.now()

        };

        this.answers.push(
            answer
        );

        if (answer.correct) {

            this.correctAnswers++;

            this.score +=
                Number(
                    result.points ?? 1
                );

        } else {

            this.wrongAnswers++;

        }

        this.currentIndex++;

        if (
            this.currentIndex >=
            this.questions.length
        ) {

            this.finish();

        }

        return {

            accepted: true,

            correct:
                answer.correct,

            score:
                this.score,

            finished:
                this.status === "finished"

        };

    }

    finish(timestamp = Date.now()) {

        if (
            this.status === "finished"
        ) {

            return false;

        }

        this.status = "finished";

        this.finishedAt =
            timestamp;

        return true;

    }

    getProgress() {

        const total =
            this.questions.length;

        return {

            current:
                Math.min(
                    this.currentIndex,
                    total
                ),

            total,

            progress:
                total > 0
                    ? Math.min(
                        1,
                        this.currentIndex / total
                    )
                    : 1

        };

    }

    serialize() {

        return {

            id: this.id,

            playerId:
                this.playerId,

            questions:
                this.questions,

            currentIndex:
                this.currentIndex,

            score:
                this.score,

            correctAnswers:
                this.correctAnswers,

            wrongAnswers:
                this.wrongAnswers,

            startedAt:
                this.startedAt,

            finishedAt:
                this.finishedAt,

            status:
                this.status,

            answers:
                [...this.answers],

            progress:
                this.getProgress()

        };

    }

}