import {useDraggable, useDroppable} from '@dnd-kit/core';
import {useMemo} from 'react';
import {RunStageParams} from '@/components/constructor/side-bar/script-block/widget';
import {DropAreaTagSettings, NodeTypeEnum} from '@/components/scenes-manager/types';

export type DropableAreaData = {
    acceptsTags?: DropAreaTagSettings[],
    interactionTag?: string,
    onDropRunStage?: RunStageParams,
    onErrorRunStage?: RunStageParams,
    acceptedNodes?: string | string[],
}

export type DraggableEventPayload = {
    nodeType: NodeTypeEnum,
    tag?: string,
    dropTag?: string,
}

export type DraggableNodeResult = {
    draggable: ReturnType<typeof useDraggable>,
    transform?: {x: number, y: number} | null,
    // eslint-disable-next-line @typescript-eslint/ban-types
    draggableProps: {}
        | (
            { ref: ReturnType<typeof useDraggable>['setNodeRef'] }
            & ReturnType<typeof useDraggable>['listeners']
            & ReturnType<typeof useDraggable>['attributes']
        )

}

export const useDraggableNode = (p: {
    eventPayload: DraggableEventPayload,
    id: string,
    disabled?: boolean
}): DraggableNodeResult => {
    const draggable = useDraggable({
        id: p.id,
        disabled: p.disabled,
        data: p.eventPayload,
    });

    const draggableProps = useMemo(() => {
        if (p.disabled) {
            return {};
        }

        return {
            ref: draggable.setNodeRef,
            ...draggable.listeners,
            ...draggable.attributes,
        };
    }, [p.disabled, draggable.listeners, draggable.attributes, draggable.setNodeRef]);

    const transform = draggable.transform;

    return {
        draggable,
        transform,
        draggableProps,
    };
};

export type DroppableNodeResult = {
    droppable: ReturnType<typeof useDroppable>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    droppableProps: { ref: ReturnType<typeof useDroppable>['setNodeRef'] } | {},
}

export const useDroppableNode = (p: {
    eventPayload: DropableAreaData,
    id: string,
    disabled?: boolean
}): DroppableNodeResult => {
    const droppable = useDroppable({
        id: p.id,
        disabled: p.disabled,
        data: p.eventPayload,
    });

    const droppableProps = useMemo(() => {
        if (p.disabled) {
            return {};
        }

        return {
            ref: droppable.setNodeRef,
        };
    }, [p.disabled, droppable.setNodeRef]);

    return {
        droppable,
        droppableProps,
    };
};
