export const PlayerState = Object.freeze({

    CONNECTING: "connecting",

    ACTIVE: "active",

    DEAD: "dead",

    DISCONNECTED: "disconnected"

});

export function isValidPlayerState(state) {

    return Object.values(PlayerState).includes(state);

}