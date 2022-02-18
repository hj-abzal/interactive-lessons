import React from 'react';
import Button, {ButtonProps} from '@/components/button';
import {css, useTheme} from '@emotion/react';

type NextButtonProps = ButtonProps & {label?: string}

export const NextButton = (props:NextButtonProps) => {
    const theme = useTheme();
    return <div css={css`
        position: absolute;
        bottom: 20px;
        right: 20px;
        display: flex;
        padding: 8px;
        border-radius: 16px;
        background-color: ${theme.colors.transparent.light40};
        ${theme.effects.bgBlurLight};
    `}>
        <Button {...props}>{props.label}</Button>
    </div>;
};
