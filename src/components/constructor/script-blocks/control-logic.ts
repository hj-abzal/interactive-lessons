import {ScriptBlockFuncContext, ScriptModule} from '@/components/constructor/script-blocks/types';
import {scriptBlock} from '@/components/constructor/script-blocks/lib';
import {getRandomItems} from '@/utils/get-random-items';
import {compareVars, mathIt, OperatorEnum} from './script-blocks-utils';
import {InputTypeType} from '@/components/constructor/side-bar/script-block/widget/types';
import _ from 'lodash';
import {RunStageParams} from '@/components/constructor/side-bar/script-block/widget';
import {extractStageParams} from '@/components/constructor/side-bar/script-block/widget/utils';

export type StageParam = {
    value?: any,
    simpleType?: InputTypeType,
    name: string,
    tableIdRef?: string,
    inputSettings?: any,
    defaultValue?: any,
}

export type FullBoundStageParamData = StageParam & {
    tableItemPath?: string,
}

export type ControlLogicState = {
    randomStages: string[];
    randomStageIndex: number;
    continuousStages: string[];
    continuousStageIndex: number;
    counters: Record<string, number>;
    stagesParams: {
        [stageId: string]: {
            isSettled: boolean,
            params: {
                [name: string]: StageParam,
            }
        }
    },
    tables: {
        [tableName: string]: {
            items: any[],
            columns: any[],
        }
    },
    tableLoops: {
        [loopName: string]: {
            tableId: string,
            maxStepsCount?: number,
            isUnique?: boolean,
            isRandom?: boolean,
            currentIndex: number,
            stepsIndexes: number[],
            runStage?: RunStageParams,
            afterRunStage?: RunStageParams,
        }
    }
}

export const availableParamTypes = [
    InputTypeType.textarea,
    InputTypeType.number,
    InputTypeType.coords,
    InputTypeType.image,
    InputTypeType.toggle,
    InputTypeType.select,
    InputTypeType.key,
    InputTypeType.empty
];

export enum HistoryConditionCheck {
    anyOf = 'Один пройден',
    eachOf = 'Все пройдены',
}

const loopItemPresetParam = {
    label: '{{элемент шага}}',
    value: '{{step-item}}',
};

export const SETUP_STAGE_PARAMS_SCRIPT_BLOCK_ID = 'setStageParams';

export const controlLogicScriptModule: ScriptModule<ControlLogicState> = {
    id: 'controlLogic',
    name: 'Логика управления',
    icon: 'LogicProvider',
    color: '#666666',
    hook: useControlLogicScripts,
    initialState: {
        randomStages: [],
        randomStageIndex: 0,
        continuousStages: [],
        continuousStageIndex: 0,
        counters: {},
        stagesParams: {},
        tables: {},
        tableLoops: {},
    },
};

function useControlLogicScripts() {
    const runStageBlock = scriptBlock({
        title: 'Запустить сценарий',
        func: (inputs, {runStage}) => {
            runStage(inputs.stageToRun);
        },
        inputs: {
            stageToRun: {
                label: 'Запустить сценарий',
                type: InputTypeType.stage,
                isRequired: true,
            },
        },
    });

    const setRandomStagesBlock = scriptBlock({
        title: 'Установить рандомные сценарии',
        func: (inputs, {produceModuleState}) => produceModuleState((draft) => {
            draft.randomStages = getRandomItems(inputs.stagesToSet, inputs.count);
            draft.randomStageIndex = 0;
        }),
        inputs: {
            stagesToSet: {
                label: 'Выбрать из сценариев',
                type: InputTypeType.stages,
                isRequired: true,
            },
            count: {
                label: 'Количество',
                type: InputTypeType.number,
                isRequired: true,
            },
        },
    });

    const runRandomStageBlock = scriptBlock({
        title: 'Запустить рандомный сценарий',
        func: (inputs, {runStage, moduleState, produceModuleState}) => {
            const stageToRun = moduleState.randomStages[moduleState.randomStageIndex];
            if (stageToRun) {
                runStage(moduleState.randomStages[moduleState.randomStageIndex]);
                produceModuleState((draft) => {
                    draft.randomStageIndex = moduleState.randomStageIndex + 1;
                });
            } else {
                runStage(inputs.stageToRunFallback);
            }
        },
        inputs: {
            stageToRunFallback: {
                label: 'Если все пройдены, то запустить сценарий',
                type: InputTypeType.stage,
                isRequired: true,
            },
        },
    });

    const setContinuousStagesBlock = scriptBlock({
        title: 'Установить последовательные сценарии',
        func: (inputs, {produceModuleState}) => produceModuleState((draft) => {
            draft.continuousStages = inputs.stagesToSet;
            draft.continuousStageIndex = 0;
        }),
        inputs: {
            stagesToSet: {
                label: 'Список сценариев',
                type: InputTypeType.stages,
                isRequired: true,
            },
        },
    });

    const runContinuousStageBlock = scriptBlock({
        title: 'Запустить последовательный сценарий',
        func: (inputs, {runStage, moduleState, produceModuleState}) => {
            const stageToRun = moduleState.continuousStages[moduleState.continuousStageIndex];
            if (stageToRun) {
                runStage(moduleState.continuousStages[moduleState.continuousStageIndex]);
                produceModuleState((draft) => {
                    draft.continuousStageIndex = moduleState.continuousStageIndex + 1;
                });
            } else {
                runStage(inputs.stageToRunFallback);
            }
        },
        inputs: {
            stageToRunFallback: {
                label: 'Если все пройдены, то запустить сценарий',
                type: InputTypeType.stage,
                isRequired: true,
            },
        },
    });

    const runStageIfInHistoryBlock = scriptBlock({
        title: 'Проверить на прохождение и запустить',
        func: (inputs, {runStage, globalState}) => {
            const stagesHistory = globalState.queueStats.stagesHistory;
            let condition = false;
            switch (inputs.checkType) {
                case HistoryConditionCheck.anyOf:
                    condition = inputs.stageToCheck.some((stage) =>
                        stagesHistory.includes(stage)
                    );
                    break;

                case HistoryConditionCheck.eachOf:
                    condition = inputs.stageToCheck.every((stageId) =>
                        stagesHistory.includes(stageId)
                    );
                    break;
            }
            if (condition) {
                runStage(inputs.stageToRunIfInHistory);
            } else {
                runStage(inputs.stageToRunIfNotInHistory);
            }
        },
        inputs: {
            stageToCheck: {
                label: 'Проверить пройден(ы) ли сценарий(ии)',
                type: InputTypeType.stages,
                isRequired: true,
            },
            checkType: {
                label: 'Как проверять',
                type: InputTypeType.select,
                options: Object.values(HistoryConditionCheck),
                isUnderlined: true,
            },
            stageToRunIfInHistory: {
                label: 'Если пройден, то запустить сценарий',
                type: InputTypeType.stage,
            },
            stageToRunIfNotInHistory: {
                label: 'Если не пройден, то запустить сценарий',
                type: InputTypeType.stage,
            },
        },
    });

    const cleanStagesHistoryBlock = scriptBlock({
        title: 'Очистить историю пройденных сценариев',
        func: (inputs, {produceGlobalState}) => {
            produceGlobalState((draft) => {
                draft.queueStats.stagesHistory = [];
            });
        },
        inputs: {},
    });

    const setCounterBlock = scriptBlock({
        title: 'Установить/изменить счетчик',
        func: (inputs, {produceModuleState}) => produceModuleState((draft) => {
            if (draft.counters[inputs.id]) {
                draft.counters[inputs.id] = mathIt(draft.counters[inputs.id], inputs.value);
            } else {
                draft.counters[inputs.id] = mathIt(0, inputs.value);
            }
        }),
        isRunOnChangeInput: true,
        inputs: {
            id: {
                label: 'Идентификатор счетчика',
                type: InputTypeType.key,
                searchable: `scriptModulesStates.${controlLogicScriptModule.id}.counters`,
                isCreatable: true,
                isUnderlined: true,
            },
            value: {
                label: 'Значение',
                type: InputTypeType.textarea,
                defaultValue: '1',
            },
        },
    });

    const setGenericTableData = scriptBlock({
        title: 'Создать таблицу',
        func: (inputs, {produceModuleState}: ScriptBlockFuncContext<ControlLogicState>) =>
            produceModuleState((draft) => {
                draft.tables[inputs.name] = draft.tables[inputs.name] || {};
                draft.tables[inputs.name].items = inputs.data.items;
                draft.tables[inputs.name].columns = inputs.data.columns;
            }),
        isRunOnChangeInput: true,
        isOnlyOnSetup: true,
        inputs: {
            name: {
                label: 'Имя',
                type: InputTypeType.textarea,
            },
            data: {
                label: 'Данные',
                type: InputTypeType.genericTable,
            },
        },
    });

    const selectScriptModules = scriptBlock({
        title: 'Убрать скрипт модули',
        func: (inputs, {produceGlobalState}: ScriptBlockFuncContext<ControlLogicState>) =>
            produceGlobalState((draft) => {
                if (!inputs?.modules?.length) {
                    return;
                }

                Object.keys(draft.availableScriptModules).forEach((name) => {
                    if (inputs.modules.includes(name)) {
                        delete draft.availableScriptModules[name];
                    }
                });

                draft.availableScriptModulesIds = draft.availableScriptModulesIds
                    .filter((name) => !inputs.modules.includes(name));
            }),
        isOnlyOnSetup: true,
        inputs: {
            modules: {
                label: 'Имя',
                type: InputTypeType.multiKey,
                searchable: 'availableScriptModules',
                valueName: 'id',
            },
        },
    });

    const ifCounterRunStageBlock = scriptBlock<ControlLogicState>({
        title: 'Запустить сценарий по счетчику',
        func: ({
            counterId,
            operator,
            counterValue,
            stageToExecuteIf,
            stageToExecuteElse,
            counterChangeIf,
            counterChangeElse,
        }, {
            runStage,
            moduleState,
            produceModuleState,
        }) => {
            const condition = compareVars(moduleState.counters[counterId], operator, counterValue);

            if (condition) {
                runStage(stageToExecuteIf);
                if (counterChangeIf) {
                    produceModuleState((draft) => {
                        draft.counters[counterId] = mathIt(draft.counters[counterId], counterChangeIf);
                    });
                }
            } else {
                runStage(stageToExecuteElse);
                if (counterChangeElse) {
                    produceModuleState((draft) => {
                        draft.counters[counterId] = mathIt(draft.counters[counterId], counterChangeElse);
                    });
                }
            }
        },
        inputs: {
            counterId: {
                label: 'Идентификатор счетчика',
                type: InputTypeType.key,
                searchable: `scriptModulesStates.${controlLogicScriptModule.id}.counters`,
            },
            operator: {
                label: 'Условие',
                type: InputTypeType.select,
                defaultValue: OperatorEnum.equal,
                options: Object.values(OperatorEnum),
                isRequired: true,
            },
            counterValue: {
                label: 'Значение счетчика',
                type: InputTypeType.number,
                defaultValue: 0,
                isUnderlined: true,
            },
            stageToExecuteIf: {
                label: 'То запустить сценарий',
                type: InputTypeType.stage,
                isRequired: true,
            },
            counterChangeIf: {
                label: 'И изменить счетчик после запуска на',
                type: InputTypeType.textarea,
                defaultValue: '+1',
                isUnderlined: true,
            },
            stageToExecuteElse: {
                label: 'Иначе запустить сценарий',
                type: InputTypeType.stage,
            },
            counterChangeElse: {
                label: 'И изменить счетчик после запуска на',
                type: InputTypeType.textarea,
            },
        },
    });

    const setStageParams = scriptBlock({
        title: 'Установить параметры сценария',
        func: (inputs, {produceModuleState, currentStageId}: ScriptBlockFuncContext<ControlLogicState>) => {
            produceModuleState((draft) => {
                // Установка параметров должна прогонятся только 1 раз
                if (!currentStageId) {
                    return;
                }

                if (!draft.stagesParams[currentStageId]?.params) {
                    draft.stagesParams[currentStageId] = {
                        isSettled: false,
                        params: {},
                    };
                }

                if (!Array.isArray(inputs.data)) {
                    return;
                }

                const paramsData = {};

                inputs.data?.forEach((paramData) => {
                    paramsData[paramData.name] = {
                        name: paramData.name,
                        simpleType: paramData.simpleType,
                        tableIdRef: paramData.tableIdRef,
                        defaultValue: paramData.defaultValue,
                        inputSettings: paramData.inputSettings,
                        inputPreset: paramData.inputPreset,
                    };
                });

                draft.stagesParams[currentStageId].params = paramsData;

                draft.stagesParams[currentStageId].isSettled = true;
            });
        },
        isBlocked: true,
        isHidden: true,
        inputs: {
            data: {
                label: 'Параметры',
                type: InputTypeType.table,
                inputs: {
                    name: {
                        label: 'Имя',
                        type: InputTypeType.textarea,
                    },
                    simpleType: {
                        label: 'Тип',
                        type: InputTypeType.select,
                        options: availableParamTypes,
                    },
                    tableIdRef: {
                        label: 'Взять из таблицы',
                        type: InputTypeType.key,
                        searchable: `scriptModulesStates.${controlLogicScriptModule.id}.tables`,
                    },
                    defaultValue: {
                        label: 'Значение по умолчанию',
                        type: InputTypeType.textarea,
                    },
                },
            },
        },
    });

    const createTableLoop = scriptBlock({
        title: 'Задать цикл по таблице',
        func: (inputs, {produceModuleState}: ScriptBlockFuncContext<ControlLogicState>) =>
            produceModuleState((draft) => {
                const table = draft.tables[inputs.tableId];

                if (!table) {
                    return;
                }

                const maxIndex = inputs.maxIterations ? inputs.maxIterations + 1 : undefined;

                const indexes = _.range(0, table.items.length);

                const stepsIndexes = !inputs.isRandom
                    ? indexes.slice(0, maxIndex || indexes.length)
                    : getRandomItems(
                        indexes,
                        inputs.maxIterations || indexes.length,
                        inputs.isUnique ? (items, item) => !items.includes(item) : undefined
                    );

                draft.tableLoops[inputs.name] = {
                    tableId: inputs.tableId,
                    isRandom: inputs.isRandom,
                    isUnique: inputs.isUnique,
                    maxStepsCount: inputs.maxIterations,
                    runStage: inputs.runStage,
                    afterRunStage: inputs.afterRunStage,
                    currentIndex: -1,
                    stepsIndexes,
                };
            }),
        isRunOnChangeInput: true,
        isOnlyOnSetup: true,
        inputs: {
            name: {
                label: 'Имя',
                type: InputTypeType.textarea,
            },
            tableId: {
                label: 'Таблица',
                type: InputTypeType.key,
                searchable: `scriptModulesStates.${controlLogicScriptModule.id}.tables`,
            },
            isRandom: {
                label: 'Рандомно',
                type: InputTypeType.toggle,
            },
            isUnique: {
                label: 'Уникально',
                type: InputTypeType.toggle,
            },
            maxIterations: {
                label: 'Макимальное количество',
                type: InputTypeType.number,
            },
            runStage: {
                label: 'Сценарий шага (в параметр указать {{элемент шага}})',
                type: InputTypeType.stage,
                paramsPresets: [loopItemPresetParam],
            },
            afterRunStage: {
                label: 'Сценарий после',
                type: InputTypeType.stage,
            },
        },
    });

    const runTableLoopStep = scriptBlock({
        title: 'Запустить шаг цикла по таблице',
        func: (inputs, {produceModuleState, runStage}: ScriptBlockFuncContext<ControlLogicState>) =>
            produceModuleState((draft) => {
                const loop = draft.tableLoops[inputs.loopName];

                if (!loop) {
                    throw new Error(`no such loop ${inputs.loopName}`);
                }

                const table = draft.tables[loop.tableId];

                if (!table) {
                    throw new Error(`no such loop ${loop.tableId}`);
                }

                const nextIndex = loop.currentIndex + 1;

                if (nextIndex === loop.stepsIndexes.length) {
                    if (loop.afterRunStage) {
                        runStage(loop.afterRunStage);
                    }

                    return;
                }

                loop.currentIndex = nextIndex;
                const itemIndex = loop.stepsIndexes[loop.currentIndex];

                if (loop.runStage) {
                    const stepItem = table.items[itemIndex];

                    const {stageId, params} = extractStageParams(loop.runStage);

                    const stepItemFields = Object.keys(params).filter((key) => {
                        return params[key] === loopItemPresetParam.value;
                    });

                    const modifiedParams = JSON.parse(JSON.stringify(params));

                    stepItemFields.forEach((key) => {
                        modifiedParams[key] = stepItem.id;
                    });

                    runStage({
                        stageId,
                        params: modifiedParams,
                    });
                }
            }),
        inputs: {
            loopName: {
                label: 'Имя цикла',
                type: InputTypeType.key,
                searchable: `scriptModulesStates.${controlLogicScriptModule.id}.tableLoops`,
            },
        },
    });

    return {
        blocks: {
            runStageBlock,
            setRandomStagesBlock,
            runRandomStageBlock,
            setContinuousStagesBlock,
            runContinuousStageBlock,
            setCounterBlock,
            ifCounterRunStageBlock,
            runStageIfInHistoryBlock,
            cleanStagesHistoryBlock,
            setStageParams,
            selectScriptModules,
            runTableLoopStep,
            createTableLoop,
            setGenericTableData,
        },
    };
}
