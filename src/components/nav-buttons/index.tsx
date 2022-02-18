import React from 'react';

import Button, {ButtonProps} from '@/components/button';
import CornerWrapper, {CornerWrapperProps} from '@/components/corner-wrapper';
import {css, useTheme} from '@emotion/react';

export type NavButtonsProps = {
  buttons?: Array<{ label?: string } & ButtonProps>;
  style?: React.CSSProperties;
  position?: CornerWrapperProps['position'];
  withBacking?: boolean;
};

const NavButtons = ({
    buttons,
    position,
    style,
    withBacking,
}: NavButtonsProps) => {
    const theme = useTheme();
    return buttons ? (
        <CornerWrapper
            position={position || 'bottom-right'}
            style={style}
            css={withBacking && css`
                position: absolute;
                bottom: 20px;
                right: 20px;
                display: flex;
                padding: 6px;
                border-radius: 16px;
                background-color: ${theme.colors.transparent.light40};
                ${theme.effects.bgBlurLight};
            `}
        >
            {buttons.map(({label, ...props}, index) => (
                <Button
                    key={'nav-button-' + index.toString()}
                    css={
                        buttons.length > 1 && index <= buttons.length && {marginRight: 16}
                    }
                    {...props}
                >
                    {label}
                </Button>
            ))}
        </CornerWrapper>
    ) : <></>;
};

export default NavButtons;
