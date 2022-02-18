import React, {useState} from 'react';
import {LessonNavigation, Props as NavigationProps} from '@/components/devtools/lesson-navigation';
import {css, useTheme} from '@emotion/react';
import {isProduction} from '@/utils/env';
import {Clickable} from '@/components/clickable';
import {useSmartViewportWrapper} from '@/context-providers/smart-viewport-wrapper';
import {useSberclass} from '@/context-providers/sberclass';
import {useDevtools} from '@/context-providers/devtools';
import {DevtoolsList, DevtoolsSection} from '@/components/devtools/lesson-devtools/components';

export type Props = {
    navigation?: NavigationProps,
    context?: React.Context<any>
}

export const DEVTOOLS_CONTENT_PORTAL_ID = 'devtools-custom-content';

export const LessonDevtools = (props: Props) => {
    const {customContent} = useDevtools();
    const [isOpened, setIsOpened] = useState(false);
    const {resetSessionId, sessionId} = useSberclass();
    const {isSmartZoomEnabled, setIsSmartZoomEnabled} = useSmartViewportWrapper();
    const theme = useTheme();

    if (isProduction) {
        return null;
    }

    return (
        <div css={css`
            position: absolute;
            left: 0;
            top: 0;
            overflow-y: hidden;
            z-index: 1000;
            pointer-events: none;
         
            .content {
                font-size: 10px;
                
                font-family: monospace;
                transform: translateY(-200%);
                transition: all ease-in-out 0.2s;
                background-color: ${theme.colors.primary.light};
                padding-top: 30px;
                padding-left: 5px;
                padding-right: 10px;
                padding-bottom: 5px;
            }
            ${isOpened && css`
                pointer-events: all;
                .content {
                    transform: translateY(0);
                }
            `}
            
            .content-sections {
              display: flex;
            }
            
            .content-title {
              margin-bottom: 8px;
            }
            
            .section {
              margin-right: 15px;
            }
          

            .devtool-button {
                position: absolute;
                z-index: 100;
                cursor: pointer;
                width: 20px;
                height: 20px;
                background-color: ${theme.colors.primary.light};
                font-weight: bold;
                text-align: center;
                pointer-events: all;
            }
        `}>
            <Clickable
                onClick={() => setIsOpened((state) => !state)}
                className="devtool-button"
            >
                {isOpened ? 'X' : 'D'}
            </Clickable>

            <div className="content" >
                <div className='content-title'>
                    session {sessionId}
                </div>

                <div className='content-sections'>
                    <DevtoolsSection>
                        <DevtoolsList
                            title='settings'
                            items={[
                                {
                                    text: `smart-zoom: ${isSmartZoomEnabled ? 'on' : 'off'}`,
                                    onClick: () => setIsSmartZoomEnabled(!isSmartZoomEnabled),
                                },
                                {
                                    text: 'reset-session',
                                    onClick: resetSessionId,
                                }
                            ]}
                        />
                    </DevtoolsSection>

                    {props.navigation &&
                        <div className='section'>
                            <div className="section-title">lesson navigation</div>

                            <LessonNavigation {...props.navigation} />
                        </div>
                    }

                    <div id={DEVTOOLS_CONTENT_PORTAL_ID} className="custom-content-entry" />

                    {customContent &&
                        <DevtoolsSection>
                            <DevtoolsList
                                title={customContent.sectionName}
                                items={customContent.content}
                            />
                        </DevtoolsSection>
                    }
                </div>
            </div>
        </div>
    );
};
