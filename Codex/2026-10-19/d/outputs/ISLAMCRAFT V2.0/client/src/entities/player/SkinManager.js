export class SkinManager {

    constructor(game) {

        this.game = game;

        this.availableSkins = new Map();

        this.loadedSkins = new Map();

        this.defaultSkin = "default";

    }

    async initialize() {

        console.log("SkinManager initialisé.");

    }

    registerSkin(id, skinData) {

        this.availableSkins.set(

            id,

            skinData

        );

    }

    hasSkin(id) {

        return this.availableSkins.has(id);

    }

    getSkin(id) {

        return this.availableSkins.get(id);

    }

    applySkin(playerModel, skinId) {

        if (!playerModel) {

            return false;

        }

        if (!this.availableSkins.has(skinId)) {

            skinId = this.defaultSkin;

        }

        const skin = this.availableSkins.get(skinId);

        if (!skin) {

            return false;

        }

        if (typeof skin.apply === "function") {

            skin.apply(playerModel);

        }

        playerModel.skinId = skinId;

        return true;

    }

    removeSkin(playerModel) {

        if (!playerModel) {

            return;

        }

        playerModel.skinId = null;

    }

    preloadSkin(id, asset) {

        this.loadedSkins.set(

            id,

            asset

        );

    }

    getLoadedSkin(id) {

        return this.loadedSkins.get(id);

    }

    update(deltaTime) {

        // Future :
        // téléchargement des skins
        // cache
        // skins premium
        // skins saisonniers
        // synchronisation réseau

    }

}