import React, {ReactNode, Suspense} from 'react';
import {Global} from '@emotion/react';
import {resetStyles} from '@/utils/styles/reset.css';
import {BrowserRouter as Router} from 'react-router-dom';
import {globalStyles} from '@/utils/styles/global.css';
import {GlobalProvider} from '@/context-providers';

export const AppWrapper = ({children}: {children: ReactNode}) => (
    <Suspense fallback="loading">
        <Router>
            <GlobalProvider>
                <Global styles={resetStyles} />
                <Global styles={globalStyles} />
                {children}
            </GlobalProvider>
        </Router>
    </Suspense>
);
