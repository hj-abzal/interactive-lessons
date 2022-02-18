import React from 'react';
import {RunStageParams} from '../constructor/side-bar/script-block/widget';
import {IconProps} from '../icon';
import {SceneEvent, SceneEventTask} from '@/components/scenes-manager/event-types';
import {NodePathAnimationModes} from './nodes/node-path-animation';
import {AnimeEasingNames} from '@/utils/anime-easing-enum';

export type DropEventsSettings = {
    tableId: string,
    zoneIdColumn: string,
    nodeReferenceColumn: string,
    draggableNodeColumn: string,
    onAcceptStage?: RunStageParams,
    onRejectStage?: RunStageParams,
    stageFieldName: string,
}

export interface ScenesManagerStateType {
    isPopupShown?: boolean,
    currentScenesIds: string[];
    currentPopupScenes: string[],
    commonNodesStatesIds: string[];
    scenes: Record<string, SceneType>;
    scenesStates: Record<string, SceneStateType>;
    nodes: Record<string, NodeType>;
    interactionTags: string[];
    dropTags: string[];
    nodesStates: Record<string, NodeStateType>;
    sceneEventTasks: SceneEventTask[],
    onSceneEvent: (event: SceneEvent) => void,
    editorExpandedNodeId?: string,
    dropEventsSettings?: DropEventsSettings,
}

// Куски стейта, которые нужно сохранять в бд
export const STORABLE_SCENE_STATE = [
    'commonNodesStatesIds',
    'scenes',
    'scenesStates',
    'nodes',
    'interactionTags',
    'dropTags',
    'nodesStates'
];

export const commonNodeStates = {
    hidden: {
        id: 'hidden',
        name: '⎋ Скрыт',
        isHidden: true,
    },
    disabled: {
        id: 'disabled',
        name: '⎋ Не кликабелен',
        filter: 'opacity(0.5)',
        isUnclickable: true,
    },
    highlighted: {
        id: 'highlighted',
        name: '⎋ Подсвечен',
        filter: 'saturate(5)',
    },
};

export const commonNodesStatesIds = [
    commonNodeStates.hidden.id,
    commonNodeStates.disabled.id,
    commonNodeStates.highlighted.id
];

export type BaseStylesType = {
    transform?: string;
    transition?: string;
    filter?: string;
    animKeyframes?: string;
    keyframes?: string;
    isHidden?: boolean;
}

export type BaseCoordsType = {
    coords: { x: number; y: number };
}

export type BaseDimensionsType = {
    dimensions: { w: number; h: number };
}

export type BaseInteractionType = {
    onClickRunStage?: string;
    onClick?: () => void;
    getCurrentInteractionListeners: (interactionTag?: string) => void;
    interactionTag?: string;
    isHovered?: boolean;
    isPressed?: boolean;
    isSelected?: boolean;
    isUnclickable?: boolean;
}

export type SceneType = {
    name: string;
    currentSceneStateId?: string;
    nodeStructure: NodeStructure;
    sceneStatesIds: string[];
}

export type NodeStructure = {
    nodeId: string;
    nested?: {
        [nodeId: string]: NodeStructure;
    };
}

export type SceneStateType = {
    name: string;
    sceneParams?: SceneParamsType;
    nodesStatesIds: {
        [nodeId: string]: string;
    };
};

export type SceneParamsType = {
    parallaxFactor?: number;
} & BaseStylesType;

export enum NodeTypeEnum {
    Root = 'root',
    Layer = 'Слой',
    StrictWrapper = 'Обертка',
    Object = 'Объект',
    DropArea = 'Зона для перетаскивания',
    Point = 'Точка',
    PathAnimation = 'Анимация по пути',
    Text = 'Текст',
    EditingOverlay = 'EditingOverlay',
}

export type NodeDataInputs = {
    currentStateName?: string;
} & NodeType & NodeExtensionsType;

export type BasicNodeType = {
    id: string;
    type: NodeTypeEnum;
    name: string;
    nodeStatesIds: string[];
    currentStateId?: string;
    currentStateName?: string;
    isEditing?: boolean;
    interactionTag?: string;
}

export type NodeExtensionsType =
    | NodeRootType
    | NodeLayerType
    | NodeObjectType
    | NodeDropAreaType
    | NodePointType
    | NodeTextType
    | NodeStrictWrapperType;

export type NodeType = BasicNodeType;

export type NodeWithStateType = BasicNodeType & NodeStateType;

export type NodeStateType = {
    id: string;
    name: string;
} & Partial<NodeExtensionsType>;

export type NodeRootType = {
    type: NodeTypeEnum.Root
};

export type NodeLayerType = {
    type: NodeTypeEnum.Layer;
    src?: string;
    isUnclickable?: boolean;
} & BaseStylesType;

export type NodeStrictWrapperType = {
    type: NodeTypeEnum.StrictWrapper;
    isUnclickable?: boolean;
    gridGap?: string;
    isVertical?: boolean;
    padding?: string;
    alignItems?: FlexAlignEnum;
    styles?: {
        wrapper?: any;
        item?: any;
    };
} & BaseStylesType & BaseCoordsType & BaseDimensionsType;

export enum TextAlignEnum {
    Left = 'По левому краю',
    Center = 'По центру',
    Right = 'По правому краю',
}

export enum FlexAlignEnum {
    Start = 'По началу',
    Center = 'По центру',
    End = 'По концу',
}

export type NodeTextType = {
    type: NodeTypeEnum.Text;
    text: string;
    align: TextAlignEnum;
    color?: string,
} & BaseStylesType & BaseInteractionType & BaseCoordsType;

export type NodeObjectType = {
    name: string,
    type: NodeTypeEnum.Object;
    src: string;
    isError?: boolean,
    isSetStylesOnMask?: boolean;
    isDraggable?: boolean,
    boundMask?: string;
    dropTag?: string,
    styles?: {
        default?: any;
        onHover?: any;
        onSelected?: any;
        onError?: any,
        onPressed?: any;
    };
} & BaseStylesType & BaseCoordsType & BaseDimensionsType & BaseInteractionType;

export type DropAreaTagSettings = {
    tag: string,
    runStage: RunStageParams,
    asDefault?: boolean,
}

export type NodeDropAreaType = {
    name: string,
    type: NodeTypeEnum.DropArea;
    isDropDisabled?: boolean;
    acceptsTags?: DropAreaTagSettings[],
    acceptedNodes?: string | string[],
    onErrorRunStage?: RunStageParams,
    onDropRunStage: RunStageParams,
    isHighlighted?: boolean,
} & BaseStylesType & BaseCoordsType & BaseDimensionsType & BaseInteractionType;

export type NodePointType = {
    type: NodeTypeEnum.Point;
    rotate?: number;
    icon?: IconProps['glyph'];
    isHidden?: boolean;
} & BaseCoordsType & BaseInteractionType;

export type NodePathAnimationType = {
    type: NodeTypeEnum.PathAnimation;
    svgPath: string;
    pointEasing: AnimeEasingNames;
    pointsQty: number;
    pointSize: number;
    pointColor: string;
    pointTextColor: string;
    pointText: string;
    pathColor: string;
    isRotateByPath: boolean;
    duration: number;
    delay: number;
    mode: NodePathAnimationModes;
} & BaseStylesType & BaseCoordsType & BaseInteractionType;

export type WithChildren<T> = {
    children: React.ReactNode;
} & T;

export type WithBasicNodeData<T> = BasicNodeType & T;
