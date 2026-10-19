export const ChestState = Object.freeze({

    CLOSED: "closed",

    OPENING: "opening",

    OPEN: "open",

    EMPTY: "empty",

    RESPAWNING: "respawning"

});

export function isValidChestState(state) {

    return Object.values(ChestState).includes(state);

}