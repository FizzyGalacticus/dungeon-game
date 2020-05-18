'use strict';

import Phaser from 'phaser';

import { tilesets } from '../util/asset';

const layerData = [
    [0, 1, 2, 3, 4, 5],
    [10, 11, 12, 13, 14, 15],
    [20, 21, 22, 23, 24, 25],
    [30, 31, 32, 33, 34, 35],
    [40, 41, 42, 43, 44, 45],
];

class MainScene extends Phaser.Scene {
    constructor() {
        super('main');

        this.entities = [];
    }

    preload() {
        this.entities.forEach(entity => entity.preload());

        this.load.image('tiles', tilesets.main);
    }

    create() {
        this.entities.forEach(entity => entity.create());

        this.map = this.make.tilemap({ data: layerData, tileWidth: 16, tileHeight: 16 });
        this.tiles = this.map.addTilesetImage('tiles');
        this.layer = this.map.createStaticLayer(0, this.tiles, 0, 0);
    }

    update(time, delta) {
        this.entities.forEach(entity => entity.update(time, delta));
    }
}

export default new MainScene();
