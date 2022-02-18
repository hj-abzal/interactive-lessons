import {css} from '@emotion/react';
import React from 'react';
import {useFullScreen} from 'react-browser-hooks';
import Button from '../button';

export const FullScreenButton = () => {
    const {toggle, fullScreen} = useFullScreen();

    return (
        <div css={css`
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
        `}>
            {!fullScreen && <Button
                size={'small'}
                onClick={toggle}
                leftIcon={'Expand'}
                theme={'transparentDark'}
            />}
        </div>
    );
};
