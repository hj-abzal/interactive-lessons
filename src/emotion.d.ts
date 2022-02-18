import '@emotion/react';
import {defaultTheme} from '@/context-providers/theme/themes';

type __IntermediateThemeType = typeof defaultTheme;

declare module '@emotion/react' {
  type ColorType = {
    default?: string;
    dark?: string;
    darkMode?: string;
    light?: string;
    bg?: string;
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends __IntermediateThemeType {}
}
