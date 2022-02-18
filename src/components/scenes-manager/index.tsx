import React, {useCallback, useEffect} from 'react';
import {createNodeClickEvent, createPopupToggledEvent, SceneEvent} from '@/components/scenes-manager/event-types';
import {useImmerState} from '@/utils/use-immer-state';
import {Scene} from './scene';
import {
    NodeStateType,
    NodeType,
    NodeTypeEnum,
    NodeWithStateType,
    ScenesManagerStateType,
    SceneStateType,
    SceneType
} from './types';
import Card from '@/components/card';
import {Popup} from '@/components/popup';
import {css} from '@emotion/react';

export type SetInteractionPayload = {
    nodeId: string;
    interactionTag?: string;
    interactionState: 'isHovered' | 'isPressed' | 'isSelected';
    isInteracted: boolean;
};

export type GetInteractionListenersPayload = {
    nodeId: string;
    interactionTag?: string;
    setInteractionState: (p: SetInteractionPayload) => void;
    nodeData: NodeWithStateType;
    onSceneEvent: (event: SceneEvent) => void;
};

const getInteractionListenersExternal = ({
    nodeId,
    nodeData,
    setInteractionState,
    onSceneEvent,
}: GetInteractionListenersPayload) => {
    const interactionTag = nodeData.interactionTag;

    return {
        onMouseDown: () => setInteractionState({
            nodeId,
            interactionTag,
            interactionState: 'isPressed',
            isInteracted: true,
        }),
        onMouseUp: () => {
            setInteractionState({
                nodeId,
                interactionTag,
                interactionState: 'isPressed',
                isInteracted: false,
            });
            setInteractionState({
                nodeId,
                interactionTag,
                interactionState: 'isSelected',
                isInteracted: false,
            });
            onSceneEvent(createNodeClickEvent({
                id: nodeId,
                data: nodeData,
            }));
        },
        onMouseOver: () => setInteractionState({
            nodeId,
            interactionTag,
            interactionState: 'isHovered',
            isInteracted: true,
        }),
        onMouseLeave: () => setInteractionState({
            nodeId,
            interactionTag,
            interactionState: 'isHovered',
            isInteracted: false,
        }),
    };
};
export type ExtendedSceneType = SceneType & {
    sceneId: string;
    nodes: Record<string, NodeType>;
    getInteractionListeners: (nodeId: string, nodeData: NodeWithStateType) => void;
    scenesStates: Record<string, SceneStateType>;
    nodesStates: Record<string, NodeStateType>;
    onSceneEvent: (event: SceneEvent) => void;
    editorExpandedNodeId?: string;
};

type ExtendedScenesManagerStateType = ScenesManagerStateType & {
    currentScenes?: ExtendedSceneType[];
};

const ScenesManager = (p: ScenesManagerStateType) => {
    const [localState, produceLocalState] = useImmerState<ExtendedScenesManagerStateType>(p);

    useEffect(() => produceLocalState((draft) => {
        draft.nodes = p.nodes;
        draft.scenesStates = p.scenesStates;
        draft.currentScenesIds = p.currentScenesIds;
        draft.scenes = p.scenes;
        draft.nodesStates = p.nodesStates;

        draft.currentPopupScenes = p.currentPopupScenes;
        draft.isPopupShown = p.isPopupShown;
    }), [
        p.nodes,
        p.scenesStates,
        p.currentScenesIds,
        p.scenes,
        p.nodesStates,
        p.currentPopupScenes,
        p.isPopupShown
    ]);

    const setInteractionState = useCallback((p: SetInteractionPayload) => {
        produceLocalState((draft) => {
            if (p.interactionTag) {
                Object.keys(draft.nodes).forEach((nodeId) => {
                    const node = draft.nodes[nodeId];

                    if ((
                        node.type !== NodeTypeEnum.Layer
                    && node.type !== NodeTypeEnum.Root
                    && node.interactionTag
                    && node.interactionTag === p.interactionTag
                    )) {
                        draft.nodes[nodeId] = {
                            ...node,
                            [p.interactionState]: p.isInteracted,
                        };
                    }
                });
            } else {
                const node = draft.nodes[p.nodeId];
                draft.nodes[p.nodeId] = {
                    ...node,
                    [p.interactionState]: p.isInteracted,
                };
            }
        });
    }, [produceLocalState]);

    const getInteractionListeners = useCallback((
        nodeId: string,
        nodeData: NodeWithStateType
    ) =>
        getInteractionListenersExternal({
            nodeId,
            nodeData,
            setInteractionState,
            onSceneEvent: p.onSceneEvent,
        })
    , [setInteractionState, p.onSceneEvent]);

    const onPopupToggle = useCallback((shouldShown) => {
        p.onSceneEvent(createPopupToggledEvent({value: shouldShown}));
    }, [p.onSceneEvent]);

    return (<>
        {localState.currentScenesIds?.map((sceneId) =>
            <Scene
                key={sceneId}
                sceneId={sceneId}
                nodes={localState.nodes}
                editorExpandedNodeId={p.editorExpandedNodeId}
                name={localState.scenes[sceneId].name}
                nodeStructure={localState.scenes[sceneId].nodeStructure}
                sceneStatesIds={localState.scenes[sceneId].sceneStatesIds}
                currentSceneStateId={localState.scenes[sceneId].currentSceneStateId}
                getInteractionListeners={getInteractionListeners}
                scenesStates={localState.scenesStates}
                nodesStates={localState.nodesStates}
                onSceneEvent={p.onSceneEvent}
            />
        )}
        {(localState?.currentPopupScenes?.length > 0 && localState.isPopupShown) &&
                <Popup
                    isShown={localState.isPopupShown}
                    canClose={true}
                    onShownToggle={onPopupToggle}
                >
                    <Card css={css`
                        width: 960px;
                        height: 720px;
                    `}>
                        {localState.currentPopupScenes?.map((sceneId) =>
                            <Scene
                                key={sceneId}
                                sceneId={sceneId}
                                nodes={localState.nodes}
                                editorExpandedNodeId={p.editorExpandedNodeId}
                                name={localState.scenes[sceneId].name}
                                nodeStructure={localState.scenes[sceneId].nodeStructure}
                                sceneStatesIds={localState.scenes[sceneId].sceneStatesIds}
                                currentSceneStateId={localState.scenes[sceneId].currentSceneStateId}
                                getInteractionListeners={getInteractionListeners}
                                scenesStates={localState.scenesStates}
                                nodesStates={localState.nodesStates}
                                onSceneEvent={p.onSceneEvent}
                            />
                        )}
                    </Card>
                </Popup>
        }
    </>
    );
};

export default ScenesManager;
