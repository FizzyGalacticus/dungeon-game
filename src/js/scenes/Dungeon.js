'use strict';

import dungeoneer from 'dungeoneer';

import BaseScene from './Base';

import AlignGrid from '../util/alignGrid';

import { tilesets } from '../util/asset';

import logger from '../util/logger';

const getRange = (start, end) => {
    const ret = [];

    for (let i = start; i <= end; i++) {
        ret.push(i);
    }

    return ret;
};

const getRangeSets = (start, end, jump, num) => {
    const ret = [];

    for (let i = 0; i < num; i++) {
        ret.push(getRange(start + i * jump, end + i * jump));
    }

    return ret;
};

const getFlatRangeSets = (start, end, jump, num) => {
    const rangeSets = getRangeSets(start, end, jump, num);

    return rangeSets.reduce((acc, arr) => [...acc, ...arr], []);
};

// const corners = {
//     tl: 0,
//     tr: 5,
//     bl: 40,
//     br: 45,
// };

const topWalls = getRange(1, 4);
const botWalls = getRange(41, 44);
const leftWalls = getFlatRangeSets(10, 10, 10, 3);
const rightWalls = getFlatRangeSets(15, 15, 10, 3);

const path = 69;

const flooring = [...getFlatRangeSets(6, 9, 10, 3), ...getFlatRangeSets(60, 63, 10, 2)];

const getRandomItem = (arr = []) => arr[Math.floor(Math.random() * arr.length)];

let instances = 0;

class Dungeon extends BaseScene {
    constructor({ name = `dungeon`, seed } = {}) {
        super(`${name}-${++instances}`);

        this.grid = new AlignGrid({ scene: this, cellWidth: 16, cellHeight: 16 });

        this.seed = seed;
    }

    generateLayerData() {
        let ret = [];

        if (this.dungeon) {
            ret = this.dungeon.tiles.map((tileArr, x) =>
                tileArr.map((tile, y) => {
                    if (tile.type === 'floor') {
                        const room = this.dungeon.rooms.find(room => {
                            const withinX = x >= room.x && x < room.x + room.width;
                            const withinY = y >= room.y && y < room.y + room.width;

                            return withinX && withinY;
                        });

                        if (room) {
                            return getRandomItem(flooring);
                        }

                        return path;
                    } else if (tile.type === 'wall') {
                        const { adjacentRooms, adjacentPaths } = Object.keys(tile.neighbours).reduce(
                            (acc, direction) => {
                                const t = tile.neighbours[direction];

                                this.dungeon.rooms.forEach(room => {
                                    const withinX = t.x >= room.x && t.x < room.x + room.width;
                                    const withinY = t.y >= room.y && t.y < room.y + room.width;

                                    if (withinX && withinY) {
                                        acc.adjacentRooms.push(direction);
                                    }
                                });

                                if (t.type === 'floor') {
                                    acc.adjacentPaths.push(direction);
                                }

                                return acc;
                            },
                            { adjacentRooms: [], adjacentPaths: [] }
                        );

                        if (!(adjacentRooms.length, adjacentPaths.length)) {
                            tile.empty = true;
                            return -1;
                        }

                        const {
                            neighbours: { n, e, s, w /* , ne, nw, se, sw */ },
                        } = tile;

                        // For some reason, dungeon is rotated by 90 degrees counter-clockwise
                        if ([n, s].every(t => t && ['wall', 'door'].includes(t.type) && !t.empty)) {
                            if (adjacentRooms.includes('w')) {
                                return getRandomItem(topWalls);
                            } else if (adjacentRooms.includes('e')) {
                                return getRandomItem(botWalls);
                            } else if (adjacentPaths.includes('w')) {
                                return getRandomItem(botWalls);
                            } else if (adjacentPaths.includes('e')) {
                                return getRandomItem(topWalls);
                            }
                        } else if ([e, w].every(t => t && ['wall', 'door'].includes(t.type) && !t.empty)) {
                            if (adjacentRooms.includes('n')) {
                                return getRandomItem(rightWalls);
                            } else if (adjacentRooms.includes('s')) {
                                return getRandomItem(leftWalls);
                            } else if (adjacentPaths.includes('n')) {
                                return getRandomItem(leftWalls);
                            } else if (adjacentPaths.includes('s')) {
                                return getRandomItem(rightWalls);
                            }
                        }

                        return 54;
                    } else if (tile.type === 'door') {
                        return 67;
                    }

                    return -1;
                })
            );
        }

        return ret;
    }

    preload() {
        super.preload();

        this.load.image('tiles', tilesets.main);

        this.dungeon = dungeoneer.build({
            width: Math.floor(this.game.config.width / 16),
            height: Math.floor(this.game.config.height / 16),
            seed: this.seed,
        });
    }

    create() {
        super.create();

        const layerData = this.generateLayerData();

        this.map = this.make.tilemap({ data: layerData, tileWidth: 16, tileHeight: 16 });
        this.tiles = this.map.addTilesetImage('tiles');
        this.layer = this.map.createStaticLayer(0, this.tiles, 0, 0);

        this.invertX = false;
        this.invertY = false;
        this.hidden = true;
        this.color = 'yellow';
        this.lineWidth = 1;

        this.refreshGridNumbers();
    }

    update(time, delta) {
        super.update(time, delta);

        const cursors = this.input.keyboard.createCursorKeys();

        if (cursors.left.isDown && !this.hidden) {
            this.invertX = !this.invertX;
            this.refreshGridNumbers();
        } else if (cursors.right.isDown && !this.hidden) {
            this.invertY = !this.invertY;
            this.refreshGridNumbers();
        } else if (cursors.up.isDown) {
            this.hidden = !this.hidden;

            if (this.hidden) {
                this.grid.hide();
            } else {
                this.refreshGridNumbers();
            }
        }
    }

    refreshGridNumbers() {
        if (!this.hidden) {
            this.grid.hideNumbers();
            this.grid.showNumbers({
                lineWidth: this.lineWidth,
                invertX: this.invertX,
                invertY: this.invertY,
                color: this.color,
            });

            logger.info({ invertX: this.invertX, invertY: this.invertY });
        }
    }
}

export default new Dungeon({});
