import React, {useRef} from 'react';
import {css, useTheme} from '@emotion/react';
import {appRouter, lessonsRouter} from '@/app/routes';
import {logger} from '@/utils/logger';
import {useRouterState} from '@/utils/routes';
import {mockSberMeta} from '@/context-providers/sberclass';

export const IframeLessonViewer = () => {
    const theme = useTheme();
    const frameRef = useRef<HTMLIFrameElement>(null);
    const appRouterState = useRouterState(appRouter);

    const match = appRouterState.match;

    let lessonPath;

    if (match?.is('iframeView')) {
        lessonPath = lessonsRouter.routes[match?.params?.lessonId as string]?.path;
    } else if (match?.is('iframeConstructorView')) {
        const {namespaceSlug, scenarioSlug} = match?.params || {};

        lessonPath = appRouterState.build('constructorView', {namespaceSlug, scenarioSlug});
    } else {
        return null;
    }

    if (!lessonPath) {
        return (
            <div>
                Cannot find lesson {JSON.stringify(match)}
            </div>
        );
    }

    // mock taskId like in sber iframe
    lessonPath += '?taskId=11111';

    return (
        <div css={css`
            display: flex;
            width: 100%;
            height: 100%;
          
            .iframe-container {
              margin: 0 auto;
              width: 100%;
              height: 100%;
            }
            
            .iframe {
              width: 100vw;
              /* height: 56.25vw; */
              height: 100vh;
              outline: 2px solid ${theme.colors.primary.light};
            }
        `}>
            <div className="iframe-container">
                <iframe
                    onLoad={(event) => {
                        logger.debug('IFRAME_LOADED');
                        event?.currentTarget?.contentWindow?.postMessage(JSON.stringify(mockSberMeta), '*');
                    }}
                    ref={frameRef}
                    className="iframe"
                    name="lesson"
                    src={lessonPath}
                />
            </div>
        </div>
    );
};
