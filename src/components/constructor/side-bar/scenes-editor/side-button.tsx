import React from 'react';
import Button from '@/components/button';
import {GlyphType} from '@/components/icon/glyphs';
import {css, useTheme} from '@emotion/react';

type SideButtonProps = {
    isActive?: boolean;
    position: 'top-right' | 'top-left' | 'right' | 'left';
    icon: GlyphType;
    onClick?: () => void;
}

export default function SideButton(p: SideButtonProps) {
    const theme = useTheme();
    return (
        <Button
            leftIcon={p.icon}
            size='small'
            theme={p.isActive ? 'primary' : 'white'}
            onClick={p.onClick}
            className={p.position}
            css={css`
                &:before {
                  left: -6px;
                  top: -6px;
                  right: -6px;
                  bottom: -6px;
                  border-width: 4px !important;
                }
                &.top-right {
                    border-radius: 4px 12px 4px 4px;
                    &:before {
                        border-radius: 8px 16px 8px 8px;
                    }
                }
                &.top-left {
                    border-radius: 12px 4px 4px 4px;
                    &:before {
                        border-radius: 16px 8px 8px 8px;
                    }
                }
                &.right {
                    border-radius: 4px 12px 12px 4px;
                    &:before {
                        border-radius: 8px 16px 16px 8px;
                    }
                }
                &.left {
                    border-radius: 12px 4px 4px 12px;
                    &:before {
                        border-radius: 16px 8px 8px 16px;
                    }
                }
                &.right, &.top-right { 
                    svg {
                        fill: ${theme.colors.grayscale.label};
                        width: 20px;
                        height: 20px;
                    }
                    &:hover {
                        svg {
                            fill: ${theme.colors.primary.default};
                        }

                    }
                }
                ${theme.shadows.medium};
            `}
        />
    );
}
