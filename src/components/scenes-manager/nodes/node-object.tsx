import React, {useMemo} from 'react';
import {css} from '@emotion/react';
import {getImage} from '@/codgen/all-images';
import {NodeObjectType, NodeTypeEnum, WithChildren} from '../types';
import {merge} from 'lodash';
import {useDraggableNode} from '@/components/scenes-manager/dnd-utils';

const defaultStyles = {
    onHover: {},
    onSelected: {},
    onPressed: {},
    onError: {},
};

export const getDimensionsStyles = (dimensions) => css`
  width: ${dimensions?.w ? dimensions.w + 'px' : 'auto'};
  height: ${dimensions?.h ? dimensions.h + 'px' : 'auto'};
`;

export const getCoordsStyles = (coords) => css`
  left: ${coords?.x ? coords.x + 'px' : 0};
  top: ${coords?.y ? coords.y + 'px' : 0};
`;

function getTransformStyles(p: {
    transform?: string
    draggableTransform?: { x: number, y: number, } | null,
}) {
    const transformProps: string[] = [];

    if (p.draggableTransform) {
        transformProps.push(`translate3d(${p.draggableTransform.x}px, ${p.draggableTransform.y}px, 0)`);
    }

    if (p.transform && !p.draggableTransform) {
        transformProps.push(p.transform);
    }

    if (transformProps.length === 0) {
        return 'transform: none;';
    }

    return `transform: ${transformProps.join(' ')};`;
}

function getTransitionStyles(p: {
    transition?: string,
    isDragging?: boolean,
}) {
    if (p.isDragging) {
        return '';
    }

    if (p.transition) {
        return `transition: ${p.transition};`;
    }

    return css`
      transition:
              filter 1s ease,
              opacity 0.2s ease,
              transform 0.5s ease;
      -webkit-transition:
              -webkit-filter 1s ease,
              opacity 0.2s ease,
              transform 0.5s ease;
    `;
}

const getAnimationStyles = ({
    animationName,
    animKeyframes,
    keyframes,
}: {
    animationName: string,
    animKeyframes?: string,
    keyframes?: string,
}) => {
    if (!animKeyframes) {
        return '';
    }

    return css`
      animation: ${animationName} ${animKeyframes};

      @keyframes ${animationName} {
        ${keyframes}
      }
    `;
};

const NodeObject = ({
    src,
    name,
    coords,
    dimensions,
    onClick,
    isHidden,
    isError,
    isHovered,
    isPressed,
    isSelected,
    isUnclickable,
    isDraggable,
    isSetStylesOnMask,
    filter,
    keyframes,
    animKeyframes,
    transform,
    transition,
    styles,
    boundMask,
    children,
    interactionTag,
    dropTag,
    getCurrentInteractionListeners: getCurrentInteractionListeners,
}: WithChildren<NodeObjectType>) => {
    const stylesOnEvent = merge(defaultStyles, styles);

    const interactionListeners = useMemo(() =>
        getCurrentInteractionListeners(), [getCurrentInteractionListeners]);

    const {draggableProps, draggable, transform: draggableTransform} = useDraggableNode({
        id: name,
        disabled: !isDraggable,
        eventPayload: {
            tag: interactionTag,
            dropTag,
            nodeType: NodeTypeEnum.Object,
        },
    });

    const animationName = useMemo(() => {
        return name.split(' ').join('-') + '-animation';
    }, [name]);

    return (
        <div
            onClick={!boundMask ? onClick : undefined}
            {...(!boundMask ? interactionListeners : {})}
            {...draggableProps}
            css={css`
              position: absolute;
              ${getCoordsStyles(coords)}
              ${getDimensionsStyles(dimensions)}
              pointer-events: ${isUnclickable || isHidden || boundMask ? 'none' : 'all'};
              opacity: ${isHidden ? 0 : 1};
              outline: none;
              ${getAnimationStyles({animationName, animKeyframes, keyframes})}

              ${getTransformStyles({transform, draggableTransform})}
              
              transform-style: preserve-3d;

              ${getTransitionStyles({transition, isDragging: draggable.isDragging})}
            
              filter: ${filter || 'none'};
              -webkit-filter: ${filter || 'none'};
              user-select: none;
              ${styles?.default}
              ${!isSetStylesOnMask && isSelected && (stylesOnEvent.onSelected)}
              ${!isSetStylesOnMask && isHovered && (stylesOnEvent.onHover)}
              ${!isSetStylesOnMask && isPressed && (stylesOnEvent.onPressed)}
              ${!isSetStylesOnMask && isError && (stylesOnEvent.onError)}

              & > img {
                width: 100%;
                position: relative;
              }
            `}>
            {boundMask &&
            <svg // TODO: load svg by link or insert as React Component
                css={css`
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  opacity: 1;
                  svg {
                    pointer-events: none;
                  }
                  path {
                    pointer-events: auto;
                    pointer-events: ${isUnclickable || isHidden ? 'none' : 'all'};
                    user-select: none;
                    opacity: 1;
                    fill: ${isSetStylesOnMask ? '#777' : 'transparent'};
                  }
                  ${isSetStylesOnMask && isSelected && (stylesOnEvent.onSelected)}
                  ${isSetStylesOnMask && isHovered && (stylesOnEvent.onHover)}
                  ${isSetStylesOnMask && isPressed && (stylesOnEvent.onPressed)}
                  ${isSetStylesOnMask && isError && (stylesOnEvent.onError)}
                `}
                onClick={onClick}
                {...interactionListeners}
            />}
            <img src={getImage(src) || src} />
            {children}
        </div>
    );
};

export default NodeObject;
