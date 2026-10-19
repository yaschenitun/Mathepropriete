import { Game } from "./src/core/Game.js";

const loadingScreen =
    document.getElementById("loading-screen");

const loadingMessage =
    document.getElementById("loading-message");

const loadingProgress =
    document.getElementById("loading-progress");

function setLoading(
    message,
    progress = null
) {

    if (loadingMessage) {

        loadingMessage.textContent =
            message;

    }

    if (
        loadingProgress &&
        progress !== null
    ) {

        const value =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(progress)
                )
            );

        loadingProgress.style.width =
            `${value}%`;

        loadingProgress.setAttribute(
            "aria-valuenow",
            String(value)
        );

    }

}

function hideLoading() {

    if (!loadingScreen) {

        return;

    }

    loadingScreen.classList.add(
        "loading-screen-hidden"
    );

    setTimeout(
        () => {

            loadingScreen.hidden =
                true;

        },
        350
    );

}

function showError(error) {

    console.error(
        "Erreur pendant le démarrage d'ISLAMCRAFT :",
        error
    );

    if (loadingMessage) {

        loadingMessage.textContent =
            "Impossible de charger ISLAMCRAFT.";

    }

    if (loadingScreen) {

        loadingScreen.classList.remove(
            "loading-screen-hidden"
        );

    }

    const existing =
        document.getElementById(
            "startup-error"
        );

    if (existing) {

        existing.remove();

    }

    const errorElement =
        document.createElement(
            "p"
        );

    errorElement.id =
        "startup-error";

    errorElement.className =
        "startup-error";

    errorElement.textContent =
        error?.message ??
        "Une erreur inconnue est survenue.";

    loadingScreen
        ?.querySelector(
            ".loading-content"
        )
        ?.appendChild(
            errorElement
        );

}

async function bootstrap() {

    try {

        setLoading(
            "Initialisation du moteur...",
            10
        );

        const game =
            new Game();

        setLoading(
            "Chargement de la scène...",
            30
        );

        await game.initialize();

        setLoading(
            "Démarrage du jeu...",
            80
        );

        game.start();

        window.ISLAMCRAFT =
            game;

        setLoading(
            "ISLAMCRAFT prêt !",
            100
        );

        hideLoading();

        console.log(
            "ISLAMCRAFT client prêt."
        );

    } catch (error) {

        showError(
            error
        );

    }

}

window.addEventListener(
    "DOMContentLoaded",
    bootstrap,
    {
        once: true
    }
);