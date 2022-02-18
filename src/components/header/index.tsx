import React from 'react';
import {css} from '@emotion/react';
import {NavBar} from '@/components/nav-bar';

export const Header = () => {
    return (
        <div css={css`
            z-index: 1000;
            display: flex;
        `}>
            <NavBar />
        </div>
    );
};
