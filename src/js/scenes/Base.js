'use strict';

import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {
    constructor(name) {
        super(name);

        this.entities = [];

        this.preload = this.preload.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
    }

    preload() {
        this.entities.forEach(entity => entity.preload());
    }

    create() {
        this.entities.forEach(entity => entity.create());
    }

    update(time, delta) {
        this.entities.forEach(entity => entity.update(time, delta));
    }
}

export default BaseScene;
