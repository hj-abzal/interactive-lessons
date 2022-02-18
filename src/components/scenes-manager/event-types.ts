import {DragEndEvent} from '@dnd-kit/core';
import {DraggableEventPayload, DropableAreaData} from '@/components/scenes-manager/dnd-utils';
import {NodeWithStateType} from './types';

export enum SceneEventTypes {
    NodeDropped = 'NodeDropped',
    NodeClick = 'NodeClick',
    PopupToggled = 'PopupToggled',
}

export type NodeDroppedEvent = {
    type: SceneEventTypes.NodeDropped,
    payload: {
        draggable: {
            id: string,
            data?: DraggableEventPayload,
            delta: {x: number, y: number},
        },
        droppable?: {
            id: string,
            data?: DropableAreaData,
        }
    }
}

export type NodeClickEvent = {
    type: SceneEventTypes.NodeClick,
    payload: {
        id: string,
        data?: NodeWithStateType,
    }
}

export type PopupToggledEvent = {
    type: SceneEventTypes.PopupToggled,
    payload: {
        value: boolean,
    }
}

export type SceneEvent =
    | NodeDroppedEvent
    | PopupToggledEvent
    | NodeClickEvent;

export type SceneEventTask = {
    event: SceneEvent,
    processed?: boolean,
}

export const createNodeDroppedEvent = (e: DragEndEvent, zoom: number): NodeDroppedEvent => {
    return {
        type: SceneEventTypes.NodeDropped,
        payload: {
            draggable: {
                id: e.active.id,
                data: e.active?.data?.current as any as DraggableEventPayload,
                delta: {
                    x: e.delta.x / zoom,
                    y: e.delta.y / zoom,
                },
            },
            droppable: e.over?.id
                ? {
                    id: e.over?.id,
                    data: e.over?.data.current,
                }
                : undefined,
        },
    };
};

export const createNodeClickEvent = (payload: NodeClickEvent['payload']): NodeClickEvent => {
    return {
        type: SceneEventTypes.NodeClick,
        payload: payload,
    };
};

export const createPopupToggledEvent = (payload: {value: boolean}): PopupToggledEvent => {
    return {
        type: SceneEventTypes.PopupToggled,
        payload,
    };
};
