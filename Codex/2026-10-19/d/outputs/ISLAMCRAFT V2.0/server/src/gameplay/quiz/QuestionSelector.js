export class QuestionSelector {

    constructor(options = {}) {

        this.random =
            options.random ??
            Math.random;

    }

    filter(questions, filters = {}) {

        if (!Array.isArray(questions)) {
            return [];
        }

        return questions.filter(
            question => {

                if (
                    filters.category &&
                    question.category !==
                        filters.category
                ) {

                    return false;

                }

                if (
                    filters.difficulty &&
                    question.difficulty !==
                        filters.difficulty
                ) {

                    return false;

                }

                if (
                    filters.type &&
                    question.type !==
                        filters.type
                ) {

                    return false;

                }

                if (
                    filters.tags?.length
                ) {

                    const tags =
                        Array.isArray(
                            question.tags
                        )
                            ? question.tags
                            : [];

                    if (
                        !filters.tags.some(
                            tag =>
                                tags.includes(tag)
                        )
                    ) {

                        return false;

                    }

                }

                return true;

            }
        );

    }

    shuffle(questions) {

        const result = [
            ...questions
        ];

        for (
            let i = result.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    this.random() * (i + 1)
                );

            [
                result[i],
                result[j]
            ] = [
                result[j],
                result[i]
            ];

        }

        return result;

    }

    select(
        questions,
        count = 1,
        filters = {},
        excludeIds = []
    ) {

        const excluded =
            new Set(excludeIds);

        const filtered =
            this.filter(
                questions,
                filters
            ).filter(
                question =>
                    !excluded.has(
                        question.id
                    )
            );

        return this.shuffle(
            filtered
        ).slice(
            0,
            Math.max(
                0,
                Number(count)
            )
        );

    }

}