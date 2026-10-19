export class ResponsiveLayout {

    constructor(game) {

        this.game = game;

        this.width = 0;

        this.height = 0;

        this.orientation = "landscape";

    }

    async initialize() {

        this.update();

        window.addEventListener(

            "resize",

            () => this.update()

        );

        console.log("ResponsiveLayout initialisé.");

    }

    update() {

        this.width = window.innerWidth;

        this.height = window.innerHeight;

        this.orientation =

            this.width >= this.height

                ? "landscape"

                : "portrait";

        this.game.eventBus?.emit(

            "ui:layout-changed",

            {

                width: this.width,

                height: this.height,

                orientation: this.orientation

            }

        );

    }

    getWidth() {

        return this.width;

    }

    getHeight() {

        return this.height;

    }

    getOrientation() {

        return this.orientation;

    }

    isPortrait() {

        return this.orientation === "portrait";

    }

    isLandscape() {

        return this.orientation === "landscape";

    }

}