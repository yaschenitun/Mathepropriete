export class GameConfig {

    constructor() {

        /* ===========================
           MOTEUR
        =========================== */

        this.targetFPS = 60;
        this.fixedTimeStep = 1 / 60;

        /* ===========================
           AFFICHAGE
        =========================== */

        this.antialias = true;
        this.alpha = false;
        this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        this.backgroundColor = 0x87ceeb;

        this.shadows = true;

        /* ===========================
           CAMERA
        =========================== */

        this.camera = {

            fov: 70,

            near: 0.1,

            far: 2500

        };

        /* ===========================
           MONDE
        =========================== */

        this.world = {

            seed: Date.now(),

            chunkSize: 32,

            renderDistance: 6,

            unloadDistance: 8,

            worldHeight: 128,

            waterLevel: 24

        };

        /* ===========================
           JOUEUR
        =========================== */

        this.player = {

            walkSpeed: 5,

            sprintSpeed: 8,

            rotationSpeed: 10,

            interactionDistance: 3

        };

        /* ===========================
           RESEAU
        =========================== */

        this.network = {

            tickRate: 20,

            interpolationDelay: 100,

            snapshotRate: 20

        };

        /* ===========================
           GAMEPLAY
        =========================== */

        this.gameplay = {

            chestRespawnTime: 30,

            maxPlayers: 32,

            victoryScore: 1000

        };

        /* ===========================
           DEBUG
        =========================== */

        this.debug = {

            enabled: true,

            showFPS: false,

            showChunks: false,

            showColliders: false,

            wireframe: false

        };

    }

}