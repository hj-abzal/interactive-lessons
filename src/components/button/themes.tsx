/* eslint-disable no-unused-vars */
import {Theme} from '@emotion/react';

export type ButtonThemesSettingsType = {
  [key in ButtonThemeAppearanceType]: ButtonThemeType;
};
export type ButtonSizesType = {
  [key in ButtonSizeType]: {
    height: number;
    lrPadding: number;
    iconSize: number;
    fontSize: number;
  };
};

export type ButtonThemeType = {
  default: ButtonStateThemeType;
  hover?: ButtonStateThemeType;
  pressed?: ButtonStateThemeType;
  focused?: ButtonStateThemeType;
  disabled?: ButtonStateThemeType;
};

export type ButtonStateThemeType = {
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  outlineColor?: string;
  opacity?: number;
};

export type ButtonThemeAppearanceType =
  | 'primary'
  | 'secondary'
  | 'secondaryBright'
  | 'white'
  | 'accent'
  | 'primaryBordered'
  | 'transparentDark';

export enum ButtonThemeAppearanceEnum {
    primary = 'primary',
    secondary = 'secondary',
    secondaryBright = 'secondaryBright',
    white = 'white',
    accent = 'accent',
    primaryBordered = 'primaryBordered',
    transparentDark = 'transparentDark'
}

export type ButtonSizeType = 'small' | 'medium' | 'large';

export enum ButtonSizeEnum {
    small = 'small',
    medium = 'medium',
    large = 'large'
}

const sizes: ButtonSizesType = {
    medium: {
        height: 56,
        lrPadding: 24,
        iconSize: 24,
        fontSize: 15,
    },
    large: {
        height: 64,
        lrPadding: 24,
        iconSize: 24,
        fontSize: 15,
    },
    small: {
        height: 48,
        lrPadding: 24,
        iconSize: 24,
        fontSize: 15,
    },
};

const getThemes = (
    theme: Theme,
    type?: ButtonThemeAppearanceType,
    size?: ButtonSizeType
) => {
    const themes: ButtonThemesSettingsType = {
        primary: {
            default: {
                bgColor: theme.colors.primary.default,
                textColor: theme.colors.grayscale.white,
                borderColor: theme.colors.transparent.default,
                outlineColor: theme.colors.transparent.default,
                opacity: 1,
            },
            hover: {
                bgColor: theme.colors.primary.dark,
            },
            disabled: {
                opacity: 0.5,
            },
        },
        secondaryBright: {
            default: {
                bgColor: theme.colors.primary.light,
                textColor: theme.colors.primary.default,
                borderColor: theme.colors.transparent.default,
                outlineColor: theme.colors.transparent.default,
                opacity: 1,
            },
            hover: {
                bgColor: theme.colors.primary.light,
                textColor: theme.colors.primary.dark,
            },
            disabled: {
                opacity: 0.5,
            },
        },
        secondary: {
            default: {
                bgColor: theme.colors.grayscale.input,
                textColor: theme.colors.grayscale.offBlack,
                borderColor: theme.colors.transparent.default,
                outlineColor: theme.colors.transparent.default,
                opacity: 1,
            },
            hover: {
                bgColor: theme.colors.grayscale.line,
            },
            disabled: {
                opacity: 0.5,
            },
        },
        white: {
            default: {
                bgColor: theme.colors.grayscale.white,
                textColor: theme.colors.grayscale.offBlack,
                borderColor: theme.colors.transparent.default,
                outlineColor: theme.colors.transparent.default,
                opacity: 1,
            },
            hover: {
                textColor: theme.colors.primary.dark,
            },
            disabled: {
                opacity: 0.5,
            },
            focused: {
                outlineColor: theme.colors.primary.default,
            },
        },
        accent: {
            default: {
                bgColor: theme.colors.accent.default,
                textColor: theme.colors.grayscale.white,
                borderColor: theme.colors.transparent.default,
                outlineColor: theme.colors.transparent.default,
                opacity: 1,
            },
            hover: {
                bgColor: theme.colors.accent.dark,
            },
            disabled: {
                opacity: 0.5,
            },
        },
        primaryBordered: {
            default: {
                bgColor: theme.colors.transparent.default,
                textColor: theme.colors.primary.default,
                borderColor: theme.colors.primary.default,
                outlineColor: theme.colors.transparent.default,
                opacity: 1,
            },
            hover: {
                textColor: theme.colors.primary.dark,
                borderColor: theme.colors.primary.dark,
            },
            disabled: {
                opacity: 0.5,
            },
        },
        transparentDark: {
            default: {
                bgColor: theme.colors.transparent.black10,
                textColor: theme.colors.transparent.white65,
                borderColor: theme.colors.transparent.default,
                outlineColor: theme.colors.transparent.default,
                opacity: 1,
            },
            hover: {
                bgColor: theme.colors.transparent.black40,
                textColor: theme.colors.grayscale.white,
            },
            disabled: {
                opacity: 0.5,
            },
        },
    };
    for (const [typeName, typeValue] of Object.entries(themes)) {
        for (const [stateName] of Object.entries(typeValue)) {
            // console.log(`${stateName} : `);
            // console.log(themes[typeName][stateName]);
            if (stateName !== 'default') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                themes[typeName][stateName] = Object.assign(
                    {},
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    themes[typeName].default,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore

                    themes[typeName][stateName]
                );
            }
        }
    }
    return {t: themes[type || 'primary'], s: sizes[size || 'medium']};
};

export default getThemes;
