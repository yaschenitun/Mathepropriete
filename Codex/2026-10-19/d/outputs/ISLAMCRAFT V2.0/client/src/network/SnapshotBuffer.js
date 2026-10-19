export class SnapshotBuffer {

    constructor() {

        this.snapshots = [];

        this.maxSnapshots = 64;

    }

    async initialize() {

        console.log("SnapshotBuffer initialisé.");

    }

    add(snapshot) {

        if (!snapshot) {

            return;

        }

        this.snapshots.push(snapshot);

        if (this.snapshots.length > this.maxSnapshots) {

            this.snapshots.shift();

        }

    }

    getLatest() {

        if (this.snapshots.length === 0) {

            return null;

        }

        return this.snapshots[this.snapshots.length - 1];

    }

    getPrevious() {

        if (this.snapshots.length < 2) {

            return null;

        }

        return this.snapshots[this.snapshots.length - 2];

    }

    getAll() {

        return [...this.snapshots];

    }

    clear() {

        this.snapshots.length = 0;

    }

    size() {

        return this.snapshots.length;

    }

    update(deltaTime) {

        // Les snapshots sont consommés par
        // RemoteInterpolation et
        // RemoteExtrapolation.

    }

}