export class QuestionBox {

    constructor(game) {

        this.game = game;

        this.visible = false;

        this.question = null;
        this.container = null;
        this.feedback = null;

    }

    async initialize() {

        this.createDOM();
        console.log("QuestionBox initialisé.");

    }

    createDOM() {
        if (this.container) return;
        const container = document.createElement("section");
        container.setAttribute("aria-live", "polite");
        Object.assign(container.style, { position: "fixed", inset: "0", display: "none", zIndex: "2000", background: "rgba(0, 0, 0, .62)", color: "#fff", padding: "20px", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif" });
        document.body.appendChild(container);
        this.container = container;
    }

    show(question = null) {

        this.question = question;

        this.visible = true;
        this.render();

        this.game.eventBus?.emit(

            "quiz:question-shown",

            question

        );

    }

    hide() {

        this.visible = false;
        if (this.container) this.container.style.display = "none";

    }

    setQuestion(question) {

        this.question = question;
        this.render();

    }

    getQuestion() {

        return this.question;

    }

    isVisible() {

        return this.visible;

    }

    update(deltaTime) {

        if (!this.visible) {

            return;

        }

    }

    render() {
        if (!this.container || !this.question) return;
        this.container.replaceChildren();
        this.container.style.display = "flex";
        const card = document.createElement("div");
        Object.assign(card.style, { width: "min(580px, 100%)", padding: "24px", borderRadius: "18px", background: "#13231c", border: "1px solid #d4af37", boxShadow: "0 12px 42px #000" });
        const title = document.createElement("h2"); title.textContent = "Question du trésor";
        const prompt = document.createElement("p"); prompt.textContent = this.question.question; prompt.style.fontSize = "20px";
        const answers = document.createElement("div"); answers.style.display = "grid"; answers.style.gap = "10px";
        (this.question.answers ?? []).forEach((answer, index) => {
            const button = document.createElement("button"); button.type = "button"; button.textContent = answer;
            Object.assign(button.style, { padding: "13px", borderRadius: "10px", border: "1px solid #d4af37", color: "#fff", background: "#214432", cursor: "pointer", fontSize: "16px", textAlign: "left" });
            button.addEventListener("click", () => this.game.handleQuizAnswer(index), { once: true }); answers.appendChild(button);
        });
        this.feedback = document.createElement("p"); this.feedback.style.minHeight = "1.2em";
        card.append(title, prompt, answers, this.feedback); this.container.appendChild(card);
    }

    showFeedback(correct) {
        if (!this.feedback) return;
        this.feedback.textContent = correct ? "Bonne réponse ! +50 points et +20 XP" : "Mauvaise réponse. Continue !";
        this.feedback.style.color = correct ? "#8ee58b" : "#ffabab";
    }

}
