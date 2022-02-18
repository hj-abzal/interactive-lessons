import React from 'react';
import {Global, css} from '@emotion/react';
import {resetStyles} from '@/utils/styles/reset.css';
import {globalStyles} from '@/utils/styles/global.css';
import {GlobalProvider} from '@/components/lesson-container';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <div css={css`
      #content-16-9 {
        padding: 20px;
      }
    `}>
      <GlobalProvider
          globalProps={{
            disabledAspectRationWrapper: true,
            disableSessions: true,
         }}
      >
        <Story/>
        <Global styles={resetStyles} />
        <Global styles={globalStyles} />
      </GlobalProvider>
    </div>
  ),
];
