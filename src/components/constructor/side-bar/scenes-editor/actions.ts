import {
    BasicNodeType,
    commonNodesStatesIds,
    commonNodeStates,
    NodeDataInputs,
    NodeExtensionsType,
    NodeStateType,
    NodeType,
    NodeTypeEnum,
    NodeWithStateType,
    ScenesManagerStateType,
    SceneStateType,
    SceneType
} from '@/components/scenes-manager/types';
import {generateCopyName} from '@/utils/generate-copy-name';
import {ID} from '@/utils/generate-id';
import {logger} from '@/utils/logger';
import {detailedDiff} from 'deep-object-diff';
import _ from 'lodash';
import {cloneDeep} from 'lodash';
import {ScenesEditorStateType} from '.';
import {inputsToDefaultValuesData} from '../../script-blocks/lib';
import {
    copyNodeIdHelper,
    getNodeStateData,
    getNodeWithStateParams as getNodeWithStateParamsEx,
    traverseNodeStructure,
    updateSceneStatesOnDraft} from './helpers';
import {inputs} from './nodes-editors/node-inputs';

export type ActionContext = {
    moduleState: ScenesManagerStateType;
    produceModuleState: (draftCb: (draft:ScenesManagerStateType) => void, disableSyncToScriptBlock?: boolean) => void;
    editor: ScenesEditorStateType;
    produceEditorState: (draftCb: (draft:ScenesEditorStateType) => void) => void;
}

export const DEFAULT_SCENE_STATE_NAME = 'default';
export const DEFAULT_NODE_STATE_NAME = 'default';
export const INTERACTION_TAG_INPUT_NAME = 'interactionTag';
export const DROP_TAG_INPUT_NAME = 'dropTag';

function cleanModuleState(p: ActionContext) {
    p.produceModuleState((draft) => {
        Object.keys(draft.scenes).forEach((sceneId) => {
            delete draft.scenes[sceneId].currentSceneStateId;
        });

        Object.values(draft.nodes).forEach((node) => {
            delete node.isEditing;
        });

        delete draft.editorExpandedNodeId;

        draft.currentScenesIds = [];
    });
}

function updateCurrentSceneStatesSelect(p: ActionContext) {
    const {sceneId} = getCurrentScene(p);
    if (sceneId) {
        const currentSceneStatesSelect = p.moduleState.scenes[sceneId]?.sceneStatesIds.map((sceneStateId) => {
            const sceneStateData = getSceneStateById(p, {sceneStateId});
            return {
                label: sceneStateData?.name,
                value: sceneStateId,
            };
        });
        p.produceEditorState((draft) => {
            draft.currentSceneStatesSelect = currentSceneStatesSelect;
            if (!currentSceneStatesSelect?.some((sceneStateSel) =>
                sceneStateSel.value === draft.currentSceneStateSelect?.value)
                && draft.currentSceneStatesSelect?.[0]
            ) {
                const currentSceneStateSelect = draft.currentSceneStatesSelect[0];

                draft.currentSceneStateSelect = {
                    label: `Состояние: ${currentSceneStateSelect.label}`,
                    value: currentSceneStateSelect.value,
                };

                p.produceModuleState((draft) => {
                    const currentSceneStateId = currentSceneStateSelect.value;
                    draft.scenes[sceneId].currentSceneStateId = currentSceneStateId;
                }, true);
            }
        });
    }
}

function updateAvailableScenesSelect(p: ActionContext) {
    const availableScenesSelect = Object.keys(p.moduleState.scenes).map((sceneId) => {
        const sceneData = getSceneById(p, {sceneId});
        return {
            label: sceneData?.name,
            value: sceneId,
        };
    });
    p.produceEditorState((draft) => {
        draft.availableScenesSelect = availableScenesSelect;
        if (!availableScenesSelect?.some((sceneSel) =>
            sceneSel.value === draft.currentSceneSelect?.value)
                && draft.availableScenesSelect?.[0]
        ) {
            const option = draft.availableScenesSelect[0];
            draft.currentSceneSelect = {
                label: `Сцена: ${option.label}`,
                value: option.value,
            };
            p.produceModuleState((draft) => {
                const currentScenesIds = draft.currentScenesIds;
                draft.currentScenesIds = _.uniq([...currentScenesIds, option.value]);
            }, true);
        }
    });
}

function setCurrentSceneSelectById(p: ActionContext, payload: {
    sceneId: string;
}) {
    const {sceneId} = payload;
    const scene = getSceneById(p, {sceneId});
    setCurrentSceneSelect(p, {
        label: scene.name,
        value: sceneId,
    });
}

function setCurrentSceneSelect(p: ActionContext, payload: {
    label: string;
    value: string;
}) {
    p.produceEditorState((draft) => {
        draft.currentSceneSelect = {
            label: `Сцена: ${payload.label}`,
            value: payload.value,
        };
    });
    p.produceModuleState((draft) => {
        draft.currentScenesIds = [payload.value];
    });
}

function setCurrentSceneStateSelectById(p: ActionContext, payload: {
    sceneStateId: string;
}) {
    const {sceneStateId} = payload;
    const sceneState = getSceneStateById(p, {sceneStateId});
    setCurrentSceneStateSelect(p, {
        label: sceneState.name,
        value: sceneStateId,
    });
}

function setCurrentSceneStateSelect(p: ActionContext, payload: {
    label: string;
    value: string;
}, additional?: {
    sceneId: string;
}) {
    p.produceEditorState((draft) => {
        draft.currentSceneStateSelect = {
            label: `Состояние: ${payload.label}`,
            value: payload.value,
        };
    });
    const sceneId = additional?.sceneId || getCurrentScene(p).sceneId;
    p.produceModuleState((draft) => {
        if (sceneId) {
            draft.scenes[sceneId].currentSceneStateId = payload.value;
        }
    });
}

function getSceneById(p: ActionContext, payload: {
    sceneId: string;
}) {
    const sceneId = payload.sceneId;
    const sceneData = p.moduleState.scenes[sceneId];
    return sceneData;
}

function getCurrentScene(p: ActionContext) {
    const sceneId = p.editor.currentSceneSelect?.value;
    return {
        sceneId: sceneId || undefined,
        scene: sceneId && p.moduleState.scenes[sceneId] || undefined,
    };
}

function getCurrentSceneState(p: ActionContext) {
    const sceneStateId = p.editor.currentSceneStateSelect?.value;
    return {
        sceneStateId: sceneStateId,
        sceneState: sceneStateId && p.moduleState.scenesStates[sceneStateId] || undefined,
    };
}

function getSceneStateById(p: ActionContext, payload: {
    sceneStateId: string;
}) {
    const sceneStateId = payload.sceneStateId;

    const sceneStateData = p.moduleState.scenesStates[sceneStateId];
    return sceneStateData;
}

function createScene(p: ActionContext, payload: {
    name: string;
}) {
    const sceneId = ID();
    const scenesIds = Object.keys(p.moduleState.scenes);
    const sceneName = generateCopyName(payload.name, scenesIds);
    const {sceneStateId, sceneState} = createSceneState(p, {
        name: DEFAULT_SCENE_STATE_NAME,
    });
    const scene: SceneType = {
        name: sceneName,
        nodeStructure: {
            nodeId: NodeTypeEnum.Root,
        },
        sceneStatesIds: [sceneStateId],
        currentSceneStateId: sceneStateId,
    };
    p.produceModuleState((draft) => {
        draft.scenes[sceneId] = scene;
    });
    setCurrentSceneSelect(p, {
        label: sceneName,
        value: sceneId,
    });
    return {sceneId, scene, sceneStateId, sceneState};
}

function createSceneState(p: ActionContext, payload: {
    name: string;
} & Partial<SceneStateType>) {
    const prevSceneStateId = p.editor.currentSceneStateSelect?.value;
    let nodesStatesIds = {};
    if (prevSceneStateId) {
        nodesStatesIds = p.moduleState.scenesStates[prevSceneStateId].nodesStatesIds;
    }
    const sceneStateId = ID();
    const scenesStatesIds = Object.keys(p.moduleState.scenesStates);
    const newSceneStateName = payload.name;
    const sceneState = {
        nodesStatesIds: nodesStatesIds,
        ...payload,
        name: generateCopyName(newSceneStateName, scenesStatesIds),
    };
    p.produceModuleState((draft) => {
        draft.scenesStates[sceneStateId] = sceneState;
    });
    return {sceneStateId, sceneState};
}

function createCurrentSceneSceneState(p: ActionContext, payload: {
    name: string;
}) {
    const {sceneStateId, sceneState} = createSceneState(p, payload);
    const currentSceneId = p.editor.currentSceneSelect?.value;
    if (currentSceneId) {
        p.produceModuleState((draft) => {
            draft.scenes[currentSceneId].sceneStatesIds.push(sceneStateId);
        });
    }
    setCurrentSceneStateSelect(p, {
        label: sceneState.name,
        value: sceneStateId,
    });
}

function duplicateSceneStateById(p: ActionContext, payload: {
    sceneStateId: string;
}) {
    const sceneState = getSceneStateById(p, payload);
    const newSceneStateData = cloneDeep(sceneState);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newSceneStateId = createSceneState(p, newSceneStateData);
    // TODO: add newSceneStateId to relevant scene
}

function deleteSceneStateById(p: ActionContext, payload: {
    sceneStateId: string;
}) {
    p.produceModuleState((draft) => {
        delete draft.scenesStates[payload.sceneStateId];
        const {sceneId} = getCurrentScene(p);
        if (sceneId) {
            const sceneStatesIds = draft.scenes[sceneId].sceneStatesIds;
            const index = sceneStatesIds.indexOf(payload.sceneStateId);
            if (index > -1) {
                sceneStatesIds.splice(index, 1);
            }
        }
    });
}

function deleteSceneById(p: ActionContext, payload: {
    sceneId: string;
}) {
    p.produceModuleState((draft) => {
        const scene = draft.scenes[payload.sceneId];

        Object.keys(scene.sceneStatesIds).forEach((sceneStateId) => {
            delete draft.scenesStates[sceneStateId];
        });

        const indexOfSceneId = draft.currentScenesIds.indexOf(payload.sceneId);
        if (indexOfSceneId > -1) {
            draft.currentScenesIds.splice(indexOfSceneId, 1);
        }

        traverseNodeStructure((nodeId) => {
            delete draft.nodes[nodeId];
        }, scene.nodeStructure);

        delete draft.scenes[payload.sceneId];
    });
}

function onUpdateNodeData(p:ActionContext, payload: {
    newData: Partial<NodeType>;
}) {
    const {newData} = payload;
    const data = {};

    Object.keys(newData).forEach((inputName) => {
        const inputData = newData[inputName];

        if (inputName === INTERACTION_TAG_INPUT_NAME) {
            p.produceModuleState((draft) => {
                draft.interactionTags = _.uniq([...draft.interactionTags, inputData]).filter(Boolean);
            });
        }

        if (inputName === DROP_TAG_INPUT_NAME) {
            p.produceModuleState((draft) => {
                draft.dropTags = _.uniq([...draft.dropTags, inputData]).filter(Boolean);
            });
        }

        data[inputName] = inputData;
    });

    return data;
}

function setNodeDataByNodeId(p:ActionContext, payload: {
    nodeId: string;
    newData: NodeDataInputs;
    oldData: NodeWithStateType;
}) {
    const nodeInputsNewData = _.omitBy(payload.newData, _.isNil) as NodeDataInputs;
    const nodeWithStateOldData = _.omitBy(payload.oldData, _.isNil) as NodeWithStateType;

    const currentSceneStateId = p.editor.currentSceneStateSelect?.value;

    const diff = detailedDiff(nodeWithStateOldData, nodeInputsNewData) as {added, deleted, updated};

    logger.info('nodeData: DIFF', diff);

    if (nodeInputsNewData.currentStateId! in commonNodesStatesIds) {
        return;
    }

    if (nodeInputsNewData.currentStateName) {
        p.produceModuleState((draft) => {
            const nodeData = draft.nodes[payload.nodeId];
            if (!nodeData) {
                return;
            }

            const prevNodeStateId =
                (currentSceneStateId && draft.scenesStates[currentSceneStateId].nodesStatesIds[payload.nodeId])
                || nodeWithStateOldData.currentStateId;

            const currentNodeStatesIds = [...commonNodesStatesIds, ...nodeData.nodeStatesIds];

            let currentNodeStateId = currentNodeStatesIds.find((nodeStateId) =>
                draft.nodesStates[nodeStateId]?.name === nodeInputsNewData.currentStateName);

            const defaultNodeStateId = currentNodeStatesIds.find((nodeStateId) =>
                draft.nodesStates[nodeStateId]?.name === DEFAULT_NODE_STATE_NAME);

            const defaultNodeState = defaultNodeStateId
                ? draft.nodesStates[defaultNodeStateId]
                : draft.nodesStates[currentNodeStatesIds[0]];

            if (!currentNodeStateId) {
                currentNodeStateId = createNodeState(p, {
                    nodeId: payload.nodeId,
                    name: nodeInputsNewData.currentStateName || '',
                });
            }

            if (!diff.updated.currentStateName && !diff.added.currentStateName) {
                draft.nodesStates[currentNodeStateId] = getNodeStateData(
                    defaultNodeState,
                    draft.nodesStates[currentNodeStateId],
                    payload.newData
                );
                logger.info('nodeData: UPDATE', {
                    prevNodeStateId: prevNodeStateId,
                    currentNodeStateId: currentNodeStateId,
                    newData: nodeInputsNewData,
                    oldData: nodeWithStateOldData,
                });
            } else {
                if (currentSceneStateId) {
                    draft.scenesStates[currentSceneStateId].nodesStatesIds[payload.nodeId] = currentNodeStateId;
                }
                logger.info('nodeData: CHANGE_STATE', {
                    prevNodeStateId: prevNodeStateId,
                    currentNodeStateId: currentNodeStateId,
                    currentSceneStateId: currentSceneStateId,
                    newData: nodeInputsNewData,
                    oldData: nodeWithStateOldData,
                });
            }
            const nodeDataMerge = _.merge(nodeData, {
                name: payload.newData.name,
            });

            draft.nodes[payload.nodeId] = {
                ...nodeDataMerge,
                // id: nodeWithStateOldData.id,
                // type: nodeWithStateOldData.type,
                // name: nodeInputsNewData.name,
                // nodeStatesIds: nodeWithStateOldData.nodeStatesIds,
                currentStateId: undefined,
                currentStateName: undefined,
                // isEditing: nodeWithStateOldData.isEditing,
                interactionTag: payload.newData.interactionTag,
            } as NodeType;
        });

        onUpdateNodeData(p, payload);
    }
}

function generateNodeState(draft, currentSceneStateId, newNodeStateId, payload: {
    name: string;
    nodeId: string;
    overrideData?: Partial<NodeExtensionsType>,
    disableSwitchOnNewState?: boolean,
}) {
    if (currentSceneStateId) {
        const nodeData = draft.nodes[payload.nodeId];

        if (!nodeData.nodeStatesIds.some((nodeStateId) => draft.nodesStates[nodeStateId]?.name === payload.name)) {
            draft.nodesStates[newNodeStateId] = {
                // ...nodeCurrentState,
                ...(payload.overrideData || {}) as any,
                name: payload.name,
                id: newNodeStateId,
            };

            const nodeStatesIds = draft.nodes[payload.nodeId].nodeStatesIds;
            draft.nodes[payload.nodeId].nodeStatesIds = _.uniq([...nodeStatesIds, newNodeStateId]);

            if (!payload.disableSwitchOnNewState) {
                draft.scenesStates[currentSceneStateId].nodesStatesIds[payload.nodeId] = newNodeStateId;
            }
        }
    }
    return newNodeStateId;
}

function createNodeState(p:ActionContext, payload: {
    name: string;
    nodeId: string;
    overrideData?: Partial<NodeExtensionsType>,
    disableSwitchOnNewState?: boolean,
}) {
    const newNodeStateId = ID();
    const currentSceneStateId = p.editor.currentSceneStateSelect?.value;

    p.produceModuleState((draft) => {
        generateNodeState(draft, currentSceneStateId, newNodeStateId, payload);
    });
    return newNodeStateId;
}

function copyByNodeId(p:ActionContext, payload: {
    clipboard: {type: string, data: {
        nodeData: BasicNodeType;
        nodeStatesData: NodeStateType[];
    }};
    path: string;
}) {
    const {sceneId} = getCurrentScene(p);
    const newNodeId = ID();
    const clipboardNodeData = payload.clipboard.data.nodeData;
    const clipboardNodeStatesData = payload.clipboard.data.nodeStatesData;

    const currentSceneStateId = p.editor.currentSceneStateSelect?.value;
    if (sceneId) {
        p.produceModuleState((draft) => {
            const newNodeData = {
                id: newNodeId,
                type: clipboardNodeData.type,
                nodeStatesIds: [],
                currentStateId: undefined,
                currentStateName: undefined,
                name: generateCopyName(clipboardNodeData.name,
                    Object.values(draft.nodes).map((n) => n.name)),
            } as NodeType;

            const nodesStructureIds = draft.scenes[sceneId].nodeStructure;
            draft.nodes[newNodeId] = newNodeData;

            const newNodeStatesIds = [] as string[];

            const newIdByOldNodeStateId = {};

            commonNodesStatesIds.forEach((commonNodeStateId) => {
                newIdByOldNodeStateId[commonNodeStateId] = commonNodeStateId;
            });

            clipboardNodeStatesData.forEach((nodeState) => {
                const newNodeStateId = ID();

                generateNodeState(draft, currentSceneStateId, newNodeStateId, {
                    disableSwitchOnNewState: true,
                    name: nodeState.name,
                    nodeId: newNodeId,
                    overrideData: nodeState,
                });

                newIdByOldNodeStateId[nodeState.id] = newNodeStateId;

                newNodeStatesIds.push(newNodeStateId);
            });

            if (currentSceneStateId) {
                _.mapValues(draft.scenesStates, (sceneState, sceneStateId) => {
                    const oldNodeStateId = draft.scenesStates[sceneStateId].nodesStatesIds[clipboardNodeData.id];
                    const newNodeStateId = newIdByOldNodeStateId[oldNodeStateId];
                    draft.scenesStates[sceneStateId].nodesStatesIds[newNodeId] = newNodeStateId;
                });
            }

            traverseNodeStructure((nodeId, path) => {
                if (nodeId === payload.path) {
                    const parentPath = path.split('.').slice(0, -1).join('.');
                    const parentNodeId = _.get(
                        nodesStructureIds,
                        parentPath
                    );
                    const update = copyNodeIdHelper(parentNodeId, payload.path, newNodeId);
                    _.set(nodesStructureIds, parentPath, update);
                }
            }, nodesStructureIds);
            updateSceneStatesOnDraft(draft);
        });
    }
}

function addNodeByParentNodeId(p:ActionContext, payload: {
    parentNodeId?: string;
    type: NodeTypeEnum;
    nodeIndex?: number,
}) {
    const {sceneId} = getCurrentScene(p);
    const newNodeId = ID();
    const currentSceneStateId = p.editor.currentSceneStateSelect?.value;
    if (sceneId) {
        p.produceModuleState((draft) => {
            const newNodeStateId = createNodeState(p, {
                disableSwitchOnNewState: true,
                name: DEFAULT_NODE_STATE_NAME,
                nodeId: newNodeId,
                overrideData: inputsToDefaultValuesData(inputs[payload.type]),
            });

            const newNodeData = {
                id: newNodeId,
                type: payload.type,
                nodeStatesIds: [newNodeStateId],
                currentStateId: newNodeStateId,
                currentStateName: DEFAULT_NODE_STATE_NAME,
                name: generateCopyName(payload.type, [
                    ...Object.values(draft.nodes).map((n) => n.name),
                    payload.type
                ]),
            } as NodeType;

            const nodeStructure = draft.scenes[sceneId].nodeStructure;
            draft.nodes[newNodeId] = newNodeData;

            if (currentSceneStateId) {
                _.mapValues(draft.scenesStates, (sceneState, sceneStateId) => {
                    draft.scenesStates[sceneStateId].nodesStatesIds[newNodeId] = commonNodeStates.hidden.id;
                });
                draft.scenesStates[currentSceneStateId].nodesStatesIds[newNodeId] = newNodeStateId;
            }

            if (payload.parentNodeId) {
                traverseNodeStructure((nodeId, path) => {
                    if (nodeId === payload.parentNodeId) {
                        const nestedPath = path ? `${path}.nested` : 'nested';
                        const nested = _.get(nodeStructure, nestedPath) || {};
                        const nestedKeys = Object.keys(nested);

                        const indexToInsert = payload.nodeIndex || 0;

                        nestedKeys.splice(indexToInsert, 0, newNodeId);

                        const newNested = {};

                        nestedKeys.forEach((id) => {
                            if (id === newNodeId) {
                                newNested[id] = {nodeId: newNodeId};
                            } else {
                                newNested[id] = nested[id];
                            }
                        });

                        _.set(
                            nodeStructure,
                            nestedPath,
                            newNested
                        );
                    }
                }, nodeStructure);
            } else {
                draft.scenes[sceneId].nodeStructure[newNodeId] = {};
            }
            updateSceneStatesOnDraft(draft);
        });
    }
    return newNodeId;
}
function updateSceneStates(p: ActionContext) {
    p.produceModuleState((draft) => updateSceneStatesOnDraft(draft));
}

function deleteNodeById(p: ActionContext, payload: {
    nodeId: string;
}) {
    const {sceneId, scene} = getCurrentScene(p);
    if (sceneId && scene) {
        p.produceModuleState((draft) => {
            const nodesStructureIds = scene.nodeStructure;

            let deletingNodePath = 'unset';

            traverseNodeStructure((nodeId, path) => {
                if (nodeId === payload.nodeId) {
                    deletingNodePath = path;
                }
                if (path && path.includes(deletingNodePath)) {
                    _.unset(draft.scenes[sceneId].nodeStructure, path);

                    const nodeStatesIds = draft.nodes[nodeId]?.nodeStatesIds || [];

                    nodeStatesIds.forEach((nodeStateId) => {
                        delete draft.nodesStates[nodeStateId];
                    });

                    scene.sceneStatesIds.forEach((sceneStateId) => {
                        delete draft.scenesStates[sceneStateId].nodesStatesIds?.[nodeId];
                    });
                    delete draft.nodes[nodeId];
                }
            }, nodesStructureIds);
        });
    }
}

function getNodeWithStateParams(p: ActionContext, payload: {
    nodeId: string;
}) {
    return getNodeWithStateParamsEx({
        nodeData: p.moduleState.nodes[payload.nodeId],
        nodesStates: p.moduleState.nodesStates,
    }) as NodeType;
}

export const actions = {
    cleanModuleState,
    createScene,
    getSceneById,
    getCurrentScene,
    deleteSceneById,
    createSceneState,
    updateSceneStates,
    updateAvailableScenesSelect,
    createCurrentSceneSceneState,
    updateCurrentSceneStatesSelect,
    getSceneStateById,
    getCurrentSceneState,
    duplicateSceneStateById,
    deleteSceneStateById,
    setCurrentSceneSelectById,
    setCurrentSceneSelect,
    setCurrentSceneStateSelectById,
    setCurrentSceneStateSelect,
    setNodeDataByNodeId,
    addNodeByParentNodeId,
    copyByNodeId,
    deleteNodeById,
    createNodeState,
    getNodeWithStateParams,
};
