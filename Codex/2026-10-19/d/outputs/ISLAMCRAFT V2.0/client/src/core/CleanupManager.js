export class CleanupManager {

    constructor() {

        this.tasks = new Set();

    }

    register(task) {

        if (typeof task !== "function") {

            throw new Error("CleanupManager : la tâche doit être une fonction.");

        }

        this.tasks.add(task);

    }

    unregister(task) {

        this.tasks.delete(task);

    }

    cleanup() {

        for (const task of this.tasks) {

            try {

                task();

            } catch (error) {

                console.error("Erreur pendant le nettoyage :", error);

            }

        }

        this.tasks.clear();

    }

    destroy() {

        this.cleanup();

    }

}