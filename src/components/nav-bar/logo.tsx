import {useTheme} from '@emotion/react';
import React from 'react';

type LogoProps = {
    isDark?: boolean;
};

export default function Logo(p: LogoProps) {
    const theme = useTheme();
    return (
        <svg className="logo" width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 5.5L20 0L20 22L10 16.5L0 22L0 0L10 5.5Z" fill={
                p.isDark
                    ? theme.colors.grayscale.white
                    : theme.colors.grayscale.ash
            }/>
        </svg>

    );
}
