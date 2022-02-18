import React, {useEffect, useMemo, useState} from 'react';
import Icon from '@/components/icon';
import {css, useTheme} from '@emotion/react';
import classNames from 'classnames';
import {NodePointType, WithChildren} from '../types';
import {getCoordsStyles} from './node-object';

const pointSize = 42;

function NodePoint({
    icon,
    coords,
    isHidden,
    isHovered,
    isPressed,
    rotate,
    isUnclickable,
    isSelected,
    getCurrentInteractionListeners,
    children,
}: WithChildren<NodePointType>) {
    const [isRendered, setIsRendered] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        setIsRendered(true);
    }, []);

    const interactionListeners = useMemo(() =>
        getCurrentInteractionListeners(), [getCurrentInteractionListeners]);

    return (
        <button
            className={classNames({
                hidden: isHidden ? isHidden : (!isRendered),
                active: isPressed,
                hover: isHovered,
                unclickable: isUnclickable,
                selected: isSelected,
            })}
            {...interactionListeners}
            css={css`
                position: absolute; 
                outline: none;
                cursor: pointer;
                border: 0;
                ${getCoordsStyles(coords)}
                margin: -${pointSize / 2}px;
                width: ${pointSize}px;
                height: ${pointSize}px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: 0.2s ease, top 0s, left 0s;
                background-color: ${theme.colors.grayscale.white};
                pointer-events: all;

                > svg {
                    transform: rotate(${rotate || 0}deg);
                }
                &.hover {
                    transform: scale(1.3);
                }
                &.active, &.selected {
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
                }
                &.hidden {
                    transform: scale(0.5);
                    opacity: 0;
                    pointer-events: none;
                }
                &.unclickable {
                    pointer-events: none;
                }
                ${theme.shadows.mediumDark};
            `}
        >
            {icon && <Icon color={theme.colors.primary.default} glyph={icon} />}
            {children}
        </button>
    );
}

export default NodePoint;
