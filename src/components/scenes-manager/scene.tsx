import {css} from '@emotion/react';
import React, {useCallback, useMemo} from 'react';
import {Wrapper} from './css';
import {BaseStylesType} from './types';
import {Node} from './nodes';
import {ExtendedSceneType} from '.';
import {
    createNodeDroppedEvent
} from '@/components/scenes-manager/event-types';
import {DndContext, DragEndEvent} from '@dnd-kit/core';
import {useSmartViewportWrapper} from '@/context-providers/smart-viewport-wrapper';
import {getNodesWithStateParamsFromSceneState} from '../constructor/side-bar/scenes-editor/helpers';

export const getBasicStyles = (p?: BaseStylesType & Record<string, any>) => p && css`
    transition: ${p.transition ? p.transition : '0.5s ease'};
    transform: ${p.transform ? p.transform : 'none'};
    opacity: ${p.isHidden ? 0 : 1};
    visibility: ${p.isHidden ? 'hidden' : 'visible'};
    // pointer-events: ${p.isUnclickable || p.isHidden || p.boundMask ? 'none' : 'all'};
    filter: ${p.filter ? p.filter : 'none'};
    background: #000;
  
    div {
      pointer-events: none !important;
    }
`;

export const Scene = (p: ExtendedSceneType) => {
    const {zoom} = useSmartViewportWrapper();
    const currentSceneState = p.currentSceneStateId ? p.scenesStates[p.currentSceneStateId] : undefined;

    const currentSceneStateNodes = useMemo(() =>
        getNodesWithStateParamsFromSceneState(p.nodes, currentSceneState?.nodesStatesIds || {}, p.nodesStates),
    [currentSceneState?.nodesStatesIds, p.nodes, p.nodesStates]);

    const dragModifiers = useMemo(() => {
        return [
            ({transform}) => {
                return ({...transform, x: transform.x / zoom, y: transform.y / zoom});
            }
        ];
    }, [zoom]);

    const onDragEnd = useCallback((e: DragEndEvent) => {
        p.onSceneEvent(createNodeDroppedEvent(e, zoom));
    }, [p.onSceneEvent, zoom]);

    return (
        <DndContext onDragEnd={onDragEnd} modifiers={dragModifiers}>
            <Wrapper
                css={p.editorExpandedNodeId && css`
                   pointer-events: none;
                   
                   * {
                     pointer-events: none !important;
                   }
                `}
            >
                <Node
                    nodes={currentSceneStateNodes}
                    nodeStructure={p.nodeStructure}
                    getInteractionListeners={p.getInteractionListeners}
                />
            </Wrapper>
        </DndContext>
    );
};
