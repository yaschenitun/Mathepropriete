export class MovementValidator {

    constructor(options = {}) {

        this.maxSpeed =
            Number(options.maxSpeed ?? 8);

        this.maxVerticalSpeed =
            Number(options.maxVerticalSpeed ?? 12);

        this.maxDeltaTime =
            Number(options.maxDeltaTime ?? 0.25);

        this.positionTolerance =
            Number(options.positionTolerance ?? 1.5);

    }

    validateDeltaTime(deltaTime) {

        const value = Number(deltaTime);

        if (!Number.isFinite(value) || value < 0) {

            return {
                valid: false,
                reason: "invalid_delta_time"
            };

        }

        if (value > this.maxDeltaTime) {

            return {
                valid: false,
                reason: "delta_time_too_large",
                deltaTime: value
            };

        }

        return {
            valid: true,
            deltaTime: value
        };

    }

    validateVelocity(velocity) {

        if (!velocity) {

            return {
                valid: false,
                reason: "missing_velocity"
            };

        }

        const x = Number(velocity.x ?? 0);
        const y = Number(velocity.y ?? 0);
        const z = Number(velocity.z ?? 0);

        if (
            !Number.isFinite(x) ||
            !Number.isFinite(y) ||
            !Number.isFinite(z)
        ) {

            return {
                valid: false,
                reason: "invalid_velocity"
            };

        }

        const horizontalSpeed =
            Math.sqrt(
                x * x +
                z * z
            );

        if (
            horizontalSpeed >
            this.maxSpeed
        ) {

            return {
                valid: false,
                reason: "horizontal_speed_exceeded",
                speed: horizontalSpeed
            };

        }

        if (
            Math.abs(y) >
            this.maxVerticalSpeed
        ) {

            return {
                valid: false,
                reason: "vertical_speed_exceeded",
                speed: Math.abs(y)
            };

        }

        return {
            valid: true,
            speed: horizontalSpeed
        };

    }

    validatePosition(position) {

        if (!position) {

            return {
                valid: false,
                reason: "missing_position"
            };

        }

        const x = Number(position.x);
        const y = Number(position.y);
        const z = Number(position.z);

        if (
            !Number.isFinite(x) ||
            !Number.isFinite(y) ||
            !Number.isFinite(z)
        ) {

            return {
                valid: false,
                reason: "invalid_position"
            };

        }

        return {
            valid: true,
            position: {
                x,
                y,
                z
            }
        };

    }

    validateMovement(
        currentPosition,
        nextPosition,
        velocity,
        deltaTime
    ) {

        const timeResult =
            this.validateDeltaTime(
                deltaTime
            );

        if (!timeResult.valid) {

            return timeResult;

        }

        const currentResult =
            this.validatePosition(
                currentPosition
            );

        if (!currentResult.valid) {

            return currentResult;

        }

        const nextResult =
            this.validatePosition(
                nextPosition
            );

        if (!nextResult.valid) {

            return nextResult;

        }

        const velocityResult =
            this.validateVelocity(
                velocity
            );

        if (!velocityResult.valid) {

            return velocityResult;

        }

        const dx =
            nextPosition.x -
            currentPosition.x;

        const dy =
            nextPosition.y -
            currentPosition.y;

        const dz =
            nextPosition.z -
            currentPosition.z;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy +
                dz * dz
            );

        const expectedDistance =
            Math.sqrt(
                Number(velocity.x ?? 0) ** 2 +
                Number(velocity.y ?? 0) ** 2 +
                Number(velocity.z ?? 0) ** 2
            ) * deltaTime;

        if (
            Math.abs(
                distance -
                expectedDistance
            ) >
            this.positionTolerance
        ) {

            return {
                valid: false,
                reason: "movement_distance_mismatch",
                distance,
                expectedDistance
            };

        }

        return {

            valid: true,

            distance,

            expectedDistance,

            position: {
                ...nextPosition
            }

        };

    }

}