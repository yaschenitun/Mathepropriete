export class GameState {

    constructor() {

        this.started = false;
        this.paused = false;

        this.currentState = "BOOT";

        this.previousState = null;

        this.playerReady = false;

        this.worldReady = false;

        this.networkReady = false;

        this.assetsReady = false;

        this.loadingProgress = 0;

    }

    setState(newState) {

        if (this.currentState === newState) return;

        this.previousState = this.currentState;

        this.currentState = newState;

        console.log(
            `[GameState] ${this.previousState} -> ${this.currentState}`
        );

    }

    getState() {

        return this.currentState;

    }

    is(stateName) {

        return this.currentState === stateName;

    }

    markStarted() {

        this.started = true;

    }

    markPaused(value = true) {

        this.paused = value;

    }

    isRunning() {

        return this.started && !this.paused;

    }

    setLoadingProgress(percent) {

        this.loadingProgress = Math.max(
            0,
            Math.min(100, percent)
        );

    }

    getLoadingProgress() {

        return this.loadingProgress;

    }

    setWorldReady(value = true) {

        this.worldReady = value;

    }

    setAssetsReady(value = true) {

        this.assetsReady = value;

    }

    setNetworkReady(value = true) {

        this.networkReady = value;

    }

    setPlayerReady(value = true) {

        this.playerReady = value;

    }

    isFullyReady() {

        return (
            this.worldReady &&
            this.assetsReady &&
            this.playerReady &&
            this.networkReady
        );

    }

}