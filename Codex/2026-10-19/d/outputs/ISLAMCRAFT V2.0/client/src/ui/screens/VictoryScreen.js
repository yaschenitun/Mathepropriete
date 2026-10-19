export class VictoryScreen {

    constructor(game) {

        this.game = game;

        this.visible = false;

        this.data = null;
        this.element = null;

    }

    async initialize() {

        this.element = document.createElement("section");
        Object.assign(this.element.style, { position: "fixed", inset: "0", display: "none", zIndex: "2100", color: "#fff", background: "rgba(7, 22, 14, .9)", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif", textAlign: "center", padding: "20px" });
        document.body.appendChild(this.element);
        console.log("VictoryScreen initialisé.");

    }

    show(data = null) {

        this.data = data;

        this.visible = true;
        this.render();

        this.game.eventBus?.emit(

            "screen:victory-shown",

            data

        );

    }

    hide() {

        this.visible = false;
        if (this.element) this.element.style.display = "none";

        this.data = null;

        this.game.eventBus?.emit(

            "screen:victory-hidden"

        );

    }

    getData() {

        return this.data;

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
        if (!this.element) return;
        this.element.replaceChildren();
        this.element.style.display = "flex";
        const card = document.createElement("div");
        const heading = document.createElement("h1"); heading.textContent = "🏆 Victoire !";
        const details = document.createElement("p"); details.textContent = `Les ${this.data?.treasures ?? 0} trésors ont été trouvés. Score final : ${this.data?.score ?? 0}`;
        const restart = document.createElement("button"); restart.type = "button"; restart.textContent = "Rejouer";
        Object.assign(restart.style, { padding: "12px 24px", borderRadius: "10px", border: "0", background: "#d4af37", fontWeight: "700", cursor: "pointer" });
        restart.addEventListener("click", () => window.location.reload());
        card.append(heading, details, restart); this.element.appendChild(card);
    }

}
