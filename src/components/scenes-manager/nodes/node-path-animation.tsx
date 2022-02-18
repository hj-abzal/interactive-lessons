import React, {useEffect, useMemo, useRef, useState} from 'react';
import {css} from '@emotion/react';
import classNames from 'classnames';
import {NodePathAnimationType, WithBasicNodeData, WithChildren} from '../types';
import {getCoordsStyles} from './node-object';
import Anime, {anime} from 'react-anime';

export enum NodePathAnimationModes {
    infiniteLoop = 'infiniteLoop',
    onHover = 'onHover',
    onClick = 'onClick',
}

function NodePathAnimation({
    coords,
    isHidden,
    isUnclickable,
    pointEasing,
    pointSize,
    pointsQty,
    pointColor,
    pointTextColor,
    pointText,
    duration,
    delay,
    isRotateByPath,
    svgPath,
    pathColor,
    transform,
    transition,
    filter,
    mode,
    children,
    name,
}: WithChildren<WithBasicNodeData<NodePathAnimationType>>) {
    const [pathDimensions, setPathDimensions] = useState<({x, y, width, height} | null)>(null);
    const [isSettled, setIsSettled] = useState(false);

    const pathRef = useRef(null);

    useEffect(() => {
        if (pathDimensions) {
            setPathDimensions(null);
            setIsSettled(false);
        }
    }, [svgPath, pointEasing, pointsQty, delay, duration, mode, isRotateByPath]);

    useEffect(() => {
        if (pathRef.current && !pathDimensions) {// @ts-ignore
            const {x, y, width, height} = pathRef.current.getBBox();
            setPathDimensions({x: Math.floor(x), y: Math.floor(y), width: Math.ceil(width), height: Math.ceil(height)});
        }
    }, [
        pathRef.current,
        pathDimensions
    ]);

    useEffect(() => {
        if (!isSettled && pathRef.current && pathDimensions) {
            setTimeout(() => {
                setIsSettled(true);
            }, 100);
        }
    }, [isSettled, pathRef.current, pathDimensions]);

    const viewBox = useMemo(() => {
        if (pathDimensions) {
            return `${pathDimensions.x} ${pathDimensions.y} ${pathDimensions.width} ${pathDimensions.height}`;
        }
        return '0 0 0 0';
    }, [pathDimensions]);

    const {
        opacity,
        scale,
    } = useMemo(() => {
        return {
            opacity: [
                {value: 0, duration: 0},
                {value: 1, duration: 100},
                {value: 0, duration: 100, delay: duration - 200}
            ],
            scale: [
                {value: 0, duration: 0},
                {value: 1, duration: 100},
                {value: 0, duration: 100, delay: duration - 200}
            ],
        };
    }, [duration]);

    const path = anime.path(pathRef.current);

    return (
        <div
            className={classNames('path-point', {
                hidden: isHidden ? isHidden : (!pathDimensions),
                unclickable: isUnclickable,
            })}
            css={css`
                ${getCoordsStyles(coords)}
                position: absolute;
                width: auto;
                height: auto;
                pointer-events: none !important;

                &.hidden {
                    opacity: 0;
                    pointer-events: none;
                }
                
                transform: ${transform ? transform : 'none'};
                transition: ${transition ? transition : '0s'};
                filter: ${filter ? filter : 'none'};

                > svg {
                    width: ${pathDimensions ? pathDimensions.width + 'px' : 'auto'};
                    height: ${pathDimensions ? pathDimensions.height + 'px' : 'auto'};
                }
                > div {
                    transform-origin: left;
                }
        `}>
            {pathDimensions && <Anime
                targets={'.path-point'}
                translateX={path('x')}
                translateY={path('y')}
                opacity={opacity}
                scale={scale}
                rotate={isRotateByPath ? path('angle') : {}}
                duration={duration}
                loop={mode === NodePathAnimationModes.infiniteLoop}
                easing={pointEasing || 'linear'}
                delay={anime.stagger(delay)}
            > {// @ts-ignore pointsQty may be string
                    [...Array(parseInt(pointsQty, 10))].map((p, index) =>
                        <div
                            key={`${name}-point-${index}`}
                            css={css`
                            position: absolute;
                            outline: none;
                            top: -${pointSize / 2}px;
                            left: -${pointSize / 2}px;
                            font-size: ${pointSize / (pointText?.length || 0) * 0.8}px;
                            font-weight: bold;

                            border: 2px solid ${pointTextColor};
                            color: ${pointTextColor};

                            width: ${pointSize}px;
                            height: ${pointSize}px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: ${pointColor};
                            pointer-events: all;
                        `}>
                            {pointText}
                        </div>)}

            </Anime>}
            <svg id={`${name}-path`} viewBox={viewBox}>
                <path ref={pathRef} fill="none"
                    stroke={pathColor || 'transparent'}
                    d={svgPath || 'M0 0L100 60'}
                />
            </svg>
            {children}
        </div>
    );
}

export default React.memo(NodePathAnimation, (p, nextP) => {
    const propsToRerender = [
        'isHidden',
        'isUnclickable',
        'pointEasing',
        'pointSize',
        'pointsQty',
        'pointColor',
        'pointTextColor',
        'pointText',
        'duration',
        'delay',
        'isRotateByPath',
        'svgPath',
        'pathColor',
        'transform',
        'transition',
        'filter',
        'mode',
        'name',
        'is'
    ];

    const isChanged = propsToRerender.some((prop) => {
        return p[prop] !== nextP[prop];
    });

    const isCoordsChanged = p.coords?.x !== nextP.coords?.x && p.coords?.y !== nextP.coords?.y;
    const isEditingChanged = p.isEditing !== nextP.isEditing;

    return !isChanged && !isCoordsChanged && !isEditingChanged;
});
