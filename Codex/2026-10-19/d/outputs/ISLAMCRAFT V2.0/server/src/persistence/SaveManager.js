export class SaveManager {

    constructor(options = {}) {

        this.stores = new Map();

        this.autoSaveInterval =
            Math.max(
                0,
                Number(options.autoSaveInterval ?? 0)
            );

        this.saveCallback =
            typeof options.saveCallback === "function"
                ? options.saveCallback
                : null;

        this.timer = null;

        this.saving = false;

    }

    registerStore(name, store) {

        if (!name) {

            throw new TypeError(
                "Store name is required."
            );

        }

        if (
            !store ||
            typeof store !== "object"
        ) {

            throw new TypeError(
                "A valid store is required."
            );

        }

        this.stores.set(
            name,
            store
        );

        return this;

    }

    unregisterStore(name) {

        return this.stores.delete(
            name
        );

    }

    getStore(name) {

        return (
            this.stores.get(name) ??
            null
        );

    }

    createSnapshot() {

        const snapshot = {

            version: 1,

            timestamp:
                Date.now(),

            stores: {}

        };

        for (
            const [name, store]
            of this.stores
        ) {

            if (
                typeof store.list ===
                "function"
            ) {

                snapshot.stores[name] =
                    store.list();

                continue;

            }

            if (
                typeof store.serialize ===
                "function"
            ) {

                snapshot.stores[name] =
                    store.serialize();

                continue;

            }

            snapshot.stores[name] = null;

        }

        return snapshot;

    }

    async save() {

        if (this.saving) {

            return {

                success: false,

                reason:
                    "save_already_in_progress"

            };

        }

        this.saving = true;

        try {

            const snapshot =
                this.createSnapshot();

            if (this.saveCallback) {

                await this.saveCallback(
                    snapshot
                );

            }

            return {

                success: true,

                snapshot

            };

        } catch (error) {

            return {

                success: false,

                reason:
                    "save_failed",

                error

            };

        } finally {

            this.saving = false;

        }

    }

    startAutoSave() {

        if (
            this.autoSaveInterval <= 0 ||
            this.timer
        ) {

            return false;

        }

        this.timer =
            setInterval(
                async () => {

                    await this.save();

                },
                this.autoSaveInterval
            );

        return true;

    }

    stopAutoSave() {

        if (!this.timer) {

            return false;

        }

        clearInterval(
            this.timer
        );

        this.timer = null;

        return true;

    }

    isSaving() {

        return this.saving;

    }

    isAutoSaving() {

        return this.timer !== null;

    }

    clearStores() {

        for (
            const store
            of this.stores.values()
        ) {

            if (
                typeof store.clear ===
                "function"
            ) {

                store.clear();

            }

        }

    }

}