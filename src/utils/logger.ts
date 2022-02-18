export const logger = {
    debug: (...args) => {
        // eslint-disable-next-line no-console
        console.debug(...args);
    },
    info: (...args) => {
        // eslint-disable-next-line no-console
        console.log(...args);
    },
    warning: (...args) => {
        // eslint-disable-next-line no-console
        console.warn(...args);
    },
    error: (...args) => {
        // eslint-disable-next-line no-console
        console.error(...args);
    },
};
