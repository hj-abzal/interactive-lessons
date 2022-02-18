/* eslint-disable */
import yargs from 'yargs/yargs';

const argv = yargs(process.argv.slice(2)).options({
    log: {choices: ['debug', 'info'], default: 'info'},
}).parseSync();

export const logger = {
    debug: (...args) => {
        if (argv.log === 'debug') {
            console.debug(...args);
        }
    },
    info: (...args) => {
        console.info(...args);
    },
    warning: (...args) => {
        console.warn(...args);
    },
    error: (...args) => {
        console.error(...args);
    },
};
