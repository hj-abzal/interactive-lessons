import React from 'react';
import {css} from '@emotion/react';
import {FlexAlignEnum, NodeStrictWrapperType, WithChildren} from '../types';
import {getCoordsStyles, getDimensionsStyles} from './node-object';

const alignByLabel = {
    [FlexAlignEnum.Start]: 'start',
    [FlexAlignEnum.Center]: 'center',
    [FlexAlignEnum.End]: 'end',
};

const NodeStrictWrapper = ({
    styles,
    coords,
    dimensions,
    gridGap,
    padding,
    isVertical,
    alignItems,
    isHidden,
    filter,
    transform,
    transition,
    children,
    isUnclickable,
}: WithChildren<NodeStrictWrapperType>) => {
    return (
        <div
            css={css`
                position: absolute;
                ${getCoordsStyles(coords)}
                ${getDimensionsStyles(dimensions)}

                overflow: visible;
                display: grid; 
                grid-auto-flow: ${isVertical ? 'row' : 'column'}; 
                grid-auto-columns: min-content; 
                grid-auto-rows: min-content; 
                grid-template-columns: repeat(auto-fill, auto-fill);
                align-items: ${alignItems ? alignByLabel[alignItems] : 'center'};
                justify-items: ${alignItems ? alignByLabel[alignItems] : 'center'};
                gap: ${gridGap ? gridGap : '10px'};
                padding: ${padding ? padding : '0'};
                

                pointer-events: ${isUnclickable || isHidden ? 'none' : 'all'};
                opacity: ${isHidden ? 0 : 1};
                transform: ${transform ? transform : 'none'};
                transition: ${transition ? transition : '0.5s ease'};
                filter: ${filter ? filter : 'none'};
                

                > *:not(.node-editor-overlay) {
                    position: relative !important;
                    display: inline-block;
                    
                    ${styles?.item};
                }
                ${styles?.wrapper};
            `}>
            {children}
        </div>
    );
};

export default NodeStrictWrapper;
