import { LocalPlayer } from "./player/LocalPlayer.js";
import { RemotePlayer } from "./player/RemotePlayer.js";
import { Chest } from "./chest/Chest.js";
import { WorldObject } from "./world/WorldObject.js";
import { InteractiveObject } from "./world/InteractiveObject.js";
import { Collectible } from "./world/Collectible.js";

export class EntityFactory {

    constructor(game) {

        this.game = game;

    }

    async initialize() {

        console.log("EntityFactory initialisé.");

    }

    create(type, data = {}) {

        switch (type) {

            case "localPlayer":

                return new LocalPlayer(
                    this.game,
                    data
                );

            case "remotePlayer":

                return new RemotePlayer(
                    this.game,
                    data
                );

            case "chest":

                return new Chest(
                    this.game,
                    data
                );

            case "worldObject":

                return new WorldObject(
                    this.game,
                    data
                );

            case "interactiveObject":

                return new InteractiveObject(
                    this.game,
                    data
                );

            case "collectible":

                return new Collectible(
                    this.game,
                    data
                );

            default:

                throw new Error(

                    `Type d'entité inconnu : ${type}`

                );

        }

    }

}