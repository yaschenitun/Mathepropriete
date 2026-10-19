export class PacketValidator {

    constructor(options = {}) {

        this.maxPayloadSize =
            Number(options.maxPayloadSize ?? 64 * 1024);

        this.allowedTypes =
            new Set(
                options.allowedTypes ?? []
            );

        this.requireType =
            options.requireType !== false;

    }

    validate(packet) {

        if (
            packet === null ||
            packet === undefined
        ) {

            return {
                valid: false,
                reason: "empty_packet"
            };

        }

        if (
            typeof packet !== "object" &&
            typeof packet !== "string"
        ) {

            return {
                valid: false,
                reason: "invalid_packet_type"
            };

        }

        let payload;

        try {

            payload =
                typeof packet === "string"
                    ? JSON.parse(packet)
                    : packet;

        } catch {

            return {
                valid: false,
                reason: "invalid_json"
            };

        }

        if (
            payload === null ||
            typeof payload !== "object"
        ) {

            return {
                valid: false,
                reason: "invalid_payload"
            };

        }

        if (
            this.requireType &&
            typeof payload.type !== "string"
        ) {

            return {
                valid: false,
                reason: "missing_packet_type"
            };

        }

        if (
            this.allowedTypes.size > 0 &&
            !this.allowedTypes.has(payload.type)
        ) {

            return {
                valid: false,
                reason: "packet_type_not_allowed"
            };

        }

        const serialized =
            JSON.stringify(payload);

        if (
            serialized.length >
            this.maxPayloadSize
        ) {

            return {
                valid: false,
                reason: "payload_too_large"
            };

        }

        return {

            valid: true,

            packet: payload,

            size:
                serialized.length

        };

    }

    addAllowedType(type) {

        if (type) {

            this.allowedTypes.add(
                type
            );

        }

        return this;

    }

    removeAllowedType(type) {

        this.allowedTypes.delete(
            type
        );

        return this;

    }

    isAllowedType(type) {

        return (
            this.allowedTypes.size === 0 ||
            this.allowedTypes.has(type)
        );

    }

}