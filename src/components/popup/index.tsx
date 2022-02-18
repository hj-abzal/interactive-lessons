import React, {ReactNode} from 'react';
import {css, useTheme} from '@emotion/react';
import Icon from '@/components/icon';
import {Clickable} from '@/components/clickable';

export type PopupProps = {
    isShown?: boolean,
    onShownToggle?: (val: boolean) => void,
    children?: ReactNode,
    canClose?: boolean,
}

export const Popup = ({
    isShown,
    children,
    onShownToggle,
    canClose,
}: PopupProps) => {
    const theme = useTheme();

    if (!isShown) {
        return null;
    }

    return (
        <div css={css`
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          z-index: 50000;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .popup-paranja {
            cursor: pointer;
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            background-color: ${theme.colors.transparent.black25};
            ${theme.effects.bgBlur};
          }
          
          .popup-content-wrapper {
              height: 100%;
              width: 100%;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow-y: auto;
          }
          
          .popup-content {
              position: relative;
              max-width: 960px;
              display: flex;
              align-items: center;
              justify-content: center;
              padding-top: 120px;
              padding-bottom: 80px;
          }
          
          .popup-close-button {
            position: sticky;
            top: 60px;
            border-radius: 50%;
            background-color: ${theme.colors.grayscale.white};
            padding: 8px;
          }
          
          .popup-close-button-wrapper {
            align-self: stretch;
            box-sizing: border-box;
            margin-left: -40px;
          }
        `}
        >
            <div className='popup-paranja' />

            <div className='popup-content-wrapper'>
                <div className='popup-content' >
                    {children}
                </div>
                {canClose &&
                    <div className='popup-close-button-wrapper'>
                        <Clickable
                            onClick={() => onShownToggle ? onShownToggle(!isShown) : null}
                            className='popup-close-button'
                        >
                            <Icon glyph={'CloseX'} />
                        </Clickable>
                    </div>
                }
            </div>
        </div>
    );
};
