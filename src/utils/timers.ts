import {logger} from '@/utils/logger';

export enum TimerIntervals {
    FPS20 = 50,
    FPS30 = 33,
    // DANGER! Только если уверен, что не сгенерит тормозов
    FPS60 = 16,
}

export type TimerCb = (time: number) => void;

export type LittleTimer = {
    subscribe: (cb: TimerCb) => void,
    tick: () => void,
    reset: () => void,
    start: (interval?: number) => void,
    kill: () => void,
    remove: (cb: TimerCb) => void,
    stop: () => void,
    getTime: () => number,
    isRunning: () => boolean,
};

/**
 * @name createTimer
 *
 * Утилита для удобной работы с таймером, просто создает счетчик с управлением,
 * можно юзать для синхронной анимации canvas сцен и тд.
 */
export const createTimer = (name: string, debug = false): LittleTimer => {
    let _isRunning = false;
    let time = 0;
    let subscribers: TimerCb[] = [];
    let intervalId: number | null = null;

    function subscribe(cb: TimerCb) {
        subscribers.push(cb);
    }

    function remove(cb: TimerCb) {
        subscribers = subscribers.filter((subscriber) => subscriber !== cb);
    }

    function tick() {
        if (debug) {
            logger.debug(`TIMER ${name} ticks ${time} times`);
        }

        time++;
        subscribers.forEach((subscriber) => subscriber(time));
    }

    function start(interval: number = TimerIntervals.FPS20) {
        if (intervalId) {
            throw new Error(`WTF timer ${name} already started`);
        }

        // @ts-ignore
        intervalId = setInterval(tick, interval);
        _isRunning = true;
    }

    function stop() {
        if (intervalId) {
            // @ts-ignore
            clearInterval(intervalId);
            intervalId = null;
        }
        _isRunning = false;
    }

    function reset(shouldStop = true) {
        time = 0;
        if (shouldStop) {
            stop();
        }
    }

    function kill() {
        stop();
        subscribers = [];
    }

    function getTime() {
        return time;
    }

    function isRunning() {
        return _isRunning;
    }

    return {
        start,
        stop,
        reset,
        remove,
        subscribe,
        isRunning,
        kill,
        tick,
        getTime,
    };
};
