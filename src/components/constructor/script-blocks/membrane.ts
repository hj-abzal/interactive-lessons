/* eslint-disable max-len */
import {ScriptModule} from '@/components/constructor/script-blocks/types';
import {LevelManager} from '@/components/membrane/level-manager';
import {Condition, EnvType, IMembraneState, Level, LevelTableData} from '@/components/membrane/types';
import {defaultDragListenersReplicas, dragListenersCreators, dragModifiers, dragUpdaters
} from '@/components/membrane/utils';
import {scriptBlock} from '@/components/constructor/script-blocks/lib';
import {InputTypeType} from '../side-bar/script-block/widget/types';
import {AtomsArr} from '@/components/membrane/atom';
import uniqueId from 'lodash/uniqueId';
import {getImage} from '@/codgen/all-images';
import _ from 'lodash';
import {original} from 'immer';

const environments: Record<EnvType, string> = {
    inner: 'внутриклеточная среда',
    outer: 'внеклеточная среда',
};

const defaultLevel: LevelTableData = {
    id: '0',
    startConditions: {
        inner: {},
        outer: {},
    },
    endConditions: {
        inner: {},
        outer: {},
    },
    dragModifiers: [],
    dragListeners: [],
    dragUpdaters: [],
    dragListenersReplicas: defaultDragListenersReplicas,
};

export const membraneScriptModule: ScriptModule = {
    id: 'membrane',
    name: 'Мембрана',
    icon: 'ComponentsProvider',
    color: '#10B0B4',
    initialState: {
        show: false,
        highlight: {
            usiki: false,
            shariki: false,
            full: false,
        },
        conditions: {
            inner: {},
            outer: {},
        },
        onConditionsChange: () => undefined,
        conditionsKey: uniqueId(),
        endConditions: {
            inner: {},
            outer: {},
        },
        currentLevel: createLevel(defaultLevel),
        images: {},
    } as Partial<IMembraneState>,
    Component: LevelManager,
    hook: useMembraneScripts,
};

function createLevel(levelTableData:LevelTableData, onMistake?: () => void, wrongElements?: string[]): Level {
    const dragListenersData = levelTableData.dragListeners.map((id) => {
        const createDragListener = dragListenersCreators[id];
        if (typeof createDragListener === 'function') {
            return createDragListener(
                levelTableData.dragListenersReplicas || defaultDragListenersReplicas,
                onMistake || (() => false),
                wrongElements || []
            );
        } else {
            return null;
        }
    }).filter(Boolean);

    const dragModifiersData = levelTableData.dragModifiers.map((id) => dragModifiers[id]);
    const dragUpdatersData = levelTableData.dragUpdaters.map((id) => dragUpdaters[id]);

    let membraneCanalsData = levelTableData.membraneCanal // @ts-ignore levelTableData.membraneCanalsQty may be a string
        ? new Array(parseInt(levelTableData.membraneCanalsQty, 10) || 0).fill(levelTableData.membraneCanal)
        : [];

    if (levelTableData.multiCanals?.length) {
        membraneCanalsData = levelTableData.multiCanals;
    }

    return {
        ...levelTableData,
        membraneCanals: membraneCanalsData,
        dragListeners: dragListenersData,
        dragModifiers: dragModifiersData,
        dragUpdaters: dragUpdatersData,
        membraneCanalsState: {},
    };
}

function useMembraneScripts() {
    const showMembrane = scriptBlock({
        title: '[Membrane] Показать Мембрану',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft) => {
                draft.show = inputs.show;
            });
        },
        inputs: {
            show: {
                label: 'Показать мембрану',
                type: InputTypeType.toggle,
                defaultValue: false,
            },
        },
    });
    const highlightMembrane = scriptBlock({
        title: '[Membrane] Подсветка мембраны',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft) => {
                draft.highlight.usiki = inputs.usiki;
                draft.highlight.shariki = inputs.shariki;
                draft.highlight.full = inputs.full;
            });
        },
        inputs: {
            usiki: {
                label: 'Подсветить усики',
                type: InputTypeType.toggle,
                defaultValue: false,
            },
            shariki: {
                label: 'Подсветить шарики',
                type: InputTypeType.toggle,
                defaultValue: false,
            },
            full: {
                label: 'Подсветить мембрану',
                type: InputTypeType.toggle,
                defaultValue: false,
            },
        },
    });

    const setLevelsData = scriptBlock({
        title: '[Membrane] Установить уровни',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft) => {
                draft.levels = inputs.levels;
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            levels: {
                label: 'Данные уровней',
                type: InputTypeType.table,
                inputs: {
                    id: {
                        label: 'id',
                        type: InputTypeType.textarea,
                    },
                    membraneCanal: {
                        label: 'membraneCanal',
                        type: InputTypeType.key,
                        searchable: [
                            'aquaporin',
                            'protein-canal',
                            'protein-carrier',
                            'pump',
                            'protein-symporter',
                            'sinaps-na-canal',
                            'sinaps-k-canal'
                        ],
                        isClearable: true,
                    },
                    membraneCanalsQty: {
                        label: 'membraneCanalsQty',
                        type: InputTypeType.number,
                        defaultValue: 0,
                    },
                    multiCanals: {
                        label: 'multiCanals',
                        type: InputTypeType.multiKey,
                        searchable: [
                            'aquaporin',
                            'protein-canal',
                            'protein-carrier',
                            'pump',
                            'protein-symporter',
                            'sinaps-na-canal',
                            'sinaps-k-canal'
                        ],
                        isClearable: true,
                    },
                    nextStageId: {
                        label: 'nextStageId',
                        type: InputTypeType.stage,
                    },
                    mistakeStageId: {
                        label: 'mistakeStageId',
                        type: InputTypeType.stage,
                    },
                    dragModifiers: {
                        label: 'dragModifiers',
                        type: InputTypeType.multiKey,
                        searchable: Object.keys(dragModifiers),
                    },
                    dragListeners: {
                        label: 'dragListeners',
                        type: InputTypeType.multiKey,
                        searchable: Object.keys(dragListenersCreators),
                    },
                    dragUpdaters: {
                        label: 'dragUpdaters',
                        type: InputTypeType.multiKey,
                        searchable: Object.keys(dragUpdaters),
                    },
                    dragListenersReplicas: {
                        label: 'dragListenersReplicas',
                        type: InputTypeType.data,
                        defaultValue: defaultDragListenersReplicas,
                    },
                },
            },
        },
    });

    const setLevel = scriptBlock({
        title: '[Membrane] Установить уровень',
        func: (inputs, {moduleState, produceModuleState, runStage}) => {
            if (inputs.level) {
                produceModuleState((draft) => {
                    const level = original(_.find(draft.levels, {id: inputs.level}));

                    draft.currentLevel = createLevel(
                        level,
                        () => runStage(level.mistakeStageId),
                        moduleState.wrongElements
                    );
                });
            }
        },
        isRunOnChangeInput: true,
        inputs: {
            level: {
                label: 'Номер уровня',
                type: InputTypeType.key,
                searchable: `scriptModulesStates.${membraneScriptModule.id}.levels`,
            },
        },
    });

    const setCanalState = scriptBlock({
        title: '[Membrane] Установить состояние канала',
        func: (inputs, {produceModuleState}) => {
            if (inputs.canalType) {
                produceModuleState((draft) => {
                    draft.currentLevel.membraneCanalsState[inputs.canalType] = {
                        isOpen: inputs.isOpen,
                    };
                });
            }
        },
        isRunOnChangeInput: true,
        inputs: {
            canalType: {
                label: 'Тип канала',
                type: InputTypeType.key,
                searchable: `scriptModulesStates.${membraneScriptModule.id}.currentLevel.membraneCanals`,
            },
            isOpen: {
                label: 'Открыт',
                type: InputTypeType.toggle,
            },
        },
    });

    const startConditions = scriptBlock({
        title: '[Membrane] Установить начальные условия',
        func: (inputs, {produceModuleState, produceGlobalState, moduleState}) => {
            const conditions: Record<EnvType, Condition> = JSON.parse(JSON.stringify(moduleState.conditions));
            const environment = Object.keys(environments).find((key) => environments[key] === inputs.enviroment);
            conditions[environment!][inputs.element] = parseInt(inputs.count as unknown as string, 10);

            produceModuleState((draft) => {
                draft.conditions = conditions;
                draft.conditionsKey = uniqueId();
                draft.onConditionChange = (conditions: Record<EnvType, Condition>) => {
                    produceModuleState((moduleDraft) => {
                        moduleDraft.conditions = conditions;
                    });

                    produceGlobalState((globalDraft) => {
                        const scales = globalDraft.scriptModulesStates.progressBars.scales;

                        if (scales && scales[0] && scales[1]) {
                            const outer = Object.values(_.pickBy(
                                conditions.outer,
                                (qty, elName) => !moduleState.wrongElements.includes(elName)
                            )).reduce((acc, count) => acc + count, 0);

                            const inner = Object.values(_.pickBy(
                                conditions.inner,
                                (qty, elName) => !moduleState.wrongElements.includes(elName)
                            )).reduce((acc, count) => acc + count, 0);

                            const total = inner + outer;

                            scales[0].value = outer / total * 100;

                            scales[1].value = inner / total * 100;
                        }
                    });
                };
            });

            const outer = Object.values(_.pickBy(
                conditions.outer,
                (qty, elName) => !moduleState.wrongElements.includes(elName)
            )).reduce((acc, count) => acc + count, 0);

            const inner = Object.values(_.pickBy(
                conditions.inner,
                (qty, elName) => !moduleState.wrongElements.includes(elName)
            )).reduce((acc, count) => acc + count, 0);
            const total = inner + outer;

            produceGlobalState((globalDraft) => {
                const scales = globalDraft.scriptModulesStates.progressBars.scales;

                if (scales && scales[0] && scales[1]) {
                    scales[0].value = outer / total * 100;

                    scales[1].value = inner / total * 100;
                }
            });
        },
        inputs: {
            enviroment: {
                label: 'среда',
                type: InputTypeType.select,
                defaultValue: Object.values(environments)[0],
                options: Object.values(environments),
            },
            element: {
                label: 'Введите название элемента',
                type: InputTypeType.select,
                defaultValue: 'oxygen',
                options: AtomsArr,
            },
            count: {
                label: 'Количество атомов',
                type: InputTypeType.number,
                defaultValue: 10,
            },
        },
    });

    const setWrongElements = scriptBlock({
        title: '[Membrane] Установить неправильные элементы',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft) => {
                draft.wrongElements = inputs.elements;
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            elements: {
                label: 'Названия элементов',
                type: InputTypeType.multiKey,
                searchable: AtomsArr,
            },
        },
    });

    const clearConditions = scriptBlock({
        title: '[Membrane] Очистить начальные и конечные условия',
        func: (_, {produceModuleState}) => {
            produceModuleState((draft) => {
                draft.conditions = {
                    inner: {},
                    outer: {},
                };
                draft.conditionsKey = uniqueId();
                draft.wrongElements = [];

                draft.endConditions = {
                    inner: {},
                    outer: {},
                };
            });
        },
        inputs: {},
    });

    const endConditions = scriptBlock({
        title: '[Membrane] Установить конечные условия',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft) => {
                const environment = Object.keys(environments).find((key) => environments[key] === inputs.enviroment);
                draft.endConditions[environment!][inputs.element] = parseInt(inputs.count as unknown as string, 10);
            });
        },
        inputs: {
            enviroment: {
                label: 'среда',
                type: InputTypeType.select,
                defaultValue: Object.values(environments)[0],
                options: Object.values(environments),
            },
            element: {
                label: 'Введите название элемента',
                type: InputTypeType.select,
                defaultValue: 'oxygen',
                options: AtomsArr,
            },
            count: {
                label: 'Количество',
                type: InputTypeType.number,
                defaultValue: 10,
            },
        },
    });

    const setImages = scriptBlock({
        title: '[Membrane] Установить изображения',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft) => {
                draft.images = inputs.images.reduce((images, {key, image}) => ({
                    ...images,
                    [key]: getImage(image),
                }), {});
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            images: {
                label: 'Таблица изображений',
                type: InputTypeType.table,
                inputs: {
                    key: {
                        label: 'Ключ',
                        type: InputTypeType.textarea,
                    },
                    image: {
                        label: 'Изображение',
                        type: InputTypeType.image,
                    },
                },
                defaultValue: [{
                    key: 'water',
                    image: 'khimicheskieElementi.molekuli.h2O',
                }, {
                    key: 'oxygen',
                    image: 'khimicheskieElementi.molekuli.o2',
                }, {
                    key: 'sodium',
                    image: 'khimicheskieElementi.molekuli.na',
                }, {
                    key: 'glucose',
                    image: 'khimicheskieElementi.molekuli.glyukoza',
                }, {
                    key: 'potassium',
                    image: 'khimicheskieElementi.molekuli.k',
                }, {
                    key: 'bacterium',
                    image: 'svoistvaMembrani.kletochniiPuzir.bakteriya',
                }, {
                    key: 'undigested',
                    image: 'svoistvaMembrani.kletochniiPuzir.rastvorimiiAntigen',
                }, {
                    key: 'bubble',
                    image: 'svoistvaMembrani.kletochniiPuzir.membrana',
                }, {
                    key: 'aquaporin',
                    image: 'svoistvaMembrani.akvaporin',
                }, {
                    key: 'protein-carrier',
                    image: 'svoistvaMembrani.belokperenoschik',
                }, {
                    key: 'protein-canal-open',
                    image: 'svoistvaMembrani.belokkanal.otkritii',
                }, {
                    key: 'protein-canal-close',
                    image: 'svoistvaMembrani.belokkanal.zakritii',
                }, {
                    key: 'pump-1',
                    image: 'svoistvaMembrani.natriikalieviiNasos.naruzhuBezAtf',
                }, {
                    key: 'pump-2',
                    image: 'svoistvaMembrani.natriikalieviiNasos.naruzhuSAtf',
                }, {
                    key: 'pump-3',
                    image: 'svoistvaMembrani.natriikalieviiNasos.vnutrSAtf',
                }, {
                    key: 'pump-4',
                    image: 'svoistvaMembrani.natriikalieviiNasos.vnutrBezAtf',
                }, {
                    key: 'symporter',
                    image: 'svoistvaMembrani.beloksimporter.vnutr',
                }, {
                    key: 'membrane',
                    image: 'svoistvaMembrani.membrana.vsyaMembrana',
                }, {
                    key: 'usiki',
                    image: 'svoistvaMembrani.membrana.podsvetkaUsikov',
                }, {
                    key: 'shariki',
                    image: 'svoistvaMembrani.membrana.podsvetkaSharikov',
                }],
            },
        },
    });

    return {
        blocks: {
            showMembrane,
            highlightMembrane,
            setLevelsData,
            setLevel,
            startConditions,
            endConditions,
            clearConditions,
            setImages,
            setWrongElements,
            setCanalState,
        },
    };
}
