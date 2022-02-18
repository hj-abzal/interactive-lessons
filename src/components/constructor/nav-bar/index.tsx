import React from 'react';
import {RevisionSelector} from '@/components/constructor/nav-bar/revision-selector';
import {css, keyframes, useTheme} from '@emotion/react';
import {useConstructorStorage} from '@/context-providers/constructor-storage';
import {Clickable} from '@/components/clickable';
import Slash from '@/components/nav-bar/slash';

const pulseKf = keyframes`
  0% {
    transform: scale(0.5);
  }

  50% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.5);
  }
`;

const SyncIndicator = () => {
    const theme = useTheme();
    const {isSyncLoading, syncError, syncDone, forceSync} = useConstructorStorage();

    return (
        <Clickable css={css`
            cursor: pointer;
            margin-left: 12px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            border: 4px solid ${theme.colors.grayscale.input};
            border-radius: 12px;
            
            .indicator {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                opacity: 0.8;
            }
            
            .indicator-loading {
                background-color: ${theme.colors.primary.default};
                position: relative;
                animation: ${pulseKf} .5s infinite both;
            }
            
            .indicator-error {
              background-color: ${theme.colors.error.default};
            }
            
            .indicator-success {
              background-color: ${theme.colors.success.default};
            }
            
            .indicator-label {
              margin-left: 8px;
              padding-right: 8px;
            }
        `}
        onClick={forceSync}
        >
            {isSyncLoading && <div className='indicator indicator-loading' />}
            {syncError && <div className='indicator indicator-error' />}
            {syncDone && !syncError && !isSyncLoading && <div className='indicator indicator-success' />}

            {(syncDone || isSyncLoading) &&
                <div className="indicator-label">
                    Синхронизация
                </div>
            }

            {syncError &&
                <div className="indicator-error">
                    {syncError}
                </div>
            }

        </Clickable>
    );
};

export const EditorNavBar = React.memo(function EditorNavBar() {
    return (
        <div
            css={css`
              display: flex;
              align-items: center;
              z-index: 1000;
              
              .editor-nav-revision-selector {
                width: 400px;
              }
            `}
        >
            <Slash />
            <div className='editor-nav-revision-selector'>
                <RevisionSelector />
            </div>
            <SyncIndicator />
        </div>
    );
});
