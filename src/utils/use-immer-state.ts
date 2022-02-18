import {useCallback, useState} from 'react';
import produce from 'immer';
import {logger} from '@/utils/logger';
import {debugUtils} from '@/utils/debug-utils';
import {detailedDiff} from 'deep-object-diff';

export type StateProducer<TState> = (draftCb: (draft: TState) => void) => void;

export function useImmerState<TState>(initialState: TState, debugName?: string): [TState, StateProducer<TState>] {
    const [state, setState] = useState(initialState);

    const produceState = useCallback((draftCb: (draft: TState) => void) => {
        setState((old) => {
            const newState = produce(old, draftCb);

            if (debugUtils.isDebugLogsEnabled()) {
                logDiff(old, newState, debugName);
            }

            return newState;
        });
    }, []);

    return [state, produceState];
}

export const logDraft = (...datas) => logger.info(...datas.map((data) => JSON.parse(JSON.stringify(data ?? 'хз'))));

function logDiff(a, b, debugName) {
    const diff = detailedDiff(a, b);

    // @ts-ignore
    const addedCount = Object.keys(diff.added).length;
    // @ts-ignore
    const updCount = Object.keys(diff.updated).length;
    // @ts-ignore
    const deletedCount = Object.keys(diff.deleted).length;

    if ([addedCount, updCount, deletedCount].some(Boolean)) {
        // eslint-disable-next-line no-console
        console.groupCollapsed(`NEW_IMMER_STATE${debugName ? ('_' + debugName) : ''}`);
        // eslint-disable-next-line no-console
        console.group('changes');

        if (addedCount > 0) {
            // @ts-ignore
            logger.info('added:', diff.added);
        }

        if (updCount > 0) {
            // @ts-ignore
            logger.info('updated:', diff.updated);
        }

        if (deletedCount > 0) {
            // @ts-ignore
            logger.info('deleted:', diff.deleted);
        }

        // eslint-disable-next-line no-console
        console.groupEnd();

        // eslint-disable-next-line no-console
        console.groupCollapsed('new');
        logger.info(b);
        // eslint-disable-next-line no-console
        console.groupEnd();

        // eslint-disable-next-line no-console
        console.groupCollapsed('old');
        logger.info(a);
        // eslint-disable-next-line no-console
        console.groupEnd();
        // eslint-disable-next-line no-console
        console.groupEnd();
    }
}
