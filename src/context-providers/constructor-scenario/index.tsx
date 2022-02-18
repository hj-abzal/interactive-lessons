import {useCallback, useEffect, useRef} from 'react';
import {createContextProvider} from '@/utils/create-safe-context';
import {logDraft, useImmerState} from '@/utils/use-immer-state';
import {logger} from '@/utils/logger';
import _ from 'lodash';
import {
    ScriptBlockData,
    ScriptBlockFull,
    ScriptModuleConfig,
    ScriptTask
} from '@/components/constructor/script-blocks/types';
import {connectFullScript, produceScriptModuleState} from '@/components/constructor/script-blocks/lib';
import {ID} from '@/utils/generate-id';
import {queue} from '@/utils/queue';
import {debugUtils} from '@/utils/debug-utils';
import {useConfigureScenario} from '@/context-providers/constructor-scenario/use-configure-scenario';
import {useConstructorStorage} from '@/context-providers/constructor-storage';
import {StageNodeType} from '@/components/constructor/stages-flow-editor/node';
import {TabsEnum} from '@/components/constructor/side-bar/types';
import {
    controlLogicScriptModule,
    ControlLogicState, SETUP_STAGE_PARAMS_SCRIPT_BLOCK_ID,
    StageParam
} from '@/components/constructor/script-blocks/control-logic';
import {ScenesManagerStateType, STORABLE_SCENE_STATE} from '@/components/scenes-manager/types';
import {
    resolveScriptBlockValuesWithParams
} from '@/context-providers/constructor-scenario/utils';
import {useLocationSearchParams} from '@/utils/use-location-query';
import {useSceneEvents} from '@/context-providers/constructor-scenario/use-scene-events';
import {useSberclass} from '@/context-providers/sberclass';

export type ConstructorScenarioState = {
    availableScriptBlocks: {
        [scriptBlockName: string]: ScriptBlockFull;
    };
    availableScriptModules: {
        [scriptModuleId: string]: ScriptModuleConfig;
    };
    availableScriptModulesIds: string[];
    stages: {
        [key: string]: ScriptBlockData[];
    };
    flowEditorStages?: {
        nodes: StageNodeType[];
    };
    states: {
        [scriptModuleName: string]: {
            [key: string]: any;
        }
    };
    scriptModulesStates: {
        [key: string]: any;
    };
    currentStageScriptIndex?: number
    constructor: {
        isLaunched?: boolean;
        isSettled?: boolean;
        currentStage?: string;
        currentStageSelectedBlocksIds: string[];
        stagesHistory: string[];
        currentTab: TabsEnum;
        isFlowEditorMode?: boolean;
        modifierKeys: {
            altKey: boolean;
            ctrlKey: boolean;
            metaKey: boolean;
            shiftKey: boolean;
            tabKey: boolean;
        };
    };
    queueStats: {
        runningTaskId?: string;
        running: number;
        waiting: number;
        completed: number;
        stagesHistory: string[];
        runningStageId?: string;
    };
};

export enum Targets {
    stage = 'stage',
    scriptBlock = 'scriptBlock',
}
export enum Actions {
    update = 'update',
    bindStageParam = 'bindStageParam',
    delete = 'delete',
    rename = 'rename',
}

export type UpdateStagesArgs = {
} & ({
    target: Targets.stage;
    stageId: string;
} | {
    target: Targets.scriptBlock;
    stageId: string;
    scriptDataId: string;
}) & ({
    action: Actions.update;
    newValue: any;
} | {
    action: Actions.delete;
} | {
    action: Actions.rename;
    newName: string;
} | {
    action: Actions.bindStageParam;
    paramName: string,
    inputName: string,
    tableItemPath?: string,
})

export type ConstructorScenarioContextType = {
    state: ConstructorScenarioState;
    produceState: (func: (draft: ConstructorScenarioState) => void) => void;
    runStage: (stageId: string, stageParams?: any) => void;
    updateStages: (data: UpdateStagesArgs) => void;
    addQueueTask: (stageId: string, data: ScriptBlockData) => void,
    saveScenesData: () => void,
    scenesData: ScenesManagerStateType;
    saveStageParamsData: (stageId: string, params: StageParam[]) => void,
    currentStageParamsConfig?: {[key: string]: StageParam},
    setCurrentEditorStage: (stage: string) => void,
}

export const SETUP_SCENES_SCRIPT_BLOCK_ID = 'scenesManagerSetup';
export const SCENES_MANAGER_SCRIPT_MODULE_ID = 'scenesManager';

export const [
    ConstructorScenarioContext,
    ConstructorScenarioProvider,
    useConstructorScenario
] = createContextProvider<ConstructorScenarioContextType>(
    'ConstructorScenario',
    () => {
        const storage = useConstructorStorage();
        const sberclass = useSberclass();
        const [queryParams, setSearchParams] = useLocationSearchParams<{[s:string]: string}>();

        const [state, produceState] = useImmerState<ConstructorScenarioState>({
            stages: {},
            scriptModulesStates: {},
            availableScriptBlocks: {},
            availableScriptModules: {},
            availableScriptModulesIds: [],

            currentStageScriptIndex: undefined,

            states: {},

            constructor: {
                isLaunched: false,
                isSettled: false,
                isFlowEditorMode: false,
                currentStage: undefined,
                currentStageSelectedBlocksIds: [],
                currentTab: TabsEnum.stages,
                stagesHistory: [],
                modifierKeys: {
                    altKey: false,
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: false,
                    tabKey: false,
                },
            },

            queueStats: {
                runningTaskId: undefined,
                runningStageId: undefined,
                running: 0,
                waiting: 0,
                completed: 0,
                stagesHistory: [],
            },
        }, 'scenaro-context');

        const updateStages = useCallback((p: UpdateStagesArgs) =>
            produceState((draft) => {
                const stages = draft.stages;
                const stage = stages[p.stageId];
                switch (p.target) {
                    case Targets.stage:

                        break;

                    case Targets.scriptBlock: {
                        const scriptBlockIndex =
                            stage.findIndex((scriptBlock) => scriptBlock.dataId === p.scriptDataId);

                        const scriptBlock = stage[scriptBlockIndex];

                        switch (p.action) {
                            case Actions.update: {
                                logDraft('update before', stage[scriptBlockIndex]);
                                draft.stages[p.stageId][scriptBlockIndex] = {
                                    ...stage[scriptBlockIndex],
                                    dataId: stage[scriptBlockIndex].dataId,
                                    scriptBlockId: stage[scriptBlockIndex].scriptBlockId,
                                    inputValues: p.newValue,
                                };
                                break;
                            }

                            case Actions.delete: {
                                stage.splice(scriptBlockIndex, 1);
                                break;
                            }

                            case Actions.bindStageParam: {
                                scriptBlock.boundStageParams = scriptBlock.boundStageParams || {};

                                const oldParamsData = scriptBlock
                                    .boundStageParams[p.inputName] || {};

                                scriptBlock.boundStageParams[p.inputName] = p.paramName
                                    ? {
                                        ...oldParamsData,
                                        stageParamId: p.paramName,
                                        tableItemPath: p.tableItemPath,
                                    }
                                    : null;

                                break;
                            }

                            default:
                                break;
                        }
                        break;
                    }

                    default:
                        break;
                }
            }), [produceState]);

        const tasksQueue = useRef(queue<ScriptTask>());

        const runStage = (stage: string | {stageId: string, params?: any}) => {
            if (!stage) {
                return;
            }

            const stageId = typeof stage === 'string' ? stage : stage.stageId;
            const stageParams = typeof stage === 'string' ? undefined : stage.params;

            if (state.stages[stageId]) {
                const tasks: ScriptTask[] = state.stages[stageId].map((scriptData) => {
                    return {
                        stageId,
                        data: scriptData,
                        stageParams,
                        id: ID(),
                    };
                });

                if (tasks.length === 0) {
                    return;
                }

                logQueueState({
                    action: 'PUSH_TASKS',
                    tasks: tasks,
                    props: null,
                    stats: state.queueStats,
                });

                tasksQueue.current.pushMany(tasks);

                produceState((draft) => {
                    draft.queueStats.waiting += tasks.length;
                });
            } else {
                logger.error(`StageID: "${stageId}" not exist on stages`, state.stages);
            }
        };

        const saveScenesData = useCallback(() => {
            produceState((draft) => {
                const newScenesData = draft.scriptModulesStates?.[SCENES_MANAGER_SCRIPT_MODULE_ID];

                if (newScenesData) {
                    // CLEAR UNSTORABLE STATE FIELDS
                    delete newScenesData.isPopupShown;
                    delete newScenesData.currentPopupScenes;
                    delete newScenesData.currentPopupScenes;
                    delete newScenesData.dropEventsSettings;

                    const stateToSave = _.pick(newScenesData, STORABLE_SCENE_STATE);

                    const scriptBlockIndex = draft.stages.setup.findIndex((sb) =>
                        sb.scriptBlockId === SETUP_SCENES_SCRIPT_BLOCK_ID);
                    if (scriptBlockIndex > -1) {
                        draft.stages.setup[scriptBlockIndex].inputValues.scenesData = stateToSave;
                    } else {
                        draft.stages.setup.unshift({
                            boundStageParams: {},
                            scriptBlockId: SETUP_SCENES_SCRIPT_BLOCK_ID,
                            dataId: ID(),
                            inputValues: {
                                scenesData: stateToSave,
                            },
                        });
                    }
                }
            });
        }, [produceState]);

        const addQueueTask = useCallback((stageId: string, data: ScriptBlockData) => {
            const task = {
                id: ID(),
                data: {...data},
                stageId,
            };

            logQueueState({
                action: 'PUSH_DATA',
                tasks: [task],
                props: null,
                stats: state.queueStats,
            });

            tasksQueue.current.push({...task});

            produceState((draft) => {
                draft.queueStats.waiting += 1;
            });
        }, [produceState, tasksQueue.current]);

        const saveStageParamsData = (stageId: string, stageParams: StageParam[]) => {
            if (!stageId) {
                return;
            }

            let scriptBlock;

            produceState((draft) => {
                const scriptBlockIndex = draft.stages[stageId].findIndex((sb) =>
                    sb.scriptBlockId === SETUP_STAGE_PARAMS_SCRIPT_BLOCK_ID);

                if (scriptBlockIndex > -1) {
                    if (!draft.stages[stageId][scriptBlockIndex].inputValues.data) {
                        draft.stages[stageId][scriptBlockIndex].inputValues = {
                            data: {},
                        };
                    }

                    draft.stages[stageId][scriptBlockIndex].inputValues.data = stageParams;
                    scriptBlock = JSON.parse(JSON.stringify(draft.stages[stageId][scriptBlockIndex]));
                } else {
                    scriptBlock = {
                        boundStageParams: {},
                        scriptBlockId: SETUP_STAGE_PARAMS_SCRIPT_BLOCK_ID,
                        dataId: ID(),
                        inputValues: {
                            data: stageParams,
                        },
                    };

                    draft.stages[stageId].unshift(scriptBlock);
                }
            });

            addQueueTask(stageId, scriptBlock);
        };

        const scenesData = state?.stages?.setup?.find((sb) =>
            sb.scriptBlockId === SETUP_SCENES_SCRIPT_BLOCK_ID)?.inputValues.scenesData;

        useEffect(function syncStorageByStages() {
            if (!storage.currentRevision) {
                return;
            }

            storage.updateRevision({
                id: storage.currentRevision.id,
                schema: state.stages,
            });
        }, [state.stages]);

        useEffect(function syncStagesByStorage() {
            produceState((draft) => {
                if (!storage.currentRevision?.schema) {
                    return;
                }

                draft.stages = storage.currentRevision.schema;
                draft.constructor.isLaunched = false;
                draft.constructor.isSettled = false;
                draft.queueStats.stagesHistory = [];
            });
        }, [storage.currentRevision?.id]);

        useConfigureScenario(state, produceState, runStage, addQueueTask);
        useSceneEvents(state, produceState, runStage, addQueueTask);

        const constrolLogicState: ControlLogicState = state.scriptModulesStates[controlLogicScriptModule.id];

        const tables = constrolLogicState?.tables;
        const stagesParams = constrolLogicState?.stagesParams;
        const currentStageParamsConfig = state.constructor.currentStage
            ? stagesParams[state.constructor.currentStage]?.params
            : undefined;

        useEffect(function processTasksQueue() {
            if (
                state.queueStats.waiting === 0
                || state.queueStats.running > 0
            ) {
                return;
            }

            const scriptTask = tasksQueue.current.pop();

            produceState((draft) => {
                draft.queueStats.waiting -= 1;
                draft.queueStats.running += 1;
                draft.queueStats.runningTaskId = scriptTask.id;

                if (draft.queueStats.runningStageId !== scriptTask.stageId) {
                    draft.queueStats.stagesHistory.push(scriptTask.stageId);
                }

                draft.queueStats.runningStageId = scriptTask.stageId;

                draft.currentStageScriptIndex = state.stages[draft.queueStats.runningStageId!]
                    ?.findIndex((s) => {
                        return s.dataId === scriptTask.data.dataId;
                    });
            });

            const runScript = async () => {
                const fullScript = connectFullScript(scriptTask.data, state.availableScriptBlocks);

                const inputValues = resolveScriptBlockValuesWithParams({
                    fullScript,
                    stagesParams,
                    tables,
                    scriptTask,
                });

                const props = {
                    moduleState: state.scriptModulesStates[fullScript.moduleId],
                    produceModuleState: (draftCB) =>
                        produceScriptModuleState(produceState, draftCB, fullScript.moduleId),
                    globalState: state,
                    produceGlobalState: produceState,
                    runStage: runStage,
                    currentStageId: scriptTask.stageId,
                    sberclass,
                };

                logQueueState({
                    action: 'RUN_TASK',
                    tasks: [scriptTask],
                    props: {
                        inputs: inputValues,
                        props,
                    },
                    stats: state.queueStats,
                });

                try {
                    await fullScript.func(inputValues, props);
                } catch (e) {
                    logger.error(e);
                }

                produceState((draft) => {
                    draft.queueStats.completed += 1;
                    draft.queueStats.running -= 1;
                    draft.queueStats.runningTaskId = undefined;

                    if (draft.queueStats.waiting === 0 && draft.queueStats.running === 0) {
                        tasksQueue.current.flush();

                        logQueueState({action: 'FLUSH'});

                        draft.queueStats.runningStageId = undefined;
                        draft.currentStageScriptIndex = undefined;
                        draft.queueStats.runningStageId = undefined;
                    }
                });
            };

            runScript();
        }, [state.currentStageScriptIndex, state.queueStats]);

        // TODO: remove this logic from this component
        const setCurrentEditorStage = (stage) => produceState((draft) => {
            draft.constructor.currentStage = stage;
            const locationCurrentStage = queryParams.get('stage');
            if (locationCurrentStage !== stage) {
                setSearchParams({stage: stage});
            }
        });

        return {
            state,
            produceState,
            updateStages,
            runStage,
            addQueueTask,
            scenesData,
            saveScenesData,
            saveStageParamsData,
            currentStageParamsConfig,
            setCurrentEditorStage,
        };
    }
);

function logQueueState({
    action,
    tasks,
    props,
    stats,
}: any) {
    if (!debugUtils.isDebugLogsEnabled()) {
        return;
    }

    // eslint-disable-next-line no-console
    console.groupCollapsed(`QUEUE_STATE ${action}`);
    logger.info('tasks', tasks);
    logger.info('props', props);
    logger.info('stats', stats);
    // eslint-disable-next-line no-console
    console.groupEnd();
}
