import React, {ReactNode} from 'react';
import {ThemeProvider as EmotionThemeProvider} from '@emotion/react';
import {defaultTheme} from './themes';

export default function ThemeProvider({children}: {children: ReactNode}) {
    return (
        <EmotionThemeProvider theme={defaultTheme}>{children}</EmotionThemeProvider>
    );
}
