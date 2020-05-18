'use strict';

export const scaleToGameW = (obj, percentage) => {
    obj.displayWidth = window.game.config.width * (percentage / 100);
    obj.scaleY = obj.scaleX;
};

export const centerH = obj => {
    obj.x = (window.game.config.width - obj.displayWidth) / 2;
};

export const centerV = obj => {
    obj.y = (window.game.config.height - obj.displayHeight) / 2;
};

export const center2 = obj => {
    obj.x = (window.game.config.width - obj.displayWidth) / 2;
    obj.y = (window.game.config.height - obj.displayHeight) / 2;
};

export const center = obj => {
    obj.x = window.game.config.width / 2;
    obj.y = window.game.config.height / 2;
};

export default {
    scaleToGameW,
    centerH,
    centerV,
    center,
};
