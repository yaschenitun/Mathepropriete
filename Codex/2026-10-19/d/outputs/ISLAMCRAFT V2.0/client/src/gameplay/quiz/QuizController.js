export class QuizController {

    constructor(game) {

        this.game = game;

        this.currentSession = null;

        this.enabled = true;

    }

    async initialize() {

        console.log("QuizController initialisé.");

    }

    startQuiz(source) {

        if (!this.enabled) {

            return false;

        }

        if (this.currentSession) {

            return false;

        }

        const session = this.game.quizSession;

        if (!session) {

            return false;

        }

        session.reset();

        session.setSource(source);

        session.start();

        this.currentSession = session;

        this.game.uiManager?.openQuiz(session);

        return true;

    }

    submitAnswer(answer) {

        if (!this.currentSession) {

            return false;

        }

        const result =

            this.currentSession.submitAnswer(

                answer

            );

        if (result.correct) {

            this.game.quizRewards?.grant(

                result

            );

        }

        if (result.finished) {

            this.finishQuiz();

        }

        return result;

    }

    finishQuiz() {

        if (!this.currentSession) {

            return;

        }

        this.currentSession.finish();

        this.game.uiManager?.closeQuiz();

        this.currentSession = null;

    }

    cancelQuiz() {

        if (!this.currentSession) {

            return;

        }

        this.currentSession.cancel();

        this.game.uiManager?.closeQuiz();

        this.currentSession = null;

    }

    update(deltaTime) {

        if (!this.currentSession) {

            return;

        }

        this.currentSession.update(

            deltaTime

        );

    }

}