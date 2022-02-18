import {useTheme} from '@emotion/react';
import React from 'react';

type SlashProps = {
    isDark?: boolean;
};

export default function Slash(p: SlashProps) {
    const theme = useTheme();
    return (
        <svg className="slash" width="9" height="20" viewBox="0 0 9 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.2002 0.5H8.2002L2.2002 19.5H0.200195L6.2002 0.5Z" fill={
                p.isDark
                    ? theme.colors.transparent.light40
                    : theme.colors.grayscale.line
            }/>
        </svg>

    );
}
