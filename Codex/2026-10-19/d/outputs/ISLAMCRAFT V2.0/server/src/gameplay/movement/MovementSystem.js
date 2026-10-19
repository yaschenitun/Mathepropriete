import { MovementValidator } from "./MovementValidator.js";
import { CollisionSystem } from "./CollisionSystem.js";
import { MovementReconciliation } from "./MovementReconciliation.js";

export class MovementSystem {

    constructor(options = {}) {

        this.validator =
            options.validator ??
            new MovementValidator(options);

        this.collision =
            options.collision ??
            new CollisionSystem(options);

        this.reconciliation =
            options.reconciliation ??
            new MovementReconciliation(options);

        this.players = new Map();

        this.enabled =
            options.enabled !== false;

    }

    initialize(world) {

        this.world = world;

        this.collision.initialize(
            world
        );

        return this;

    }

    registerPlayer(player) {

        if (!player || !player.id) {

            return false;

        }

        const position =
            typeof player.getPosition ===
            "function"
                ? player.getPosition()
                : (
                    player.position ?? {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                );

        this.players.set(
            player.id,
            {

                player,

                position: {
                    ...position
                },

                velocity: {
                    x: 0,
                    y: 0,
                    z: 0
                }

            }
        );

        return true;

    }

    unregisterPlayer(playerId) {

        this.reconciliation.clear(
            playerId
        );

        return this.players.delete(
            playerId
        );

    }

    getState(playerId) {

        return (
            this.players.get(
                playerId
            ) ?? null
        );

    }

    move(
        playerId,
        nextPosition,
        velocity = {
            x: 0,
            y: 0,
            z: 0
        },
        deltaTime = 0
    ) {

        if (!this.enabled) {

            return {

                accepted: false,

                reason:
                    "movement_disabled"

            };

        }

        const state =
            this.getState(
                playerId
            );

        if (!state) {

            return {

                accepted: false,

                reason:
                    "player_not_registered"

            };

        }

        const validation =
            this.validator.validateMovement(
                state.position,
                nextPosition,
                velocity,
                deltaTime
            );

        if (!validation.valid) {

            return {

                accepted: false,

                reason:
                    validation.reason,

                validation

            };

        }

        if (
            !this.collision.canMove(
                state.position,
                nextPosition
            )
        ) {

            return {

                accepted: false,

                reason:
                    "collision"

            };

        }

        state.position = {
            ...nextPosition
        };

        state.velocity = {
            ...velocity
        };

        if (
            typeof state.player.setPosition ===
            "function"
        ) {

            state.player.setPosition(
                nextPosition.x,
                nextPosition.y,
                nextPosition.z
            );

        } else {

            state.player.position = {
                ...nextPosition
            };

        }

        this.reconciliation.record(
            playerId,
            {

                x: nextPosition.x,

                y: nextPosition.y,

                z: nextPosition.z,

                timestamp:
                    Date.now()

            }
        );

        return {

            accepted: true,

            position: {
                ...state.position
            },

            velocity: {
                ...state.velocity
            }

        };

    }

    reconcile(
        playerId,
        clientPosition
    ) {

        const state =
            this.getState(
                playerId
            );

        if (!state) {

            return {

                corrected: true,

                reason:
                    "player_not_registered"

            };

        }

        return this.reconciliation.reconcile(
            playerId,
            state.position,
            clientPosition
        );

    }

    update(deltaTime = 0) {

        if (!this.enabled) {

            return;

        }

        for (const state of this.players.values()) {

            if (
                typeof state.player.updateMovement ===
                "function"
            ) {

                state.player.updateMovement(
                    deltaTime
                );

            }

        }

    }

    clear() {

        this.players.clear();

        this.reconciliation.clear();

    }

}