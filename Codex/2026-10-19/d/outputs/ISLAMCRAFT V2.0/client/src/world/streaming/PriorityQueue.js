export class PriorityQueue {

    constructor() {

        this.items = [];

    }

    enqueue(item, priority = 0) {

        this.items.push({

            item,

            priority

        });

        this.items.sort(

            (a, b) => b.priority - a.priority

        );

    }

    dequeue() {

        if (this.items.length === 0) {

            return null;

        }

        return this.items.shift().item;

    }

    peek() {

        if (this.items.length === 0) {

            return null;

        }

        return this.items[0].item;

    }

    remove(item) {

        const index = this.items.findIndex(

            entry => entry.item === item

        );

        if (index === -1) {

            return false;

        }

        this.items.splice(index, 1);

        return true;

    }

    clear() {

        this.items.length = 0;

    }

    size() {

        return this.items.length;

    }

    isEmpty() {

        return this.items.length === 0;

    }

}