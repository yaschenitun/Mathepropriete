import {
    PlayerState,
    isValidPlayerState
} from "./PlayerState.js";

export class PlayerEntity {

    constructor(data = {}) {

        this.id = data.id ?? null;

        this.type = "player";

        this.name = data.name ?? "Player";

        this.state =

            isValidPlayerState(data.state)

                ? data.state

                : PlayerState.CONNECTING;

        this.position = {

            x: Number(data.position?.x ?? 0),

            y: Number(data.position?.y ?? 0),

            z: Number(data.position?.z ?? 0)

        };

        this.rotation = {

            x: Number(data.rotation?.x ?? 0),

            y: Number(data.rotation?.y ?? 0),

            z: Number(data.rotation?.z ?? 0)

        };

        this.velocity = {

            x: 0,

            y: 0,

            z: 0

        };

        this.health = Number(data.health ?? 100);

        this.maxHealth = Number(data.maxHealth ?? 100);

        this.xp = Number(data.xp ?? 0);

        this.level = Number(data.level ?? 1);

        this.score = Number(data.score ?? 0);

        this.skinId = data.skinId ?? "default";

        this.socketId = data.socketId ?? null;

        this.connectedAt = Date.now();

    }

    setState(state) {

        if (!isValidPlayerState(state)) {

            throw new Error(

                `État joueur invalide: ${state}`

            );

        }

        this.state = state;

    }

    setPosition(x, y, z) {

        this.position.x = Number(x);

        this.position.y = Number(y);

        this.position.z = Number(z);

    }

    setRotation(x, y, z) {

        this.rotation.x = Number(x);

        this.rotation.y = Number(y);

        this.rotation.z = Number(z);

    }

    setVelocity(x, y, z) {

        this.velocity.x = Number(x);

        this.velocity.y = Number(y);

        this.velocity.z = Number(z);

    }

    addXp(amount) {

        const value = Number(amount);

        if (!Number.isFinite(value) || value < 0) {

            return false;

        }

        this.xp += value;

        this.updateLevel();

        return true;

    }

    updateLevel() {

        this.level = Math.max(

            1,

            Math.floor(this.xp / 100) + 1

        );

    }

    addScore(amount) {

        const value = Number(amount);

        if (!Number.isFinite(value) || value < 0) {

            return false;

        }

        this.score += value;

        return true;

    }

    damage(amount) {

        const value = Number(amount);

        if (!Number.isFinite(value) || value < 0) {

            return false;

        }

        this.health = Math.max(

            0,

            this.health - value

        );

        if (this.health === 0) {

            this.setState(PlayerState.DEAD);

        }

        return true;

    }

    heal(amount) {

        const value = Number(amount);

        if (!Number.isFinite(value) || value < 0) {

            return false;

        }

        this.health = Math.min(

            this.maxHealth,

            this.health + value

        );

        return true;

    }

    respawn(position = {}) {

        this.setPosition(

            position.x ?? 0,

            position.y ?? 0,

            position.z ?? 0

        );

        this.health = this.maxHealth;

        this.setState(PlayerState.ACTIVE);

    }

    update(deltaTime) {

        if (this.state !== PlayerState.ACTIVE) {

            return;

        }

        this.position.x +=

            this.velocity.x * deltaTime;

        this.position.y +=

            this.velocity.y * deltaTime;

        this.position.z +=

            this.velocity.z * deltaTime;

    }

    serialize() {

        return {

            id: this.id,

            type: this.type,

            name: this.name,

            state: this.state,

            position: { ...this.position },

            rotation: { ...this.rotation },

            velocity: { ...this.velocity },

            health: this.health,

            maxHealth: this.maxHealth,

            xp: this.xp,

            level: this.level,

            score: this.score,

            skinId: this.skinId

        };

    }

    destroy() {

        this.socketId = null;

        this.setState(PlayerState.DISCONNECTED);

    }

}