import {
    ConstructorScenarioState,
    SCENES_MANAGER_SCRIPT_MODULE_ID
} from '@/context-providers/constructor-scenario/index';
import {StateProducer} from '@/utils/use-immer-state';
import {scenesManager} from '@/components/constructor/script-blocks/scenes-manager';
import {BaseCoordsType, NodeStateType, NodeTypeEnum, ScenesManagerStateType} from '@/components/scenes-manager/types';
import {useEffect, useRef} from 'react';
import {
    NodeClickEvent,
    NodeDroppedEvent,
    PopupToggledEvent,
    SceneEventTypes
} from '@/components/scenes-manager/event-types';
import {RunStageParams} from '@/components/constructor/side-bar/script-block/widget';
import {logger} from '@/utils/logger';
import {DEFAULT_NODE_STATE_NAME} from '@/components/constructor/side-bar/scenes-editor/actions';
import {controlLogicScriptModule, ControlLogicState} from '@/components/constructor/script-blocks/control-logic';
import {extractStageParams} from '@/components/constructor/side-bar/script-block/widget/utils';

type EventHandlerCtx = {
    produceState: StateProducer<ConstructorScenarioState>,
    runStage: (stage: RunStageParams) => null,
}

function onNodeDropped(ctx: EventHandlerCtx, e: NodeDroppedEvent) {
    const dropZone = e.payload.droppable;
    const object = e.payload.draggable;

    if (object.data?.nodeType === NodeTypeEnum.EditingOverlay) {
        onEditingOverlayDropped(ctx, e);

        return;
    }

    if (!dropZone) {
        return;
    }

    // if exists drop events table

    // Если задана таблица дроп-тегов, смотрим в нее
    if (dropZone.data?.acceptsTags?.length) {
        const acceptedTag =
                dropZone.data?.acceptsTags.find((tagParams) => tagParams.tag === object.data?.dropTag)
                || dropZone.data.acceptsTags.find((tagParams) => tagParams.asDefault);

        if (acceptedTag) {
            const stageToRun = acceptedTag.runStage;

            if (stageToRun) {
                ctx.runStage(stageToRun);
            }
        }
    }

    // Проверка по acceptedNodes
    if (dropZone.data?.acceptedNodes) {
        const nodes = Array.isArray(dropZone.data?.acceptedNodes)
            ? dropZone.data?.acceptedNodes
            : [dropZone.data?.acceptedNodes];

        if (nodes?.includes(e.payload.draggable.id)) {
            if (dropZone.data.onDropRunStage) {
                ctx.runStage(dropZone.data.onDropRunStage);
            }
        } else if (dropZone.data.onErrorRunStage) {
            ctx.runStage(dropZone.data.onErrorRunStage);
        }

        return;
    }

    const isAcceptByInteractionTag = !dropZone.data?.interactionTag
                || dropZone.data.interactionTag === object.data?.tag;

    // Также смотрим на общий тег связи, или реагируем на любой объект, если укаазан общий сценарий
    if (isAcceptByInteractionTag) {
        const stageToRun = dropZone.data?.onDropRunStage;

        if (stageToRun) {
            ctx.runStage(stageToRun);
        }
    }

    checkDropzonesTable(ctx, e);
}

function checkDropzonesTable(ctx: EventHandlerCtx, e: NodeDroppedEvent) {
    ctx.produceState((draft) => {
        const scenesScriptModule: ScenesManagerStateType = draft.scriptModulesStates[SCENES_MANAGER_SCRIPT_MODULE_ID];

        const {dropEventsSettings} = scenesScriptModule;

        if (!dropEventsSettings) {
            return;
        }

        const controlLogicModule: ControlLogicState = draft.scriptModulesStates[controlLogicScriptModule.id];

        const table = controlLogicModule.tables?.[dropEventsSettings.tableId];

        if (!table) {
            return;
        }

        const acceptedItem = table.items.find((item) => {
            return e.payload.draggable.id === item[dropEventsSettings.draggableNodeColumn]
                && e.payload.droppable?.id === item[dropEventsSettings.zoneIdColumn];
        });

        if (acceptedItem && dropEventsSettings.onAcceptStage) {
            const {stageId, params} = extractStageParams(dropEventsSettings.onAcceptStage);

            ctx.runStage({
                stageId: stageId,
                params: {
                    [dropEventsSettings.stageFieldName]: acceptedItem,
                    ...(params || {}),
                },
            });
            return;
        }

        if (!acceptedItem && dropEventsSettings.onRejectStage) {
            const {stageId, params} = extractStageParams(dropEventsSettings.onRejectStage);

            ctx.runStage({
                stageId: stageId,
                params: {
                    draggableId: e.payload.draggable.id,
                    zoneId: e.payload.droppable?.id,
                    ...(params || {}),
                },
            });
            return;
        }
    });
}

function onNodeClick(ctx: EventHandlerCtx, e: NodeClickEvent) {
    const nodeData = e.payload.data;

    if (nodeData && (
        nodeData.type === NodeTypeEnum.Object
        || nodeData.type === NodeTypeEnum.Point
        || nodeData.type === NodeTypeEnum.Text
    )) {
        const stageToRun = nodeData.onClickRunStage;
        if (stageToRun) {
            ctx.runStage(stageToRun);
        }
    }
}

function onPopupToggled(ctx: EventHandlerCtx, e: PopupToggledEvent) {
    ctx.produceState((draft) => {
        const scenesManagerState: ScenesManagerStateType = draft.scriptModulesStates[SCENES_MANAGER_SCRIPT_MODULE_ID];

        scenesManagerState.isPopupShown = e.payload.value;
    });
}

function onEditingOverlayDropped(ctx: EventHandlerCtx, e: NodeDroppedEvent) {
    ctx.produceState((draft) => {
        const scenesManagerState: ScenesManagerStateType = draft.scriptModulesStates[SCENES_MANAGER_SCRIPT_MODULE_ID];

        const node = scenesManagerState.nodes[e.payload.draggable.id];

        // DANGER CRUNCH
        const currentSceneId = scenesManagerState.currentScenesIds[0];

        if (!currentSceneId) {
            return;
        }

        const currentSceneStateId = scenesManagerState.scenes[currentSceneId].currentSceneStateId;

        if (!currentSceneStateId) {
            return;
        }

        // const nodeStateId = scenesManagerState
        //     .scenesStates[currentSceneStateId]
        //     .nodesStatesIds[node.id];

        const defaultNodeStateId = scenesManagerState.nodes[node.id].nodeStatesIds.find((nodeStateId) =>
            scenesManagerState.nodesStates[nodeStateId]?.name === DEFAULT_NODE_STATE_NAME);

        // const currentNodeState = nodeStateId
        //     && scenesManagerState.nodesStates[nodeStateId] as NodeStateType & BaseCoordsType;

        const defaultNodeState = defaultNodeStateId
            && scenesManagerState.nodesStates[defaultNodeStateId] as NodeStateType & BaseCoordsType;

        if (!defaultNodeState) {
            return;
        }

        defaultNodeState.coords = {
            x: Math.round((defaultNodeState.coords?.x || 0) + e.payload.draggable.delta.x),
            y: Math.round((defaultNodeState.coords?.y || 0) + e.payload.draggable.delta.y),
        };

        // TODO: Translate on not default
        // if (
        //     nodeStateId === defaultNodeStateId
        //     && currentNodeState
        //     && currentNodeState.type === NodeTypeEnum.Object
        // ) {
        //     currentNodeState.transform =
        //         `${currentNodeState.transform}
        //         translate(
        //             ${e.payload.draggable.delta.x}px,
        //             ${e.payload.draggable.delta.y}px
        //         )`;
        // } else {
        //     defaultNodeState.coords = {
        //         x: Math.round((defaultNodeState.coords?.x || 0) + e.payload.draggable.delta.x),
        //         y: Math.round((defaultNodeState.coords?.y || 0) + e.payload.draggable.delta.y),
        //     };
        // }
    });
}

export function useSceneEvents(
    state: ConstructorScenarioState,
    produceState: StateProducer<ConstructorScenarioState>,
    runStage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addQueueTask // потои пригодится мб
) {
    const currentEventIndex = useRef<number>(0);

    const scenesManagerState = state.scriptModulesStates?.[scenesManager.id] as ScenesManagerStateType;
    const sceneEvents = scenesManagerState?.sceneEventTasks || [];

    useEffect(function processEventEff() {
        if (sceneEvents.length === 0 || !state.constructor.isSettled) {
            return;
        }

        const eventHandlerCtx: EventHandlerCtx = {
            produceState,
            runStage,
        };

        while (currentEventIndex.current < sceneEvents.length) {
            const event = sceneEvents[currentEventIndex.current];
            if (!event) {
                continue;
            }

            logger.info('scene event', event.event);

            switch (event.event.type) {
                case SceneEventTypes.NodeDropped:
                    onNodeDropped(eventHandlerCtx, event.event);
                    break;
                case SceneEventTypes.NodeClick:
                    onNodeClick(eventHandlerCtx, event.event);
                    break;
                case SceneEventTypes.PopupToggled:
                    onPopupToggled(eventHandlerCtx, event.event);
                    break;
                default:
                    logger.info('unexpected scene event', event.event);
                    break;
            }

            currentEventIndex.current++;
        }
    }, [sceneEvents, currentEventIndex]);

    useEffect(function clearEventsQueue() {
        if (sceneEvents.length > 0) {
            produceState((draft) => {
                const scenesDraft = draft.scriptModulesStates[scenesManager.id] as ScenesManagerStateType;

                scenesDraft.sceneEventTasks = [];
            });
            currentEventIndex.current = 0;
        }
    }, [(sceneEvents.length - 1) === currentEventIndex.current]);
}
