'use strict';

import Phaser from 'phaser';

import Game from './Game';

import config from './config';

import scenes from './scenes';

const gameConfig = {
    type: Phaser.AUTO,
    ...config.game,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
        },
    },
    // scale: {
    //     mode: Phaser.Scale.FIT,
    // },
    scene: scenes,
};

document.title = gameConfig.title;

window.game = new Game(gameConfig);
