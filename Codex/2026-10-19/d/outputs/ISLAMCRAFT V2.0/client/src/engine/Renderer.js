import * as THREE from "three";

export class Renderer {

    constructor(game) {

        this.game = game;

        this.renderer = null;

        this.clock = new THREE.Clock();

    }

    async initialize() {

        this.renderer = new THREE.WebGLRenderer({

            antialias: this.game.config.antialias,

            alpha: this.game.config.alpha

        });

        this.renderer.setPixelRatio(

            this.game.config.pixelRatio

        );

        this.renderer.setSize(

            window.innerWidth,

            window.innerHeight

        );

        this.renderer.setClearColor(

            this.game.config.backgroundColor

        );

        this.renderer.shadowMap.enabled =

            this.game.config.shadows;

        this.renderer.shadowMap.type =

            THREE.PCFSoftShadowMap;

        document.body.style.margin = "0";

        document.body.style.overflow = "hidden";

        document.body.appendChild(

            this.renderer.domElement

        );

        window.addEventListener(

            "resize",

            this.onResize.bind(this)

        );

        console.log("Renderer initialisé.");

    }

    render() {

        if (

            !this.game.scene ||

            !this.game.scene.scene ||

            !this.game.scene.camera

        ) {

            return;

        }

        this.renderer.render(

            this.game.scene.scene,

            this.game.scene.camera

        );

    }

    onResize() {

        if (

            !this.game.scene ||

            !this.game.scene.camera

        ) {

            return;

        }

        this.game.scene.camera.aspect =

            window.innerWidth /

            window.innerHeight;

        this.game.scene.camera.updateProjectionMatrix();

        this.renderer.setSize(

            window.innerWidth,

            window.innerHeight

        );

    }

    getRenderer() {

        return this.renderer;

    }

}