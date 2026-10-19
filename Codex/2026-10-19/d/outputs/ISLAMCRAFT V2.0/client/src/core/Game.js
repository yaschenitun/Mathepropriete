import * as THREE from "three";
import { GLTFLoader } from "../../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { GameLoop } from "./GameLoop.js";
import { GameState } from "./GameState.js";
import { GameConfig } from "./GameConfig.js";
import { Collectible } from "../entities/world/Collectible.js";
import { Renderer } from "../engine/Renderer.js";
import { SceneManager } from "../engine/SceneManager.js";
import { EnvironmentRenderer } from "../engine/EnvironmentRenderer.js";
import { Lighting } from "../engine/Lighting.js";
import { HUD } from "../ui/hud/HUD.js";
import { ScoreHUD } from "../ui/hud/ScoreHUD.js";
import { XPBar } from "../ui/hud/XPBar.js";
import { LevelDisplay } from "../ui/hud/LevelDisplay.js";
import { PlayerNameHUD } from "../ui/hud/PlayerNameHUD.js";
import { UIManager } from "../ui/UIManager.js";
import { ScoreController } from "../gameplay/score/ScoreController.js";
import { XPController } from "../gameplay/progression/XPController.js";
import { LevelController } from "../gameplay/progression/LevelController.js";
import { ProgressionController } from "../gameplay/progression/ProgressionController.js";
import { AnswerController } from "../gameplay/quiz/AnswerController.js";
import { DifficultyController } from "../gameplay/quiz/DifficultyController.js";
import { QuestionSelector } from "../gameplay/quiz/QuestionSelector.js";
import { QuizSession } from "../gameplay/quiz/QuizSession.js";
import { QuizController } from "../gameplay/quiz/QuizController.js";
import { QuestionBox } from "../ui/quiz/QuestionBox.js";
import { VictoryScreen } from "../ui/screens/VictoryScreen.js";

import { EntityFactory } from "../entities/EntityFactory.js";
import { EntityManager } from "../entities/EntityManager.js";

import { InputManager } from "../input/InputManager.js";
import { InputState } from "../input/InputState.js";
import { KeyboardInput } from "../input/KeyboardInput.js";
import { TouchInput } from "../input/TouchInput.js";
import { CameraTouchInput } from "../input/CameraTouchInput.js";
import { TouchJoystick } from "../input/TouchJoystick.js";

import { PlayerController } from "../entities/player/PlayerController.js";

import { CollisionController } from "../gameplay/movement/CollisionController.js";
import { InteractionController } from "../gameplay/interactions/InteractionController.js";

import { CameraController } from "../camera/CameraController.js";
import { CameraFollow } from "../camera/CameraFollow.js";
import { CameraOrbit } from "../camera/CameraOrbit.js";
import { CameraCollision } from "../camera/CameraCollision.js";
import { CameraSmoothing } from "../camera/CameraSmoothing.js";

import { WorldManager } from "../world/WorldManager.js";

export class Game {

    constructor() {

        this.config = new GameConfig();

        this.state = new GameState();

        this.renderer = null;

        this.environment = null;
        this.lighting = null;

        this.scene = null;
        this.world = null;

        this.entityFactory = null;
        this.entityManager = null;

        this.hud = null;
        this.uiManager = null;

        this.scoreHUD = null;
        this.xpBar = null;
        this.levelDisplay = null;
        this.playerNameHUD = null;

        this.eventBus = null;

        this.scoreController = null;
        this.xpController = null;
        this.levelController = null;
        this.progressionController = null;
        this.answerController = null;
        this.difficultyController = null;
        this.questionSelector = null;
        this.quizSession = null;
        this.quizController = null;
        this.questionBox = null;
        this.victoryScreen = null;
        this.questionDatabase = { getQuestions: () => [] };

        this.localPlayer = null;
        this.playerController = null;
        this.collisionController = null;
        this.interactionController = null; 

        this.treasureModel = null;
        this.treasures = new Map();

        this.treasuresSpawned = false;
        this.treasuresCollected = 0;

        this.treasureCount = 12;

        this.treasureLoader = null;

        this.inputState = null;
this.keyboardInput = null;
this.touchInput = null;
this.cameraTouchInput = null;
this.touchJoystick = null;
this.inputManager = null;

        this.cameraController = null;
        this.cameraFollow = null;
        this.cameraOrbit = null;
        this.cameraCollision = null;
        this.cameraSmoothing = null;

        this.loop = null;

        this.initialized = false;

    }


    async initialize() {

        if (this.initialized) {
            return;
        }

        console.log("=== ISLAMCRAFT V2.0 ===");
        console.log("Initialisation du moteur...");

        this.eventBus = this.createEventBus();
        await this.initializeGameplay();


        /*
         * SCENE
         */

        this.scene =
            new SceneManager(this);

        await this.scene.initialize();


        /*
         * ENVIRONNEMENT
         */

        this.environment =
            new EnvironmentRenderer(this);

        await this.environment.initialize();


        /*
         * LUMIÈRE
         */

        this.lighting =
            new Lighting(this);

        await this.lighting.initialize();


        /*
         * RENDERER
         */

        this.renderer =
    new Renderer(this);

await this.renderer.initialize();


/*
 * MONDE
 */

this.world =
    new WorldManager(this);

await this.world.initialize();


/*
 * INPUT
 */

        this.inputState =
            new InputState();

        this.keyboardInput =
            new KeyboardInput(this);

        await this.keyboardInput.initialize();

        this.touchInput =
    new TouchInput(this);

await this.touchInput.initialize();


this.cameraTouchInput =
    new CameraTouchInput(this);

await this.cameraTouchInput.initialize();


/*
 * JOYSTICK MOBILE
 */

this.touchJoystick =
    new TouchJoystick(this);

await this.touchJoystick.initialize();


this.inputManager =
    new InputManager(this);

        await this.inputManager.initialize();


        /*
         * ENTITÉS
         */

        this.entityFactory =
            new EntityFactory(this);

        await this.entityFactory.initialize();

        this.entityManager =
            new EntityManager(this);

        await this.entityManager.initialize();
/*
 * MODÈLE DES TRÉSORS
 */

await this.loadTreasureModel();

        /*
         * JOUEUR LOCAL
         */

        this.localPlayer =
            this.entityFactory.create(
                "localPlayer"
            );

        await this.localPlayer.initialize();

        this.entityManager.register(
            this.localPlayer
        );

        /*
 * ===========================
 * INTERFACE HUD
 * ===========================
 */

this.hud =
    new HUD(this);

this.scoreHUD =
    new ScoreHUD(this);

this.xpBar =
    new XPBar(this);

this.levelDisplay =
    new LevelDisplay(this);

this.playerNameHUD =
    new PlayerNameHUD(this);

this.hud.register(
    "score",
    this.scoreHUD
);

this.hud.register(
    "xp",
    this.xpBar
);

this.hud.register(
    "level",
    this.levelDisplay
);

this.hud.register(
    "playerName",
    this.playerNameHUD
);

await this.hud.initialize();

this.uiManager =
    new UIManager(this);

await this.uiManager.initialize();

this.hud.hide();

        this.questionBox = new QuestionBox(this);
        this.victoryScreen = new VictoryScreen(this);
        await this.questionBox.initialize();
        await this.victoryScreen.initialize();
        this.hud.show();

        /*
         * CONTRÔLE DU JOUEUR
         */

        this.playerController =
            new PlayerController(
                this,
                this.localPlayer
            );

        await this.playerController.initialize();

        /*
 * COLLISIONS DU MONDE
 */

this.collisionController =
    new CollisionController(
        this
    );

await this.collisionController.initialize();

this.interactionController =
    new InteractionController(
        this
    );

await this.interactionController.initialize();


        /*
         * CAMÉRA ORBITALE
         *
         * On la crée avant CameraController
         * car CameraController doit pouvoir
         * lui transmettre les rotations.
         */

        this.cameraOrbit =
            new CameraOrbit(this);

        this.cameraOrbit.setCamera(
            this.scene.getCamera()
        );

        this.cameraOrbit.setTarget(
            this.localPlayer
        );

        await this.cameraOrbit.initialize();


        /*
         * CONTRÔLEUR CAMÉRA
         */

        this.cameraController =
            new CameraController(this);

        await this.cameraController.initialize();

        this.cameraController.setCamera(
            this.scene.getCamera()
        );

        this.cameraController.setTarget(
            this.localPlayer
        );

        this.cameraController.setOrbit(
            this.cameraOrbit
        );


        /*
         * CAMERA FOLLOW
         *
         * Désactivée pour éviter qu'elle
         * écrase la position de CameraOrbit.
         */

        this.cameraFollow =
            new CameraFollow(this);

        this.cameraFollow.setCamera(
            this.scene.getCamera()
        );

        this.cameraFollow.setTarget(
            this.localPlayer
        );

        await this.cameraFollow.initialize();

        this.cameraFollow.setEnabled(false);


        /*
         * COLLISION CAMÉRA
         */

        this.cameraCollision =
            new CameraCollision(this);

        await this.cameraCollision.initialize();


        /*
         * LISSAGE CAMÉRA
         */

        this.cameraSmoothing =
            new CameraSmoothing(this);

        await this.cameraSmoothing.initialize();


        /*
         * GAME LOOP
         */

        this.loop =
            new GameLoop(this);


        this.initialized = true;

        console.log("Moteur prêt.");

    }

    createEventBus() {
        const listeners = new Map();
        return {
            on(event, handler) {
                const handlers = listeners.get(event) ?? new Set();
                handlers.add(handler);
                listeners.set(event, handlers);
            },
            off(event, handler) {
                listeners.get(event)?.delete(handler);
            },
            emit(event, payload) {
                for (const handler of listeners.get(event) ?? []) {
                    handler(payload);
                }
            }
        };
    }

    async initializeGameplay() {
        try {
            const response = await fetch("/data/quiz/questions.json");
            if (response.ok) {
                const data = await response.json();
                this.questionDatabase = {
                    getQuestions: source => (data.questions ?? []).filter(question =>
                        !source || !source.category || question.category === source.category
                    )
                };
            }
        } catch (error) {
            console.warn("Base de questions indisponible.", error);
        }

        this.scoreController = new ScoreController(this);
        this.xpController = new XPController(this);
        this.levelController = new LevelController(this);
        this.progressionController = new ProgressionController(this);
        this.answerController = new AnswerController(this);
        this.difficultyController = new DifficultyController(this);
        this.questionSelector = new QuestionSelector(this);
        this.quizSession = new QuizSession(this);
        this.quizController = new QuizController(this);

        for (const component of [
            this.scoreController, this.xpController, this.levelController,
            this.progressionController, this.answerController,
            this.difficultyController, this.questionSelector,
            this.quizSession, this.quizController
        ]) {
            await component.initialize();
        }
    }

    openTreasureQuiz() {
        if (!this.quizController?.startQuiz()) {
            return;
        }
        const question = this.quizSession.getCurrentQuestion();
        if (question) {
            this.questionBox.show(question);
        }
    }

    handleQuizAnswer(answerIndex) {
        const result = this.quizController?.submitAnswer(answerIndex);
        if (!result) {
            return;
        }

        const question = this.quizSession?.getCurrentQuestion();
        this.questionBox.showFeedback(result.correct);
        if (result.correct) {
            this.scoreController.addScore(50);
            this.progressionController.addXP(20);
            this.updateHUD();
        }

        window.setTimeout(() => {
            if (result.finished) {
                this.questionBox.hide();
            } else if (question) {
                this.questionBox.show(question);
            }
        }, 650);
    }

    async loadTreasureModel() {

    this.treasureLoader =
        new GLTFLoader();


    const modelURL =
        new URL(
            "../assets/low_poly_treasure_chest.glb",
            import.meta.url
        ).href;


    const gltf =
        await this.treasureLoader.loadAsync(
            modelURL
        );


    if (!gltf?.scene) {

        throw new Error(
            "Le modèle GLB du trésor ne contient aucune scène."
        );

    }


    this.treasureModel =
        gltf.scene;


    /*
     * ==================================================
     * DIMENSION AUTOMATIQUE DU TRÉSOR
     * ==================================================
     *
     * On ne dépend plus de la taille originale
     * du modèle Sketchfab.
     *
     * Le coffre sera automatiquement redimensionné
     * pour faire environ 0.9 bloc de haut.
     */

    /*
 * ==================================================
 * NORMALISATION AUTOMATIQUE DU TRÉSOR
 * ==================================================
 *
 * Le modèle Sketchfab peut avoir une échelle
 * interne énorme.
 *
 * On mesure sa vraie bounding box puis on
 * normalise le modèle pour qu'il fasse
 * exactement 0.60 bloc de haut.
 */

this.treasureModel.scale.set(
    1,
    1,
    1
);

this.treasureModel.updateMatrixWorld(
    true
);


const originalBox =
    new THREE.Box3()
        .setFromObject(
            this.treasureModel
        );


const originalSize =
    new THREE.Vector3();


originalBox.getSize(
    originalSize
);


console.log(
    "[TREASURE] Taille originale du modèle :",
    originalSize.toArray()
);


const targetHeight =
    0.8;


if (
    originalSize.y > 0
) {

    const scaleFactor =
        targetHeight /
        originalSize.y;


    this.treasureModel.scale.setScalar(
        scaleFactor
    );

}


this.treasureModel.updateMatrixWorld(
    true
);


/*
 * Vérification de la taille APRÈS
 * normalisation.
 */

const normalizedBox =
    new THREE.Box3()
        .setFromObject(
            this.treasureModel
        );


const normalizedSize =
    new THREE.Vector3();


normalizedBox.getSize(
    normalizedSize
);


console.log(
    "[TREASURE] Taille finale du modèle :",
    normalizedSize.toArray()
);


    this.treasureModel.traverse(
        object => {

            if (!object.isMesh) {

                return;

            }


            object.castShadow =
                true;

            object.receiveShadow =
                true;


            object.userData.isTreasure =
                true;

        }
    );


    /*
     * Le modèle chargé est uniquement
     * un modèle de référence.
     */

    this.treasureModel.visible =
        false;


    console.log(
        "Modèle de trésor GLB chargé.",
        {
            tailleOriginale:
                originalSize.toArray(),

            hauteurCible:
                targetHeight,

            echelleFinale:
                this.treasureModel.scale.toArray()
        }
    );

}

spawnTreasures() {

    if (
        this.treasuresSpawned ||
        !this.treasureModel
    ) {

        return;

    }


    const chunkManager =
        this.world
            ?.getChunkManager?.();


    if (!chunkManager) {

        return;

    }


    const chunks =
        chunkManager.getLoadedChunks?.();


    if (!chunks || chunks.size === 0) {

        return;

    }


    const chunkList =
        [...chunks.values()]
            .filter(
                chunk =>
                    chunk &&
                    Array.isArray(
                        chunk.terrain
                    )
            );


    if (chunkList.length === 0) {

        return;

    }


    /*
     * On trie les chunks pour que
     * le placement soit déterministe.
     */

    chunkList.sort(
        (a, b) =>
            a.chunkX - b.chunkX ||
            a.chunkZ - b.chunkZ
    );


    const positions = [];

const occupiedTreasurePositions =
    new Set();


/*
 * ==================================================
 * GÉNÉRATION DES CANDIDATS
 * ==================================================
 *
 * On génère beaucoup plus de positions
 * que nécessaire, puis on sélectionne celles
 * qui sont suffisamment éloignées.
 */

const candidates = [];


for (
    let chunkIndex = 0;
    chunkIndex < chunkList.length;
    chunkIndex++
) {

    const chunk =
        chunkList[chunkIndex];


    const size =
        chunk.size;


    /*
     * Plusieurs candidats par chunk.
     *
     * Cela évite que les trésors utilisent
     * systématiquement la même colonne.
     */

    const candidatesPerChunk =
        100;


    for (
        let i = 0;
        i < candidatesPerChunk;
        i++
    ) {

        /*
         * Génération déterministe.
         */

        const seed =
            Math.sin(
                (
                    chunk.chunkX * 127.1 +
                    chunk.chunkZ * 311.7 +
                    chunkIndex * 97.3 +
                    i * 74.7
                )
            ) *
            43758.5453;


        const normalized =
            seed -
            Math.floor(seed);


        const seed2 =
            Math.sin(
                (
                    chunk.chunkX * 269.5 +
                    chunk.chunkZ * 183.3 +
                    chunkIndex * 53.7 +
                    i * 91.7
                )
            ) *
            43758.5453;


        const normalized2 =
            seed2 -
            Math.floor(seed2);


        const localX =
            Math.min(
                size - 1,
                Math.max(
                    0,
                    Math.floor(
                        normalized * size
                    )
                )
            );


        const localZ =
            Math.min(
                size - 1,
                Math.max(
                    0,
                    Math.floor(
                        normalized2 * size
                    )
                )
            );


        const highestY =
            chunk.getHighestSolidY?.(
                localX,
                localZ
            );


        if (
            !Number.isInteger(
                highestY
            ) ||
            highestY < 0
        ) {

            continue;

        }


        const worldX =
            chunk.chunkX *
            size +
            localX +
            0.5;


        const worldZ =
            chunk.chunkZ *
            size +
            localZ +
            0.5;


        const surfaceY =
            highestY + 1;


        const positionKey =
            `${Math.floor(worldX)}:${Math.floor(surfaceY)}:${Math.floor(worldZ)}`;


        if (
            occupiedTreasurePositions.has(
                positionKey
            )
        ) {

            continue;

        }


        occupiedTreasurePositions.add(
            positionKey
        );


        candidates.push({

            x: worldX,

            y: surfaceY,

            z: worldZ

        });

    }

}


/*
 * ==================================================
 * MÉLANGE DÉTERMINISTE DES CANDIDATS
 * ==================================================
 */

candidates.sort(
    (a, b) => {

        const hashA =
            Math.sin(
                a.x * 12.9898 +
                a.z * 78.233
            );

        const hashB =
            Math.sin(
                b.x * 12.9898 +
                b.z * 78.233
            );

        return hashA - hashB;

    }
);


/*
 * ==================================================
 * SÉLECTION DES POSITIONS
 * ==================================================
 *
 * Distance minimale de 8 blocs entre
 * deux trésors.
 */

const minimumTreasureDistance =
    5;


const minimumTreasureDistanceSquared =
    minimumTreasureDistance *
    minimumTreasureDistance;


for (
    const candidate of candidates
) {

    if (
        positions.length >=
        this.treasureCount
    ) {

        break;

    }


    let tooClose =
        false;


    for (
        const existing of positions
    ) {

        const dx =
            candidate.x -
            existing.x;


        const dz =
            candidate.z -
            existing.z;


        const distanceSquared =
            dx * dx +
            dz * dz;


        if (
            distanceSquared <
            minimumTreasureDistanceSquared
        ) {

            tooClose = true;

            break;

        }

    }


    if (tooClose) {

        continue;

    }


    positions.push(
        candidate
    );

}


console.log(
    `[TREASURE] ${positions.length}/${this.treasureCount} positions sélectionnées parmi ${candidates.length} candidates.`
);

    /*
     * Il faut avoir réellement réussi
     * à trouver les positions.
     */

    if (
        positions.length === 0
    ) {

        return;

    }


    for (
        let i = 0;
        i < positions.length;
        i++
    ) {

        this.createTreasure(
            i,
            positions[i]
        );

    }


    this.treasuresSpawned =
        true;


    console.log(
        `💎 ${this.treasures.size} trésors générés.`
    );

}
createTreasure(id, position) {

    if (!this.treasureModel) {

        return null;

    }


    /*
     * Chaque trésor reçoit sa propre
     * copie du modèle.
     */

    const mesh =
    this.treasureModel.clone(
        true
    );


mesh.visible = true;


/*
 * ==================================================
 * NORMALISATION FINALE DE CHAQUE COFFRE
 * ==================================================
 *
 * On ne fait pas confiance uniquement à
 * l'échelle du modèle original.
 *
 * Chaque copie est mesurée puis redimensionnée
 * individuellement pour garantir une hauteur
 * réelle de 0.60 bloc.
 */

mesh.scale.set(
    1,
    1,
    1
);


mesh.updateMatrixWorld(
    true
);


const treasureBoxBeforeScale =
    new THREE.Box3()
        .setFromObject(
            mesh
        );


const treasureSizeBeforeScale =
    new THREE.Vector3();


treasureBoxBeforeScale.getSize(
    treasureSizeBeforeScale
);


const targetTreasureHeight =
    0.60;


let treasureScale =
    1;


if (
    treasureSizeBeforeScale.y > 0
) {

    treasureScale =
        targetTreasureHeight /
        treasureSizeBeforeScale.y;


    mesh.scale.setScalar(
        treasureScale
    );

}


mesh.updateMatrixWorld(
    true
);


/*
 * Vérification de la taille réelle.
 */

const treasureBox =
    new THREE.Box3()
        .setFromObject(
            mesh
        );


const treasureSize =
    new THREE.Vector3();


treasureBox.getSize(
    treasureSize
);


console.log(
    "[TREASURE] COFFRE",
    {
        id,

        taille: {
            hauteur:
                treasureSize.y,

            largeur:
                treasureSize.x,

            profondeur:
                treasureSize.z
        },

        position: {
            x: position.x,

            y: position.y,

            z: position.z
        }
    }
);


    const box =
        new THREE.Box3()
            .setFromObject(
                mesh
            );


    /*
     * Faire reposer le dessous du coffre
     * exactement sur le sol.
     */

    const bottomOffset =
        box.min.y;


    mesh.position.set(
        position.x,
        position.y - bottomOffset,
        position.z
    );


    mesh.userData.isTreasure =
        true;


    mesh.userData.treasureId =
        id;


    /*
     * Création de l'objet collectible
     * du système existant.
     */

    const treasure =
        new Collectible(
            this,
            {

                id:
                    `treasure_${id}`,

                type:
                    "treasure",

                position:
    mesh.position.clone(),

scale:
    new THREE.Vector3(
        treasureScale,
        treasureScale,
        treasureScale
    ),

reward:
                    {
                        type: "treasure",
                        id:
                            `treasure_${id}`
                    },

                value: 1,

                interactionDistance: 3

            }
        );


    treasure.setMesh(
        mesh
    );


    /*
     * Ajouter le trésor à la scène.
     */

    this.scene.add(
        mesh
    );


    /*
     * Le EntityManager s'occupe
     * maintenant de son update().
     */

    this.entityManager.register(
        treasure
    );


    this.treasures.set(
        treasure.id,
        treasure
    );


    return treasure;

}

collectTreasure(treasure) {
    if (!treasure) {
        return false;
    }

    if (treasure.collected) {
        return false;
    }

    const player =
        this.localPlayer;

    if (!player) {
        return false;
    }

    const playerPosition =
        player.position;

    if (!playerPosition) {
        return false;
    }

    if (
        !treasure.canPlayerInteract?.(
            playerPosition
        )
    ) {
        return false;
    }

    const collected =
        treasure.collect(
            player
        );

    if (!collected) {
        return false;
    }

    this.treasuresCollected =
        Math.min(
            this.treasuresCollected + 1,
            this.treasureCount
        );

    /*
     * Score du trésor.
     */
    this.scoreController?.addScore?.(
        100
    );

    /*
     * XP d'exploration / collecte.
     */
    this.progressionController?.addXP?.(
        25
    );

    /*
     * Synchronisation HUD.
     */
    this.updateHUD();
    this.openTreasureQuiz();

    /*
     * Événement gameplay.
     */
    this.eventBus?.emit?.(
        "treasure:collected",
        {
            treasureId:
                treasure.id,

            collected:
                this.treasuresCollected,

            total:
                this.treasureCount
        }
    );

    /*
     * Condition de fin :
     * tous les trésors sont collectés.
     */
    if (
        this.treasuresCollected >=
        this.treasureCount
    ) {
        this.victoryScreen?.show({
            score: this.scoreController?.getScore?.() ?? 0,
            treasures: this.treasuresCollected
        });
        this.eventBus?.emit?.(
            "treasure:collection-complete",
            {
                collected:
                    this.treasuresCollected,

                total:
                    this.treasureCount
            }
        );
    }

    return true;
}
updateHUD() {
    if (!this.uiManager) {
        return;
    }

    const score =
        this.scoreController?.getScore?.() ??
        0;

    const bestScore =
        this.scoreController?.getBestScore?.() ??
        0;

    this.uiManager.updateScore(
        score,
        bestScore
    );

    const currentXP =
        this.progressionController?.getCurrentXP?.() ??
        this.xpController?.getCurrentXP?.() ??
        0;

    const requiredXP =
        this.progressionController?.getRequiredXP?.() ??
        this.levelController?.getRequiredXP?.() ??
        100;

    this.uiManager.updateXP(
        currentXP,
        requiredXP
    );

    const level =
        this.progressionController?.getLevel?.() ??
        this.levelController?.getLevel?.() ??
        1;

    this.uiManager.updateLevel(
        level
    );

    const playerName =
        this.localPlayer?.name ??
        "Joueur";

    this.uiManager.updatePlayerName(
        playerName
    );
}
    start() {

        if (!this.initialized) {

            throw new Error(
                "Le jeu doit être initialisé avant d'être lancé."
            );

        }

        console.log(
            "Démarrage de la Game Loop..."
        );

        this.loop.start();

    }


    stop() {

        if (this.loop) {

            this.loop.stop();

        }

    }


    update(deltaTime) {

        /*
         * INPUT
         */

        if (this.inputManager) {

            this.inputManager.update(
                deltaTime
            );

        }


        /*
         * JOUEUR
         */

        if (this.playerController) {
    this.playerController.update(
        deltaTime
    );
    if (
    this.collisionController
) {

    this.collisionController.update(
        deltaTime
    );

}
if (
    this.interactionController
) {

    this.interactionController.update(
        deltaTime
    );

}
}


/*
 * MONDE
 */

if (this.world) {
    this.world.update(
        deltaTime
    );
}
/*
 * TRÉSORS
 */

if (
    !this.treasuresSpawned
) {

    this.spawnTreasures();

}


/*
 * ENTITÉS
 */

        if (this.entityManager) {

            this.entityManager.update(
                deltaTime
            );

        }


        /*
         * CAMÉRA
         */

        if (this.cameraController) {

            this.cameraController.update(
                deltaTime
            );

        }

        if (this.cameraOrbit) {

            this.cameraOrbit.update(
                deltaTime
            );

        }

        if (this.cameraFollow) {

            this.cameraFollow.update(
                deltaTime
            );

        }

        /*
 * HUD
 */

if (this.uiManager) {
    this.uiManager.update(
        deltaTime
    );
}

        /*
         * SCÈNE
         */

        if (this.scene) {

            this.scene.update(
                deltaTime
            );

        }

    }


    render(interpolation) {

        if (this.renderer) {

            this.renderer.render(
                interpolation
            );

        }

    }

}
