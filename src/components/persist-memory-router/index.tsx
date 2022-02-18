import React, {useEffect, useMemo, useState} from 'react';
import {ReactNode} from 'react';
import {MemoryRouter, MemoryRouterProps, useHistory, useLocation} from 'react-router-dom';
import {logger} from '@/utils/logger';
import {useSberclass} from '@/context-providers/sberclass';

const HISTORY_KEY = 'HISTORY';
const HISTORY_IDS_KEY = 'HISTORY_IDS';
const MAX_HISTORY_LENGTH = 5;

type HistoryEntry = {
    pathname: string,
    search: string,
};

export type Props = MemoryRouterProps & {
    children?: ReactNode,
};

const PersistHistoryListener = ({
    shouldClearHistory,
    sessionId,
    children,
}: {
    shouldClearHistory?: boolean,
    sessionId: string,
    children?: ReactNode,
}) => {
    const history = useHistory();
    const location = useLocation();
    const [isIntied, setInited] = useState(false);
    const [isHistoryLoaded, setHistoryLoaded] = useState(false);

    const historyId = useMemo(() => {
        return sessionId !== 'unknown-1' ?
            `${sessionId}_${HISTORY_KEY}`
            : null;
    }, [sessionId]);

    useEffect(() => {
        if (historyId && !isIntied) {
            setInited(true);
        }
    }, [historyId]);

    useEffect(() => {
        if (!isIntied) {
            return;
        }

        if (shouldClearHistory) {
            logger.debug('FORCE_CLEAR_HISTORY');
            const historyIds = JSON.parse(localStorage.getItem(HISTORY_IDS_KEY) || '[]');

            historyIds.forEach((id) => {
                localStorage.setItem(id, '[]');
            });
        } else {
            const oldIds = JSON.parse(localStorage.getItem(HISTORY_IDS_KEY) || '[] ');

            if (!oldIds.includes(historyId)) {
                localStorage.setItem(HISTORY_IDS_KEY, JSON.stringify(oldIds.concat(historyId)));
            }
        }
    }, [shouldClearHistory, historyId, isIntied]);

    useEffect(() => {
        if (!isIntied) {
            return;
        }

        if (shouldClearHistory) {
            setHistoryLoaded(true);

            return;
        }

        if (!isHistoryLoaded) {
            const oldHistory = JSON.parse(localStorage.getItem(historyId!) || '[]');

            if (oldHistory.length > 0) {
                logger.debug('HISTORY_LOADED', oldHistory);

                oldHistory.forEach((entry: HistoryEntry) => {
                    history.push(entry.pathname + entry.search);
                });
            }

            setHistoryLoaded(true);
        }
    }, [isHistoryLoaded, shouldClearHistory, isIntied, historyId]);

    useEffect(() => {
        // @ts-ignore
        if (!location || !history?.entries || shouldClearHistory || !isIntied) {
            return;
        }

        logger.debug('HISTORY_EVENT', {
            current: location,
            history: history,
        });

        // @ts-ignore
        if (typeof localStorage !== 'undefined' && history.entries && isHistoryLoaded) {
            // @ts-ignore
            const entriesArr = history.entries;

            const truncatedHistory = entriesArr.slice(
                Math.max(entriesArr.length - MAX_HISTORY_LENGTH, 0),
                entriesArr.length
            );

            localStorage.setItem(historyId!, JSON.stringify(truncatedHistory));
        }
    }, [location, history, isHistoryLoaded, isIntied]);

    if (!isHistoryLoaded) {
        return null;
    }

    return (
        <>
            {children}
        </>
    );
};

export const PersistMemoryRouter = (
    {
        children,
        ...props
    }: Props
) => {
    const {sessionId, shouldSaveSession} = useSberclass();

    return (
        <MemoryRouter {...props}>
            <PersistHistoryListener shouldClearHistory={!shouldSaveSession} sessionId={sessionId}>
                {children}
            </PersistHistoryListener>
        </MemoryRouter>
    );
};
