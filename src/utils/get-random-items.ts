import {logger} from '@/utils/logger';

type filterFn<T> = (acc: T[], item: T) => boolean;

const MAX_ITERATIONS = 1000;

export function getRandomItems<T>(arr: T[], count: number, filter?: filterFn<T>): T[] {
    const usedIndexes: number[] = [];
    const result: T[] = [];
    let iteration = 0;

    while (result.length < count) {
        if (iteration >= MAX_ITERATIONS) {
            break;
        }

        iteration++;
        const randomInd = Math.floor(Math.random() * arr.length);

        if (usedIndexes.includes(randomInd)) {
            continue;
        }

        usedIndexes.push(randomInd);

        const item = arr[randomInd];

        if (!filter || filter(result, item)) {
            result.push(item);
        }
    }

    logger.debug('RANDOM ITERATIONS', iteration);

    return result;
}
