import {IconProps} from '@/components/icon';
import glyphs from '@/components/icon/glyphs';
import LayeredObjectConstructor from '@/components/layered-object-constructor';
import {
    initEmptyState,
    LayeredObjectConstructorStateType,
    SuccessConditionCheck,
    SuccessConditionModes
} from '@/components/layered-object-constructor/state';
import {merge, shuffle, uniqBy} from 'lodash';
import {ScriptModule} from '@/components/constructor/script-blocks/types';
import {scriptBlock} from '@/components/constructor/script-blocks/lib';
import {checkIsNoCoords} from '../side-bar/script-block/widget/coords-input';
import {ValidationModes} from '@/context-providers/drag-n-drop-constructor';
import {InputTypeType} from '@/components/constructor/side-bar/script-block/widget/types';

export const layeredObjectConstructor: ScriptModule = {
    id: 'layeredObjectConstructor',
    name: 'Конструктор объекта',
    icon: 'DNDConstructorProvider',
    color: '#9252FA',
    Component: LayeredObjectConstructor,
    initialState: initEmptyState,
    hook: useLayeredObjectConstructorScripts,
};

function useLayeredObjectConstructorScripts() {
    const setBackgroundPlateIsHiddenBlock = scriptBlock({
        title: 'Показать/скрыть фоновую пластину',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft) => {
                draft.isPlateShown = inputs.isShown;
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            isShown: {
                label: 'Показать?',
                type: InputTypeType.toggle,
                defaultValue: true,
            },
        },
    });

    const setDraggableItemsBlock = scriptBlock({
        title: 'Установить список компонентов / слоев',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft: LayeredObjectConstructorStateType) => {
                draft.sourceItems = inputs.newItems;
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            newItems: {
                label: 'Список компонентов',
                type: InputTypeType.table,
                inputs: {
                    id: {
                        label: 'Название компонента (id)',
                        type: InputTypeType.textarea,
                        defaultValue: 'Название',
                    },
                    objectId: {
                        label: 'Выбор id существующего объекта',
                        type: InputTypeType.key,
                        valueName: 'id',
                        searchable: `scriptModulesStates.${layeredObjectConstructor.id}.objects`,
                    },
                    name: {
                        label: 'Название компонента на полке',
                        type: InputTypeType.textarea,
                    },
                    isProperty: {
                        label: 'Является "Свойством"?',
                        type: InputTypeType.toggle,
                    },
                    propertyLabel: {
                        label: 'Текст на свойстве',
                        type: InputTypeType.textarea,
                    },
                    src: {
                        label: 'Изображение компонента',
                        type: InputTypeType.image,
                    },
                    droppedLayerSrc: {
                        label: 'Изображение компонента в объекте',
                        type: InputTypeType.image,
                    },
                },
            },
        },
    });

    const setLayeredObjectsBlock = scriptBlock({
        title: 'Установить список собираемых объектов',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft: LayeredObjectConstructorStateType) => {
                if (Array.isArray(inputs.newObjectsIds)) {
                    const newIds = inputs.newObjectsIds.map((objId) => ({
                        id: objId,
                        layers: [],
                        anchors: [],
                    }));
                    draft.objects = uniqBy(draft.objects.concat(newIds), 'id');
                }
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            newObjectsIds: {
                label: 'Список объектов',
                type: InputTypeType.multiKey,
                valueName: 'id',
                searchable: `scriptModulesStates.${layeredObjectConstructor.id}.objects`,
                isCreatable: true,
            },
        },
    });

    const setCurrentLayeredObjectIdBlock = scriptBlock({
        title: 'Активировать объект',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft: LayeredObjectConstructorStateType) => {
                draft.currentObject = draft.objects.find((object) => object.id === inputs.currentLayeredObjectId);
                const currentObject = draft.currentObject;
                //draft.objects.find((object) => object.id === inputs.currentLayeredObjectId);
                if (currentObject) {
                    currentObject.layers = draft.sourceItems
                        .filter((sourceItem) => sourceItem.objectId === currentObject.id)
                        .map((sourceItem) => ({
                            id: sourceItem.id,
                            src: sourceItem.droppedLayerSrc,
                            isShown: false,
                        }));
                }
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            currentLayeredObjectId: {
                label: 'Название объекта (id)',
                type: InputTypeType.key,
                valueName: 'id',
                searchable: `scriptModulesStates.${layeredObjectConstructor.id}.objects`,
            },
        },
    });

    const setTransformToCurrentObjectBlock = scriptBlock({
        title: 'Трансформировать текущий объект',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft: LayeredObjectConstructorStateType) => {
                if (draft.currentObject) {
                    draft.currentObject.transform = inputs.transform;
                    draft.currentObject.transition = inputs.transition;
                }
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            transform: {
                label: 'Строка трансформации',
                type: InputTypeType.textarea,
                defaultValue: 'translate(0%, 0%) scale(1, 1) rotate(0deg)',
            },
            transition: {
                label: 'Строка анимации перехода',
                type: InputTypeType.textarea,
                placeholder: '0.5s ease',
            },
        },
    });

    const setCurrentDraggableItemsBlock = scriptBlock({
        title: 'Активировать список компонентов для сборки',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft: LayeredObjectConstructorStateType) => {
                draft.droppedItems = [];
                // draft.isValid = false; // TODO: почему эта строка вызывает лютейшую дичь?
                const itemsToSet = draft.sourceItems
                    .filter((item) => (inputs.currentItems || [])
                        .some((id) => id === item.id));
                draft.currentItems = inputs.isShuffled ? shuffle(itemsToSet) : itemsToSet;
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            currentItems: {
                label: 'Список компонентов (id\'s)',
                type: InputTypeType.multiKey,
                valueName: 'id',
                searchable: `scriptModulesStates.${layeredObjectConstructor.id}.sourceItems`,
            },
            isShuffled: {
                label: 'Перемешать?',
                type: InputTypeType.toggle,
                defaultValue: false,
            },
        },
    });

    const setDisabledDraggableBlock = scriptBlock({
        title: 'Сделать активным/неактивным панель перетаскиваемых элементов',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft: LayeredObjectConstructorStateType) => {
                draft.isDragDisabled = !inputs.isActive;
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            isActive: {
                label: 'Активно?',
                type: InputTypeType.toggle,
                defaultValue: true,
            },
        },
    });

    const setOnDropProgressBarActionBlock = scriptBlock({
        title: 'Действие со шкалой при переносе компонента',
        func: ({label, valueIncrementOnDrop}, {produceModuleState, produceGlobalState}) => {
            produceModuleState((draft: LayeredObjectConstructorStateType) => {
                draft.currentSuccessCondition.onDropCorrect =
                        (droppedItem) => produceGlobalState((draft) => {
                            const scales = draft.scriptModulesStates.progressBars.scales;
                            if (scales && droppedItem.isCorrect) {
                                let isHere = false;
                                scales.forEach((scale, index) => {
                                    if (scale.label === label) {
                                        isHere = true;
                                        scales[index] =
                                            {...scale, value: (Number(scale.value)) + Number(valueIncrementOnDrop)};
                                    }
                                });

                                if (!isHere) {
                                    scales.push({
                                        label,
                                        valueIncrementOnDrop,
                                    });
                                }
                            }
                        });
            });
        },
        inputs: {
            label: {
                label: 'Название шкалы',
                type: InputTypeType.key,
                valueName: 'label',
                isCreatable: true,
                searchable: 'scriptModulesStates.progressBars.scales',
            },
            valueIncrementOnDrop: {
                label: 'Увеличивать на %', // TODO: slider-input
                type: InputTypeType.number,
                defaultValue: 100,
            },
        },
    });

    const setLayeredItemConstructorSuccessConditionsBlock = scriptBlock({
        title: 'Установить условия успеха и ошибки',
        func: (inputs, {produceModuleState, runStage}) => {
            produceModuleState((draft: LayeredObjectConstructorStateType) => {
                // draft.currentSuccessCondition = initSuccessCondition;
                // @ts-ignore
                delete draft.currentSuccessCondition;

                // TODO: это периодически ломает сценарии и запускает их в непонятном порядке
                draft.currentSuccessCondition = {
                    mode: inputs.mode as SuccessConditionModes,
                    check: inputs.check as SuccessConditionCheck,
                    rightIds: inputs.rightItemsIds,
                    correctItemsCountEqual: inputs.rightItemsCountEqual,
                    correctItemsCountMoreThan: inputs.rightItemsCountMoreThan,
                    correctItemsCountLessThan: inputs.rightItemsCountLessThan,
                    onSuccess: () => {
                        runStage(inputs.stageToRunSuccess);
                    },
                    onError: () => runStage(inputs.stageToRunFail),
                    onDropCorrect: () => runStage(inputs.stageToRunOnDropSuccess),
                    onDropIncorrect: () => runStage(inputs.stageToRunOnDropFail),
                    onLayerCorrect: () => {
                        runStage(inputs.stageToRunOnLayerSuccess);
                    },
                    onLayerIncorrect: () => runStage(inputs.stageToRunOnLayerFail),
                    onErrorMoreThan: () => runStage(inputs.stageToRunOnFailMoreThan),
                    onErrorLessThan: () => runStage(inputs.stageToRunOnFailLessThan),
                };
            });
        },
        inputs: {
            rightItemsIds: {
                label: 'Список верных компонентов/слоев (id\'s)',
                type: InputTypeType.multiKey,
                valueName: 'id',
                searchable: `scriptModulesStates.${layeredObjectConstructor.id}.sourceItems`,
            },
            mode: {
                label: 'Что проверять?',
                type: InputTypeType.select,
                options: Object.values(SuccessConditionModes),
                isRequired: true,
                isUnderlined: true,
            },
            check: {
                label: 'Тип проверки',
                type: InputTypeType.select,
                options: Object.values(SuccessConditionCheck),
                isRequired: true,
            },
            rightItemsCountEqual: {
                label: 'Сумма компонентов равна (=)',
                type: InputTypeType.number,
                showOn: {
                    check: [SuccessConditionCheck.countOf],
                },
            },
            rightItemsCountMoreThan: {
                label: 'Сумма компонентов больше (>)',
                type: InputTypeType.number,
                showOn: {
                    check: [SuccessConditionCheck.countOf],
                },
            },
            rightItemsCountLessThan: {
                label: 'Сумма компонентов меньше (<)',
                type: InputTypeType.number,
                showOn: {
                    check: [SuccessConditionCheck.countOf],
                },
            },
            stageToRunSuccess: {
                isOverlined: true,
                label: 'При успехе запустить сценарий',
                type: InputTypeType.stage,
            },
            stageToRunFail: {
                label: 'При ошибке запустить сценарий',
                type: InputTypeType.stage,
            },
            stageToRunOnDropSuccess: {
                label: 'При успешном переносе запустить сценарий',
                type: InputTypeType.stage,
                showOn: {
                    mode: [SuccessConditionModes.items],
                },
            },
            stageToRunOnDropFail: {
                label: 'При неуспешном переносе запустить сценарий',
                type: InputTypeType.stage,
                showOn: {
                    mode: [SuccessConditionModes.items],
                },
            },
            stageToRunOnLayerSuccess: {
                label: 'При успешном добавлении слоя запустить сценарий',
                type: InputTypeType.stage,
                showOn: {
                    mode: [SuccessConditionModes.layers],
                },
            },
            stageToRunOnLayerFail: {
                label: 'При неуспешном добавлении слоя запустить сценарий',
                type: InputTypeType.stage,
                showOn: {
                    mode: [SuccessConditionModes.layers],
                },
            },
            stageToRunOnFailMoreThan: {
                label: 'Если больше чем нужно, запустить сценарий',
                type: InputTypeType.stage,
                showOn: {
                    check: [SuccessConditionCheck.countOf],
                },
            },
            stageToRunOnFailLessThan: {
                label: 'Если меньше чем нужно, запустить сценарий',
                type: InputTypeType.stage,
                showOn: {
                    check: [SuccessConditionCheck.countOf],
                },
            },
        },
    });

    const addAnchorPointToObjectBlock = scriptBlock({
        title: 'Добавить/изменить якорную точку',
        func: (inputs, {produceModuleState, runStage}) => { // TODO: вынести в "createOrUpdate" хелпер
            if (inputs.id) {
                produceModuleState((draft: LayeredObjectConstructorStateType) => {
                    const currentObject = draft.currentObject;
                    let isHere = false;
                    const isCoordsValid = !checkIsNoCoords(inputs.coords);

                    const anchorData = {
                        id: inputs.id,
                        rotate: inputs.rotate,
                        tag: inputs.tag,
                        icon: inputs.icon as IconProps['glyph'],
                        isHidden: !inputs.isShown,
                        ...(isCoordsValid && {x: inputs.coords.x, y: inputs.coords.y}),
                        onClick: () => runStage(inputs.stageToRunOnClick),
                    };

                    if (currentObject) {
                        currentObject.anchors.forEach((anchor, index) => {
                            if (anchor.id === inputs.id) {
                                isHere = true;
                                currentObject.anchors[index] = merge(currentObject.anchors[index], anchorData);
                            }
                        });

                        if (!isHere) {
                            currentObject.anchors.push(merge({
                                x: 50, y: 50,
                            }, anchorData));
                        }
                    }
                });
            }
        },
        isRunOnChangeInput: true,
        inputs: {
            id: {
                label: 'Идентификатор',
                type: InputTypeType.key,
                searchable: `scriptModulesStates.${layeredObjectConstructor.id}.currentObject.anchors`,
                valueName: 'id',
                isCreatable: true,
                isUnderlined: true,
            },
            tag: {
                label: 'Общий тег связи',
                type: InputTypeType.textarea,
            },
            coords: {
                label: 'Позиция XY (%)',
                type: InputTypeType.coords,
            },
            isShown: {
                label: 'Показать?',
                type: InputTypeType.toggle,
                defaultValue: false,
            },
            rotate: {
                label: 'Поворот (градус)',
                type: InputTypeType.number,
            },
            icon: {
                label: 'Иконка',
                type: InputTypeType.select,
                isClearable: true,
                options: Object.keys(glyphs),
                defaultValue: 'ArrowChevronUp',
            },
            stageToRunOnClick: {
                isOverlined: true,
                label: 'При клике запустить сценарий',
                type: InputTypeType.stage,
            },
        },
    });

    const removeAnchorPointFromObjectBlock = scriptBlock({
        title: 'Убрать якорные точки',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft: LayeredObjectConstructorStateType) => {
                const currentObject = draft.currentObject;
                if (currentObject) {
                    currentObject.anchors = [];
                }
            });
        },
        inputs: {},
    });

    const setIsHiddenToLayerOfObjectBlock = scriptBlock({
        title: 'Трансформировать/изменить/показать/скрыть слой объекта',
        func: (inputs, {moduleState, produceModuleState}) => {
            produceModuleState((draft: LayeredObjectConstructorStateType) => {
                const currentObject = draft.currentObject;
                if (currentObject) {
                    const inputIds = typeof inputs.id === 'string' && inputs.id !== ''
                        ? [inputs.id] // for backward compatibility
                        : inputs.id;
                    if (inputIds && inputIds.length > 0) {
                        currentObject.layers.forEach((layer, index) => {
                            if (inputIds.includes(layer.id)) {
                                if (inputs.isShown === true) {
                                    if (layer.isCorrect) {
                                        moduleState.currentSuccessCondition.onLayerCorrect();
                                    } else {
                                        moduleState.currentSuccessCondition.onLayerIncorrect();
                                    }
                                }
                                currentObject.layers[index] = {
                                    ...layer,
                                    isShown: inputs.isShown,
                                    transform: inputs.transform,
                                    transition: inputs.transition,
                                    filter: inputs.filter,
                                    opacity: inputs.opacity,
                                };
                            }
                        });
                    }
                }
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            id: {
                label: 'Название слоя/слоев (id)',
                type: InputTypeType.multiKey,
                valueName: 'id',
                searchable: `scriptModulesStates.${layeredObjectConstructor.id}.currentObject.layers`,
                isUnderlined: true,
            },
            isShown: {
                label: 'Показать?',
                type: InputTypeType.toggle,
                defaultValue: true,
            },
            transform: {
                label: 'Строка трансформации',
                type: InputTypeType.textarea,
                placeholder: 'translate(0%, 0%) scale(1, 1) rotate(0deg)',
            },
            transition: {
                label: 'Строка анимации перехода',
                type: InputTypeType.textarea,
                placeholder: '0.5s ease',
            },
            filter: {
                label: 'Строка фильтров',
                type: InputTypeType.textarea,
                placeholder: 'blur(20px) grayscale(50%) contrast(150%)',
            },
            opacity: {
                label: 'Прозрачность в %',
                type: InputTypeType.number,
            },
        },
    });

    const validateObjectBlock = scriptBlock({
        title: 'Проверить на правильность объект',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft: LayeredObjectConstructorStateType) => {
                draft.triggerValidation = true;
            });
        },
        inputs: {},
    });

    const setLayeredObjectValidationModeBlock = scriptBlock({
        title: 'Установить способ валидации',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft: LayeredObjectConstructorStateType) => {
                draft.validationMode = inputs.validationMode as ValidationModes;
            });
        },
        inputs: {
            validationMode: {
                label: 'Способ валидации',
                type: InputTypeType.select,
                options: Object.values(ValidationModes),
                isRequired: true,
            },
        },
    });

    return {
        blocks: {
            setBackgroundPlateIsHiddenBlock,
            setLayeredObjectsBlock,
            setDraggableItemsBlock,
            setCurrentLayeredObjectIdBlock,
            setLayeredItemConstructorSuccessConditionsBlock,
            setOnDropProgressBarActionBlock,
            setLayeredObjectValidationModeBlock,
            validateObjectBlock,
            setDisabledDraggableBlock,
            setCurrentDraggableItemsBlock,
            setTransformToCurrentObjectBlock,
            setIsHiddenToLayerOfObjectBlock,
            addAnchorPointToObjectBlock,
            removeAnchorPointFromObjectBlock,
        },
    };
}
