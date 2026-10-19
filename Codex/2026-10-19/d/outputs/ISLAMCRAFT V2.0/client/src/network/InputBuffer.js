export class InputBuffer {

    constructor() {

        this.inputs = [];

        this.nextSequence = 1;

        this.maxSize = 256;

    }

    add(input) {

        const bufferedInput = {

            ...input,

            sequence: this.nextSequence++

        };

        this.inputs.push(bufferedInput);

        if (this.inputs.length > this.maxSize) {

            this.inputs.shift();

        }

        return bufferedInput;

    }

    removeUntil(sequence) {

        this.inputs = this.inputs.filter(

            input => input.sequence > sequence

        );

    }

    getPendingInputs() {

        return [...this.inputs];

    }

    getLastSequence() {

        return this.nextSequence - 1;

    }

    clear() {

        this.inputs.length = 0;

        this.nextSequence = 1;

    }

    size() {

        return this.inputs.length;

    }

    isEmpty() {

        return this.inputs.length === 0;

    }

}