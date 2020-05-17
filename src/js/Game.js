'use strict';

import Phaser from 'phaser';

class Game extends Phaser.Game {
    constructor(config) {
        super(config);

        this.getCurrentScene = this.getCurrentScene.bind(this);
    }

    getCurrentScene() {
        return Object.keys(this.scene.keys).find(scene => this.scene.isActive(scene));
    }
}

export default Game;
