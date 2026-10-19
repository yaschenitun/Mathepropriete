export class LootTable {

    constructor(data = {}) {

        this.id = data.id ?? null;

        this.rolls = Math.max(
            1,
            Number(data.rolls ?? 1)
        );

        this.entries = Array.isArray(data.entries)
            ? data.entries.map(entry => ({ ...entry }))
            : [];

    }

    addEntry(entry) {

        if (!entry || !entry.item) {

            throw new TypeError(
                "Une entrée de loot valide est requise."
            );

        }

        this.entries.push({
            ...entry
        });

        return this;

    }

    removeEntry(itemId) {

        const index = this.entries.findIndex(
            entry => entry.item === itemId
        );

        if (index === -1) {

            return false;

        }

        this.entries.splice(index, 1);

        return true;

    }

    getEntries() {

        return this.entries.map(
            entry => ({ ...entry })
        );

    }

    getTotalWeight() {

        return this.entries.reduce(
            (total, entry) =>
                total +
                Math.max(
                    0,
                    Number(entry.weight ?? 1)
                ),
            0
        );

    }

    isEmpty() {

        return this.entries.length === 0;

    }

    serialize() {

        return {

            id: this.id,

            rolls: this.rolls,

            entries: this.getEntries()

        };

    }

}