// DEPRECATED: Нужен для поддержки безконструкторных интерактивов
import React, {ReactNode, Suspense} from 'react';
import {GlobalProviderWithoutConstructor} from '@/context-providers/global-provider-without-constructor';
import {Global} from '@emotion/react';
import {resetStyles} from '@/utils/styles/reset.css';
import {globalStyles} from '@/utils/styles/global.css';

export const AppWrapperWithoutConstructor = ({children}: { children: ReactNode }) => (
    <Suspense fallback="loading">
        <GlobalProviderWithoutConstructor>
            <Global styles={resetStyles}/>
            <Global styles={globalStyles}/>
            {children}
        </GlobalProviderWithoutConstructor>
    </Suspense>
);
