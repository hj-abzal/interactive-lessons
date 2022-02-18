import {useCallback, useEffect, useState} from 'react';
import {logger} from '@/utils/logger';
import {createContextProvider} from '@/utils/create-safe-context';
import queryString from 'query-string';
import {request} from '@/utils/http';

const SESSION_ID_KEY = 'SESSION_ID';

const buildSessionIdKey = (lessonName: string) => {
    return `${lessonName}-${SESSION_ID_KEY}`;
};

const buildSessionId = (lessonName: string, sessionId: string) => {
    return `kek-${lessonName}-${sessionId}`;
};

const joinUrl = (...parts) => {
    let result = '';

    parts.forEach((part) => {
        const separator =
            (result.length > 0) && (result[result.length - 1] !== '/') && (part[0] !== '/')
                ? '/' : '';

        const partToJoin = (result[result.length - 1] === '/') && (part[0] === '/')
            ? part.slice(1)
            : part;

        result += separator + partToJoin;
    });

    return result;
};

export const mockSberMeta = {
    type: 'context',
    action: 'context_game',
    // eslint-disable-next-line camelcase
    action_params: {
        schoolId: '00000000-0000-0000-0001-000000000001',
        taskId: '12323223232',
        apiUrl: 'https://kek-sber.ru/api',
        studentId: '22222222',
    },
};

export type SberMeta = typeof mockSberMeta;

export type SberclassContextState = {
    sessionId: string,
    metadata?: SberMeta['action_params'],
    resetSessionId: () => void,
    shouldSaveSession: boolean,
    setShouldSaveSession: (val: boolean) => void,
    setLessonName: (name: string) => void,
    sendTaskResultRequest: (status: 'ACCEPTED' | 'FAILED') => void,
};

export const [
    SberclassContext,
    SberclassProvider,
    useSberclass
] = createContextProvider<SberclassContextState>(
    'Sberclass',
    () => {
        const [lessonName, setLessonName] = useState('eco-mixed-forest');
        const [sessionId, setSessionId] = useState<string>('unknown');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [metadata, setMetadata] = useState<SberMeta['action_params'] | undefined>();
        const [shouldSaveSession, setShouldSaveSession] = useState(true);

        const resetSessionId = useCallback(() => {
            const newSessionId = buildSessionId(lessonName, Date.now().toString());

            logger.debug('RESET_SESSION_ID', newSessionId);

            setSessionId(newSessionId);
        }, [lessonName]);

        const sendTaskResultRequest = useCallback((status: 'ACCEPTED' | 'FAILED') => {
            const taskId = metadata?.taskId;

            if (!metadata?.apiUrl) {
                logger.debug('SKIP sendTaskResultRequest', {metadata, taskId, status});
                return Promise.resolve();
            }

            const reqParams = queryString.stringify({
                taskId,
                taskStatus: status,
            });

            const endpoint = '/services/rest/v1/external-modules/student-tasks/change-status';

            const url = `${joinUrl(metadata?.apiUrl, endpoint)}?${reqParams}`;

            logger.debug('SEND sendTaskResultRequest', url);

            return request(url, {
                method: 'PUT',
                headers: {schoolId: metadata.schoolId, userRole: 'STUDENT'},
            })
                .then((res) => {
                    logger.debug('RESULT sendTaskResultRequest', res);
                }).catch((e) => {
                    logger.error('ERROR sendTaskResultRequest', e);
                });
        }, [metadata]);

        useEffect(function getSessionByLessonNameEff() {
            if (typeof localStorage !== 'undefined') {
                const _sessionId = localStorage.getItem(buildSessionIdKey(lessonName))
                    || buildSessionId(lessonName, '1');

                if (!_sessionId.includes('kek-')) {
                    resetSessionId();
                    return;
                }

                setSessionId(_sessionId);
            } else {
                setSessionId(buildSessionId(lessonName, '1'));
            }
        }, [lessonName]);

        useEffect(function updateStoredSessionIdEff() {
            if (typeof localStorage !== 'undefined' && sessionId !== 'unknown') {
                const storedId = localStorage.getItem(buildSessionIdKey(lessonName));

                if (storedId !== sessionId) {
                    logger.debug('UPDATE_STORED_SESSION_ID', sessionId);
                    localStorage.setItem(buildSessionIdKey(lessonName), sessionId);
                }
            }
        }, [sessionId, lessonName]);

        useEffect(() => {
            function postMessageHandler(event: MessageEvent) {
                try {
                    const data: SberMeta = JSON.parse(event.data);

                    if (data?.type !== mockSberMeta.type || data.action !== mockSberMeta.action) {
                        logger.debug('FRAME_POST_MESSAGE_SKIPPED', event);
                        return;
                    }

                    if (!metadata || metadata?.apiUrl !== data.action_params?.apiUrl) {
                        logger.debug('FRAME_POST_MESSAGE_RECEIVED', data);
                        setMetadata(data.action_params);
                    }
                } catch (e) {
                    logger.error('ERROR PARSE METADATA', e, event.data);

                    return;
                }
            }

            window?.addEventListener('message', postMessageHandler);

            return () => {
                window?.removeEventListener('message', postMessageHandler);
            };
        }, []);

        return {
            sessionId,
            metadata,
            resetSessionId,
            shouldSaveSession,
            setShouldSaveSession,
            setLessonName,
            sendTaskResultRequest,
        };
    });
