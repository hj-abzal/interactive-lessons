import ScenesManager from '@/components/scenes-manager';
import {
    commonNodesStatesIds,
    ScenesManagerStateType
} from '@/components/scenes-manager/types';
import {InputTypeType} from '../side-bar/script-block/widget/types';
import {ScriptModule} from '@/components/constructor/script-blocks/types';
import {scriptBlock} from '@/components/constructor/script-blocks/lib';
import {initEmptyState} from '../side-bar/scenes-editor';
import {traverseNodeStructure} from '../side-bar/scenes-editor/helpers';
import {controlLogicScriptModule} from '@/components/constructor/script-blocks/control-logic';

export const scenesManager: ScriptModule = {
    id: 'scenesManager',
    name: 'Менеджер слоев и объектов',
    icon: 'DNDConstructorProvider',
    color: '#5052FA',
    Component: ScenesManager,
    initialState: initEmptyState,
    hook: useScenesManagerScripts,
};

function useScenesManagerScripts() {
    const scenesManagerSetup = scriptBlock<ScenesManagerStateType>({
        title: 'Установить сцены',
        func: ({scenesData}, {produceModuleState}) => {
            produceModuleState((draft) => {
                Object.keys(scenesData).forEach((key) => {
                    draft[key] = scenesData[key];
                });

                draft.onSceneEvent = (e) => {
                    produceModuleState((draft) => {
                        draft.sceneEventTasks.push({
                            processed: false,
                            event: e,
                        });
                    });
                };
            });
        },
        isBlocked: true,
        isRunOnChangeInput: true,
        inputs: {
            scenesData: {
                label: 'Сцены, состояния, слои, объекты',
                type: InputTypeType.scene,
            },
        },
    });

    const setScenesBlock = scriptBlock<ScenesManagerStateType>({
        title: 'Активировать сцены',
        func: ({scenesNames}, {produceModuleState}) => {
            produceModuleState((draft: ScenesManagerStateType) => {
                const currentScenesIds = Object.entries(draft.scenes).map(([sceneId, scene]) => {
                    if (draft.scenes[sceneId]) {
                        draft.scenes[sceneId].currentSceneStateId = draft.scenes[sceneId].sceneStatesIds[0];
                    }
                    return scenesNames?.includes(scene.name)
                        ? sceneId
                        : null;
                }).filter(Boolean) as string[];

                draft.currentScenesIds = currentScenesIds;
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            scenesNames: {
                label: 'Список сцен',
                type: InputTypeType.multiKey,
                searchable: `scriptModulesStates.${scenesManager.id}.scenes`,
                valueName: 'name',
            },
        },
    });

    const setPopupScenes = scriptBlock<ScenesManagerStateType>({
        title: 'Показать сцену в попапе',
        func: ({scenesNames}, {produceModuleState}) => {
            produceModuleState((draft: ScenesManagerStateType) => {
                const currentScenesIds = Object.entries(draft.scenes).map(([sceneId, scene]) => {
                    return scenesNames?.includes(scene.name)
                        ? sceneId
                        : null;
                }).filter(Boolean) as string[];

                draft.currentPopupScenes = currentScenesIds;
                draft.isPopupShown = true;
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            scenesNames: {
                label: 'Список сцен',
                type: InputTypeType.multiKey,
                searchable: `scriptModulesStates.${scenesManager.id}.scenes`,
                valueName: 'name',
            },
        },
    });

    const setDropEvents = scriptBlock<ScenesManagerStateType>({
        title: 'Настройка дроп событий',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft: ScenesManagerStateType) => {
                draft.dropEventsSettings = {
                    tableId: inputs.tableId,
                    draggableNodeColumn: inputs.draggableNodeColumn,
                    zoneIdColumn: inputs.zoneIdColumn,
                    nodeReferenceColumn: inputs.nodeReferenceColumn,
                    onAcceptStage: inputs.onAcceptStage,
                    onRejectStage: inputs.onRejectStage,
                    stageFieldName: inputs.stageFieldName,
                };
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            tableId: {
                label: 'Связать с таблицей',
                type: InputTypeType.multiKey,
                searchable: `scriptModulesStates.${controlLogicScriptModule.id}.tables`,
            },
            zoneIdColumn: {
                label: 'Колонка зоны',
                type: InputTypeType.textarea,
            },
            nodeReferenceColumn: {
                label: 'Колонка объекта зоны',
                type: InputTypeType.textarea,
            },
            draggableNodeColumn: {
                label: 'Колонка перетаскиваемого объекта',
                type: InputTypeType.textarea,
            },
            onAcceptStage: {
                label: 'При правильном дропе запустить сценарий',
                type: InputTypeType.stage,
            },
            stageFieldName: {
                label: 'Прокинуть событие в параметр',
                type: InputTypeType.textarea,
            },
            onRejectStage: {
                label: 'При ошибке запустить сценарий',
                type: InputTypeType.stage,
            },
        },
    });

    const setSceneStateBlock = scriptBlock({
        title: 'Активировать состояние сцены',
        func: ({sceneName, sceneStateName}, {produceModuleState}) => {
            produceModuleState((draft: ScenesManagerStateType) => {
                if (sceneName) {
                    const [sceneId, scene] = Object.entries(draft.scenes).find(([, scene]) =>
                        scene.name === sceneName) || [null, null];

                    if (sceneId && scene && scene.nodeStructure) {
                        scene?.sceneStatesIds.forEach((sceneStateId) => {
                            if (draft.scenesStates[sceneStateId].name === sceneStateName) {
                                draft.scenes[sceneId].currentSceneStateId = sceneStateId;
                            }
                        });

                        traverseNodeStructure((nodeId) => {
                            if (draft.nodes[nodeId]) {
                                delete draft.nodes[nodeId].currentStateId;
                                delete draft.nodes[nodeId].currentStateName;
                            }
                        }, scene.nodeStructure);
                    }
                }
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            sceneName: {
                label: 'Сцена',
                type: InputTypeType.key,
                searchable: `scriptModulesStates.${scenesManager.id}.scenes`,
                valueName: 'name',
                placeholder: 'Название сцены',
                searchableFilter:
                (item:ScenesManagerStateType['scenes'], itemKey, globalState) => Boolean(
                    globalState.scriptModulesStates[scenesManager.id]
                        .currentScenesIds.includes(itemKey)),
            },
            sceneStateName: {
                label: 'Состояние',
                type: InputTypeType.key,
                searchable: `scriptModulesStates.${scenesManager.id}.scenesStates`,
                valueName: 'name',
                placeholder: 'Состояние сцены',
                searchableFilter:
                (item: ScenesManagerStateType['scenes'], itemKey: string, globalState, inputsValues) => {
                    const moduleState = globalState.scriptModulesStates[scenesManager.id] as ScenesManagerStateType;
                    const scene = Object.values(moduleState.scenes).find((scene) =>
                        inputsValues.sceneName === scene.name);
                    return Boolean(scene?.sceneStatesIds.includes(itemKey));
                },
            },
        },
    });

    const setObjectStateBlock = scriptBlock({
        title: 'Активировать состояние объекта/слоя/точки/дропзоны',
        func: ({sceneName, nodeName, nodeStateName}, {produceModuleState}) => {
            produceModuleState((draft: ScenesManagerStateType) => {
                if (sceneName) {
                    const [sceneId, scene] = Object.entries(draft.scenes).find(([, scene]) =>
                        scene.name === sceneName) || [null, null];
                    if (sceneId) {
                        traverseNodeStructure((currentSceneNodeId) => {
                            const currentSceneNodeData = draft.nodes[currentSceneNodeId];
                            if (currentSceneNodeData && nodeName === currentSceneNodeData.name) {
                                const nodeStatesIds = [...currentSceneNodeData.nodeStatesIds, ...commonNodesStatesIds];
                                const nodeStateId = nodeStatesIds
                                    .find((nodeStateId) => (
                                        draft.nodesStates[nodeStateId]?.name
                                        && draft.nodesStates[nodeStateId]?.name === nodeStateName
                                    ));
                                if (nodeStateId && nodeStatesIds.includes(nodeStateId)) {
                                    draft.nodes[currentSceneNodeId].currentStateId = nodeStateId;
                                }
                                if (!nodeStateName) {
                                    delete draft.nodes[currentSceneNodeId].currentStateId;
                                }
                            }
                        }, scene?.nodeStructure);
                    }
                }
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            sceneName: {
                label: 'Сцена',
                type: InputTypeType.key,
                searchable: `scriptModulesStates.${scenesManager.id}.scenes`,
                valueName: 'name',
                placeholder: 'Название сцены',
                searchableFilter:
                (item:ScenesManagerStateType['scenes'], itemKey, globalState) => Boolean(
                    globalState.scriptModulesStates[scenesManager.id]
                        .currentScenesIds.includes(itemKey)),
            },
            nodeName: {
                label: 'Объект',
                type: InputTypeType.key,
                searchable: `scriptModulesStates.${scenesManager.id}.nodes`,
                valueName: 'name',
                placeholder: 'Название объекта',
                searchableFilter:
                (nodeData:ScenesManagerStateType['nodes'], nodeId, globalState, inputsValues) => {
                    const moduleState = globalState.scriptModulesStates[scenesManager.id] as ScenesManagerStateType;
                    const scene = Object.values(moduleState.scenes).find((scene) =>
                        inputsValues.sceneName === scene.name);
                    let res = false;
                    traverseNodeStructure((currentSceneNodeId) => {
                        if (nodeId === currentSceneNodeId) {
                            res = true;
                        }
                    }, scene?.nodeStructure);
                    return res;
                },
            },
            nodeStateName: {
                label: 'Состояние (при пустом поле будет использоваться состояние из состояния сцены)',
                type: InputTypeType.key,
                searchable: `scriptModulesStates.${scenesManager.id}.nodesStates`,
                valueName: 'name',
                placeholder: 'Состояние объекта',
                searchableFilter:
                (nodeState:ScenesManagerStateType['nodesStates'], nodeStateId: string, globalState, inputsValues) => {
                    if (commonNodesStatesIds.includes(nodeStateId)) {
                        return true;
                    }
                    const moduleState = globalState.scriptModulesStates[scenesManager.id] as ScenesManagerStateType;
                    const scene = Object.values(moduleState.scenes).find((scene) =>
                        inputsValues.sceneName === scene.name);
                    let res = false;
                    traverseNodeStructure((currentSceneNodeId) => {
                        const currentSceneNodeData = moduleState.nodes[currentSceneNodeId];
                        if (currentSceneNodeData && inputsValues.nodeName === currentSceneNodeData.name) {
                            if (currentSceneNodeData.nodeStatesIds.includes(nodeStateId)) {
                                res = true;
                            }
                        }
                    }, scene?.nodeStructure);
                    return res;
                },
                isClearable: true,
            },
        },
    });

    return {
        blocks: {
            scenesManagerSetup,
            setPopupScenes,
            setScenesBlock,
            setSceneStateBlock,
            setObjectStateBlock,
            setDropEvents,
        },
    };
}
