import { LootTable } from "./LootTable.js";
import { LootGenerator } from "./LootGenerator.js";
import { RewardManager } from "./RewardManager.js";

export class LootManager {

    constructor(options = {}) {

        this.tables = new Map();

        this.generator =
            options.generator ??
            new LootGenerator(options);

        this.rewardManager =
            options.rewardManager ??
            new RewardManager(options);

        this.initialized = false;

    }

    initialize(services = {}) {

        if (services.inventoryService) {

            this.rewardManager.initialize(
                services
            );

        }

        this.initialized = true;

        return this;

    }

    registerTable(table) {

        const lootTable =
            table instanceof LootTable
                ? table
                : new LootTable(table);

        if (!lootTable.id) {

            throw new Error(
                "Une table de loot doit avoir un identifiant."
            );

        }

        this.tables.set(
            lootTable.id,
            lootTable
        );

        return lootTable;

    }

    unregisterTable(id) {

        return this.tables.delete(id);

    }

    getTable(id) {

        return (
            this.tables.get(id) ??
            null
        );

    }

    hasTable(id) {

        return this.tables.has(id);

    }

    generate(id, context = {}) {

        const table =
            this.getTable(id);

        if (!table) {

            return {

                success: false,

                reason:
                    "loot_table_not_found",

                rewards: []

            };

        }

        const rewards =
            this.generator.rollTable(
                table,
                context
            );

        return {

            success: true,

            tableId: id,

            rewards

        };

    }

    generateAndGive(
        player,
        tableId,
        context = {}
    ) {

        const generated =
            this.generate(
                tableId,
                context
            );

        if (!generated.success) {

            return generated;

        }

        const granted =
            this.rewardManager.give(
                player,
                generated.rewards
            );

        return {

            ...granted,

            tableId,

            generatedRewards:
                generated.rewards

        };

    }

    getTables() {

        return [
            ...this.tables.values()
        ];

    }

    serialize() {

        return this.getTables().map(
            table =>
                table.serialize()
        );

    }

    clear() {

        this.tables.clear();

    }

}