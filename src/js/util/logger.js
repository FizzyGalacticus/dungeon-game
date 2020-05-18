'use strict';

import pino from 'pino';

import { env } from '../config';

const conf = {
    customLevels: {
        log: 35,
    },
};

export default new Proxy(pino(conf), {
    get(target, prop) {
        if (prop in target) {
            if (env !== 'dev') {
                return () => {
                    /* NOOP */
                };
            }
        }

        return target[prop];
    },
});
