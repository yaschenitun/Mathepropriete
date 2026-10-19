export class QuestionSelector {

    constructor(game) {

        this.game = game;

        this.random = Math.random;

    }

    async initialize() {

        console.log("QuestionSelector initialisé.");

    }

    select(source = null) {

        const database =

            this.game.questionDatabase?.getQuestions(

                source

            ) ?? [];

        if (database.length === 0) {

            return [];

        }

        const difficulty =

            this.game.difficultyController?.getDifficulty()

            ?? "easy";

        const filtered = database.filter(

            question =>

                !question.difficulty ||

                question.difficulty === difficulty

        );

        const shuffled =

            [...filtered].sort(

                () => this.random() - 0.5

            );

        const count =

            this.game.config?.quiz?.questionsPerQuiz

            ?? 5;

        return shuffled.slice(0, count);

    }

    selectByCategory(category) {

        return this.select(category);

    }

    selectDailyQuestions() {

        return this.select("daily");

    }

    selectChallengeQuestions() {

        return this.select("challenge");

    }

}