import React from 'react';
import {css, useTheme} from '@emotion/react';
import {NodeDropAreaType, WithChildren} from '../types';
import {useDroppableNode} from '@/components/scenes-manager/dnd-utils';
import {getCoordsStyles, getDimensionsStyles} from './node-object';

export const NodeDropArea = ({
    name,
    isHidden,
    filter,
    transform,
    children,
    coords,
    dimensions,
    isDropDisabled,
    onDropRunStage,
    onErrorRunStage,
    acceptedNodes,
    acceptsTags,
    interactionTag,
    isHighlighted,
}: WithChildren<NodeDropAreaType>) => {
    const theme = useTheme();

    const {droppableProps} = useDroppableNode({
        disabled: isDropDisabled || isHidden,
        id: name,
        eventPayload: {
            acceptsTags,
            interactionTag,
            onDropRunStage: onDropRunStage,
            onErrorRunStage,
            acceptedNodes,
        },
    });

    if (isHidden) {
        return null;
    }

    return (
        <div
            {...droppableProps}
            css={css`
              position: absolute;
              ${getCoordsStyles(coords)}
              ${getDimensionsStyles(dimensions)}
              right: 0;
              bottom: 0;
              box-sizing: border-box;
              border: ${isHighlighted ? `2px solid ${theme.colors.orange.default};` : 'none'};
              background-position: center center;
              background-size: cover;
              pointer-events: ${isHidden ? 'none' : 'all'};
              opacity: ${isHidden ? 0 : 1};
              transform: ${transform ? transform : 'none'};
              transform-style: preserve-3d;
              transition: 
                filter 1s ease, 
                opacity 0.2s ease, 
                transform 0.5s ease;
              -webkit-transition: 
                -webkit-filter 1s ease, 
                opacity 0.2s ease, 
                transform 0.5s ease;
              filter: ${filter || 'none'};
              -webkit-filter: ${filter || 'none'};
              user-select: none;
            `}>
            {children}
        </div>
    );
};
