export class LeaderboardController {

    constructor(game) {

        this.game = game;

        this.entries = [];

        this.maxEntries = 100;

    }

    async initialize() {

        console.log("LeaderboardController initialisé.");

    }

    addEntry(playerId, playerName, score) {

        const existing = this.entries.find(

            entry => entry.playerId === playerId

        );

        if (existing) {

            existing.score = Math.max(

                existing.score,

                score

            );

        } else {

            this.entries.push({

                playerId,

                playerName,

                score

            });

        }

        this.sort();

        this.trim();

        this.game.eventBus?.emit(

            "leaderboard:updated",

            this.entries

        );

    }

    sort() {

        this.entries.sort(

            (a, b) => b.score - a.score

        );

    }

    trim() {

        if (this.entries.length > this.maxEntries) {

            this.entries.length = this.maxEntries;

        }

    }

    getEntries() {

        return [...this.entries];

    }

    getPlayerRank(playerId) {

        return this.entries.findIndex(

            entry => entry.playerId === playerId

        ) + 1;

    }

    clear() {

        this.entries.length = 0;

    }

    update(deltaTime) {

        // Réservé :
        // Synchronisation réseau
        // Classement mondial
        // Classement hebdomadaire
        // Classement par mode de jeu

    }

}