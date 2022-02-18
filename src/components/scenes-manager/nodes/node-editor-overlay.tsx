import React from 'react';
import {css} from '@emotion/react';
import {NodeTypeEnum} from '../types';
import {useDraggableNode} from '@/components/scenes-manager/dnd-utils';

export type NodeEditorOverlayType = {
    type: NodeTypeEnum;
    editingNodeId: string,
    isActive: boolean;
}

export const NodeEditorOverlay = (p: NodeEditorOverlayType) => {
    const {draggableProps, transform} = useDraggableNode({
        id: p.editingNodeId,
        disabled: false,
        eventPayload: {
            nodeType: NodeTypeEnum.EditingOverlay,
        },
    });

    return p.isActive ? (
        <div
            {...draggableProps}
            style={{
                // @ts-ignore
                pointerEvents: 'all !important',
            }}
            className='node-editor-overlay'
            css={css`
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border: 2px solid #00AAFF;
                pointer-events: all !important;
                transform: translate3d(${transform?.x}px, ${transform?.y}px, 0);
                z-index: 10000;
            `}>
        </div>
    ) : null;
};
