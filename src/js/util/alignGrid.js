'use strict';

import Color from 'color';

const hexStringToNum = str => parseInt(str.split('#').pop(), 16);

const roundUp = num => {
    if (num % 1 !== 0) {
        return Math.floor(num) + 1;
    }

    return num;
};

class AlignGrid {
    constructor(config = {}) {
        if (!config.scene) {
            throw new Error('Align Grid config requires scene');
        }

        this.config = config;

        this.scene = config.scene;
    }

    get width() {
        return this.config.width || this.scene.game.config.width;
    }

    get height() {
        return this.config.height || this.scene.game.config.height;
    }

    get rows() {
        return roundUp(this.width / this.config.cellWidth);
    }

    get cols() {
        return roundUp(this.height / this.config.cellHeight);
    }

    get graphics() {
        if (!this._graphics) {
            this._graphics = this.scene.add.graphics();
        }

        return this._graphics;
    }

    get numTexts() {
        if (!this._numTexts) {
            this._numTexts = [];
        }

        return this._numTexts;
    }

    hideGrid() {
        if (this._graphics) {
            this._graphics.destroy();
            this._graphics = null;
        }
    }

    showGrid({ lineWidth = 1, color = '#ff0000' } = {}) {
        const c = hexStringToNum(Color(color).hex());

        this.graphics.lineStyle(lineWidth, c);

        for (let i = 0; i < this.width; i += this.config.cellWidth) {
            this.graphics.moveTo(i, 0);
            this.graphics.lineTo(i, this.height);
        }

        for (let i = 0; i < this.height; i += this.config.cellHeight) {
            this.graphics.moveTo(0, i);
            this.graphics.lineTo(this.width, i);
        }

        this.graphics.strokePath();
    }

    hideNumbers() {
        if (this._numTexts) {
            this._numTexts.forEach(n => n.destroy());
            this._numTexts = null;
        }
    }

    showNumbers({ fontSize = 10, invertX = false, invertY, lineWidth, color = '#ff0000', withGrid = true } = {}) {
        if (withGrid) {
            this.showGrid({ lineWidth, color });
        }

        const c = Color(color).hex();

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const x = this.config.cellWidth * (0.5 + i);
                const y = this.config.cellHeight * (0.5 + j);

                let num = i + j;

                if (invertX && invertY) {
                    num = this.cols + this.rows - 2 - (i + j);
                } else if (invertX) {
                    num = this.cols - 1 - i + j;
                } else if (invertY) {
                    num = this.cols - 1 - j + i;
                }

                const numText = this.scene.add.text(x, y, num, { color: c, fontSize });

                numText.setOrigin(0.5, 0.5);

                this.numTexts.push(numText);
            }
        }
    }

    show({ fontSize, invertX, invertY, lineWidth, color } = {}) {
        this.showNumbers({ fontSize, invertX, invertY, lineWidth, color, withGrid: true });
    }

    hide() {
        this.hideGrid();
        this.hideNumbers();
    }
}

export default AlignGrid;
