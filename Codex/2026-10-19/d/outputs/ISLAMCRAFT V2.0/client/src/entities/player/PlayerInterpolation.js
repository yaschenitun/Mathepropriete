import * as THREE from "three";

export class PlayerInterpolation {

    constructor(game, remotePlayer) {

        this.game = game;

        this.remotePlayer = remotePlayer;

        this.positionBuffer = [];

        this.rotationBuffer = [];

        this.interpolationDelay = 100;

        this.maxBufferSize = 20;

    }

    async initialize() {

        console.log("PlayerInterpolation initialisé.");

    }

    pushSnapshot(snapshot) {

        if (!snapshot) {

            return;

        }

        this.positionBuffer.push({

            time: snapshot.time,

            position: new THREE.Vector3(

                snapshot.position.x,

                snapshot.position.y,

                snapshot.position.z

            )

        });

        this.rotationBuffer.push({

            time: snapshot.time,

            rotation: new THREE.Euler(

                snapshot.rotation.x,

                snapshot.rotation.y,

                snapshot.rotation.z

            )

        });

        while (this.positionBuffer.length > this.maxBufferSize) {

            this.positionBuffer.shift();

        }

        while (this.rotationBuffer.length > this.maxBufferSize) {

            this.rotationBuffer.shift();

        }

    }

    update(serverTime) {

        if (this.positionBuffer.length < 2) {

            return;

        }

        const renderTime = serverTime - this.interpolationDelay;

        let previous = null;
        let next = null;

        for (let i = 0; i < this.positionBuffer.length - 1; i++) {

            const a = this.positionBuffer[i];
            const b = this.positionBuffer[i + 1];

            if (renderTime >= a.time && renderTime <= b.time) {

                previous = a;
                next = b;
                break;

            }

        }

        if (!previous || !next) {

            return;

        }

        const alpha =

            (renderTime - previous.time) /

            (next.time - previous.time);

        this.remotePlayer.position.lerpVectors(

            previous.position,

            next.position,

            alpha

        );

        this.remotePlayer.mesh.position.copy(

            this.remotePlayer.position

        );

    }

    clear() {

        this.positionBuffer.length = 0;

        this.rotationBuffer.length = 0;

    }

}