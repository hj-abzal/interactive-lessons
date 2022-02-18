import {css, useTheme} from '@emotion/react';
import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import Icon, {IconProps} from '../icon';

export type AnchorType = {
    id: string;
    x: number;
    y: number;
    rotate?: number;
    icon?: IconProps['glyph'];
    isHidden?: boolean;
    isHovered?: boolean;
    isActive?: boolean;
    setIsHovered?: (isHovered: boolean) => void;
    setIsActive?: (isActive: boolean) => void;
    onClick?: () => void;
    tag?: string;
};

const size = 42;

function AnchorPoint(p: AnchorType) {
    const [isRendered, setIsRendered] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        setIsRendered(true);
    }, []);

    return (
        <button
            onClick={p.onClick}
            className={classNames({
                hidden: p.isHidden ? p.isHidden : (!isRendered),
                active: p.isActive,
                hover: p.isHovered,
            })}
            onMouseEnter={() => p.setIsHovered && p.setIsHovered(true)}
            onMouseLeave= {() => p.setIsHovered && p.setIsHovered(false)}
            onMouseDown= {() => p.setIsActive && p.setIsActive(true)}
            onMouseUp= {() => p.setIsActive && p.setIsActive(false)}
            css={css`
                position: absolute; 
                outline: none;
                cursor: pointer;
                border: 0;
                top: ${p.y}%;
                left: ${p.x}%;
                margin: -${size / 2}px;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: 0.2s ease;
                background-color: ${theme.colors.grayscale.white};
                > svg {
                    transform: rotate(${p.rotate || 0}deg);
                }
                &.hover {
                    transform: scale(1.3);
                }
                &.active {
                    background-color: ${theme.colors.primary.light};
                }
                &::after {
                    content: "";
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    bottom: 4px;
                    left: 4px;
                    border-radius: 50%;
                    /* border: 2px solid ${theme.colors.primary.default}; */
                }
                &.hidden {
                    transform: scale(0.5);
                    opacity: 0;
                    pointer-events: none;
                }
                ${theme.shadows.mediumDark};
            `}
        >
            {p.icon && <Icon color={theme.colors.primary.default} glyph={p.icon} />}
        </button>
    );
}

export default AnchorPoint;
