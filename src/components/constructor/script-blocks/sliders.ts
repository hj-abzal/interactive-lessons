import {ScriptModule} from '@/components/constructor/script-blocks/types';
import {scriptBlock} from '@/components/constructor/script-blocks/lib';
import {InputTypeType} from '@/components/constructor/side-bar/script-block/widget/types';
import {SlidersCard} from '@/components/sliders-card';
import {PropsOf} from '@emotion/react';
import _ from 'lodash';
import {RunStageParams} from '@/components/constructor/side-bar/script-block/widget';

const copyObj = (obj) => JSON.parse(JSON.stringify(obj));

type SliderConditions = {
    exactValue?: number,
    moreThan?: number,
    lessThan?: number,
    isChanged?: boolean,
    errorStage?: RunStageParams,
}

type SlidersConditions = {
    sliders: {
        [name: string]: SliderConditions,
    },
    runStage?: RunStageParams,
}

type SlidersValues = {
    [name: string]: number,
}

type SlidersModuleState = PropsOf<typeof SlidersCard> & {
    conditions: SlidersConditions[],
    lastChangedSliderName?: string,
}

const initialState = {
    sliders: [],
    conditions: [],
    title: 'Заголовок',
    isHidden: true,
};

export const slidersScriptModule: ScriptModule<SlidersModuleState> = {
    id: 'sliders',
    name: 'Слайдеры',
    icon: 'ProgressBarsProvider',
    color: '#27AE60',
    initialState: {
        ...initialState,
        onSliderChange: () => null,
    },
    Component: SlidersCard,
    hook: useSlidersScripts,
};

function isSliderConditionTriggered(values: SlidersValues, cond: SlidersConditions) {
    let errorStage = null;

    const isSuccess = Object.keys(cond.sliders).every((sliderName) => {
        const sliderCond = cond.sliders[sliderName];
        if (typeof sliderCond.exactValue === 'number' && (sliderCond.exactValue === Number(values[sliderName]))) {
            return true;
        }

        if (typeof sliderCond.moreThan === 'number' && (Number(values[sliderName]) > sliderCond.moreThan!)) {
            return true;
        }

        if (typeof sliderCond.lessThan === 'number' && (Number(values[sliderName]) < sliderCond.lessThan!)) {
            return true;
        }

        if (sliderCond.errorStage) {
            // @ts-ignore
            errorStage = sliderCond.errorStage;
        }

        return false;
    });

    return {
        isSuccess,
        errorStage,
        runStage: cond.runStage,
    };
}

function useSlidersScripts() {
    const setupSliders = scriptBlock<SlidersModuleState>({
        title: 'Установить слайдеры',
        func: (inputs, {produceModuleState, runStage}) => {
            produceModuleState((draft) => {
                draft.conditions = inputs.conditions;
                draft.name = inputs.name;
                draft.isHidden = inputs.isHidden;
                draft.sliders = inputs.sliders;
                draft.coords = inputs.coords;

                const runStageOnChange = _.debounce(() => {
                    if (inputs.runStageOnChange) {
                        setTimeout(() => runStage(inputs.runStageOnChange), 100);
                    }
                }, 500);

                draft.onSliderChange = (name: string, val: number) => {
                    produceModuleState((draft) => {
                        const slider = draft.sliders?.find((sl) => sl.name === name);

                        if (!slider) {
                            return;
                        }

                        slider.value = val;

                        draft.lastChangedSliderName = name;
                    });

                    runStageOnChange();
                };
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            name: {
                label: 'Имя',
                type: InputTypeType.textarea,
            },
            isHidden: {
                label: 'Скрыть',
                type: InputTypeType.toggle,
            },
            coords: {
                label: 'Координаты',
                type: InputTypeType.coords,
            },
            conditions: {
                label: 'Условия',
                type: InputTypeType.data,
                defaultValue: [
                    {
                        sliders: {},
                        runStage: undefined,
                    }
                ],
            },
            runStageOnChange: {
                label: 'При изменении запустить сценарий',
                type: InputTypeType.stage,
            },
            sliders: {
                label: 'Слайдеры',
                type: InputTypeType.table,
                inputs: {
                    name: {
                        label: 'Имя',
                        type: InputTypeType.textarea,
                    },
                    color: {
                        label: 'Цвет',
                        type: InputTypeType.textarea,
                    },
                    shouldShowTitle: {
                        label: 'Показать заголовок',
                        type: InputTypeType.toggle,
                    },
                    min: {
                        label: 'Мин',
                        type: InputTypeType.number,
                    },
                    max: {
                        label: 'Макс',
                        type: InputTypeType.number,
                    },
                    step: {
                        label: 'Шаг',
                        type: InputTypeType.number,
                    },
                    value: {
                        label: 'Начальное значение',
                        type: InputTypeType.number,
                    },
                    leftLegend: {
                        label: 'Легенда слева',
                        type: InputTypeType.textarea,
                    },
                    rightLegend: {
                        label: 'Легенда справа',
                        type: InputTypeType.textarea,
                    },
                },
            },
        },
    });

    const setSlidersState = scriptBlock({
        title: 'Показать/скрыть слайдеры',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft) => {
                draft.isHidden = inputs.isHidden;
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            isHidden: {
                label: 'Скрыть',
                type: InputTypeType.toggle,
            },
        },
    });

    const checkSlidersConditions = scriptBlock<SlidersModuleState>({
        title: 'Проверить условия слайдеров',
        func: (inputs, {produceModuleState, runStage}) => {
            const checkConditions = _.debounce((
                conditions: SlidersConditions[],
                sliders: SlidersModuleState['sliders']
            ) => {
                const slidersValues = sliders?.reduce((acc, sl) => {
                    acc[sl.name!] = sl.value;
                    return acc;
                }, {});

                if (!slidersValues) {
                    return;
                }

                const triggeredCondition = isSliderConditionTriggered(slidersValues, conditions[0]);

                if (triggeredCondition && triggeredCondition.isSuccess && triggeredCondition.runStage) {
                    runStage(triggeredCondition.runStage);
                    return;
                }

                if (triggeredCondition.errorStage) {
                    runStage(triggeredCondition.errorStage);
                    return;
                }
            }, 100);

            produceModuleState((draft) => {
                checkConditions(copyObj(draft.conditions), copyObj(draft.sliders || []));
            });
        },
        isRunOnChangeInput: false,
        inputs: {},
    });

    return {
        blocks: {
            setupSliders,
            setSlidersState,
            checkSlidersConditions,
        },
    };
}
