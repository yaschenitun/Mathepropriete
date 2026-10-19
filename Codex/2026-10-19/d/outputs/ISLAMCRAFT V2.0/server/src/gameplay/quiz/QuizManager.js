import { AnswerValidator } from "./AnswerValidator.js";
import { DifficultyManager } from "./DifficultyManager.js";
import { QuestionSelector } from "./QuestionSelector.js";
import { QuizSession } from "./QuizSession.js";
import { QuizRewardManager } from "./QuizRewardManager.js";

export class QuizManager {

    constructor(options = {}) {

        this.questions = new Map();

        this.sessions = new Map();

        this.nextSessionId = 1;

        this.answerValidator =
            options.answerValidator ??
            new AnswerValidator(options);

        this.difficultyManager =
            options.difficultyManager ??
            new DifficultyManager(options);

        this.questionSelector =
            options.questionSelector ??
            new QuestionSelector(options);

        this.rewardManager =
            options.rewardManager ??
            new QuizRewardManager(options);

        if (Array.isArray(options.questions)) {

            this.loadQuestions(
                options.questions
            );

        }

    }

    initialize(services = {}) {

        this.rewardManager.initialize(
            services
        );

        return this;

    }

    loadQuestions(questions) {

        for (const question of questions) {

            if (question?.id) {

                this.questions.set(
                    question.id,
                    {
                        ...question
                    }
                );

            }

        }

        return this;

    }

    addQuestion(question) {

        if (
            !question ||
            !question.id
        ) {

            throw new TypeError(
                "A valid question with an id is required."
            );

        }

        this.questions.set(
            question.id,
            {
                ...question
            }
        );

        return question;

    }

    removeQuestion(id) {

        return this.questions.delete(id);

    }

    getQuestion(id) {

        return (
            this.questions.get(id) ??
            null
        );

    }

    getQuestions(filters = {}) {

        return this.questionSelector.filter(
            [
                ...this.questions.values()
            ],
            filters
        );

    }

    generateSessionId() {

        return `quiz_${this.nextSessionId++}`;

    }

    createSession(
        playerId,
        options = {}
    ) {

        const count =
            Math.max(
                1,
                Number(
                    options.questionCount ?? 10
                )
            );

        const questions =
            this.questionSelector.select(
                [
                    ...this.questions.values()
                ],
                count,
                {

                    category:
                        options.category,

                    difficulty:
                        options.difficulty,

                    type:
                        options.type,

                    tags:
                        options.tags

                }
            );

        const id =
            options.id ??
            this.generateSessionId();

        const session =
            new QuizSession({

                id,

                playerId,

                questions

            });

        this.sessions.set(
            id,
            session
        );

        return session;

    }

    getSession(id) {

        return (
            this.sessions.get(id) ??
            null
        );

    }

    startSession(id) {

        const session =
            this.getSession(id);

        if (!session) {

            return {

                success: false,

                reason:
                    "session_not_found"

            };

        }

        return {

            success:
                session.start(),

            session

        };

    }

    submitAnswer(
        sessionId,
        answer,
        options = {}
    ) {

        const session =
            this.getSession(
                sessionId
            );

        if (!session) {

            return {

                success: false,

                reason:
                    "session_not_found"

            };

        }

        const question =
            session.getCurrentQuestion();

        if (!question) {

            return {

                success: false,

                reason:
                    "no_current_question"

            };

        }

        let validation;

        if (
            options.index !== undefined ||
            question.type === "multiple_choice"
        ) {

            validation =
                this.answerValidator.validateIndex(
                    question,
                    options.index ??
                    answer
                );

        } else {

            validation =
                this.answerValidator.validate(
                    question,
                    answer
                );

        }

        const difficulty =
            this.difficultyManager.get(
                question.difficulty
            );

        const points =
            validation.correct
                ? Number(
                    question.points ??
                    1
                ) *
                  Number(
                    difficulty?.multiplier ?? 1
                  )
                : 0;

        const result =
            session.submitAnswer({

                answer,

                correct:
                    validation.correct,

                points

            });

        return {

            ...result,

            validation,

            questionId:
                question.id,

            difficulty:
                question.difficulty ?? null

        };

    }

    finishSession(
        sessionId,
        player = null,
        options = {}
    ) {

        const session =
            this.getSession(
                sessionId
            );

        if (!session) {

            return {

                success: false,

                reason:
                    "session_not_found"

            };

        }

        session.finish();

        let reward = null;

        if (player) {

            reward =
                this.rewardManager.grant(
                    player,
                    session,
                    options
                );

        }

        return {

            success: true,

            session:
                session.serialize(),

            reward

        };

    }

    deleteSession(id) {

        return this.sessions.delete(id);

    }

    getActiveSessions() {

        return [
            ...this.sessions.values()
        ].filter(
            session =>
                session.status === "active"
        );

    }

    getQuestionCount() {

        return this.questions.size;

    }

    clear() {

        this.questions.clear();

        this.sessions.clear();

    }

}