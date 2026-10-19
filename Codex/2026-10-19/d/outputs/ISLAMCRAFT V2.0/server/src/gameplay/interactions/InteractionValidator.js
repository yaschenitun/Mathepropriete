export class InteractionValidator {

    constructor(options = {}) {

        this.maxDistance =
            Number(options.maxDistance ?? 6);

        this.allowedTypes =
            new Set(
                options.allowedTypes ?? [
                    "block",
                    "entity",
                    "item",
                    "chest",
                    "npc"
                ]
            );

    }

    validateDistance(player, target) {

        if (!player || !target) {

            return {
                valid: false,
                reason: "missing_target"
            };

        }

        const position =
            typeof player.getPosition === "function"
                ? player.getPosition()
                : player.position;

        const targetPosition =
            typeof target.getPosition === "function"
                ? target.getPosition()
                : target.position;

        if (!position || !targetPosition) {

            return {
                valid: false,
                reason: "missing_position"
            };

        }

        const dx =
            Number(position.x ?? 0) -
            Number(targetPosition.x ?? 0);

        const dy =
            Number(position.y ?? 0) -
            Number(targetPosition.y ?? 0);

        const dz =
            Number(position.z ?? 0) -
            Number(targetPosition.z ?? 0);

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy +
                dz * dz
            );

        return {
            valid:
                distance <= this.maxDistance,
            distance,
            reason:
                distance <= this.maxDistance
                    ? null
                    : "too_far"
        };

    }

    validateType(target) {

        if (!target) {

            return {
                valid: false,
                reason: "missing_target"
            };

        }

        const type =
            target.type ??
            target.interactionType ??
            target.kind;

        if (!type) {

            return {
                valid: false,
                reason: "missing_type"
            };

        }

        return {
            valid:
                this.allowedTypes.has(type),
            type,
            reason:
                this.allowedTypes.has(type)
                    ? null
                    : "invalid_type"
        };

    }

    validate(player, target, interaction = {}) {

        const distanceResult =
            this.validateDistance(
                player,
                target
            );

        if (!distanceResult.valid) {

            return distanceResult;

        }

        const typeResult =
            this.validateType(target);

        if (!typeResult.valid) {

            return typeResult;

        }

        if (
            interaction.type &&
            interaction.type !== typeResult.type
        ) {

            return {
                valid: false,
                reason: "interaction_type_mismatch"
            };

        }

        return {

            valid: true,

            distance:
                distanceResult.distance,

            type:
                typeResult.type

        };

    }

}