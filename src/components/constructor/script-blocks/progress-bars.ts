import {ProgressBarsCard} from '@/components/progress-bars-card';
import {ScriptModule} from '@/components/constructor/script-blocks/types';
import {scriptBlock} from '@/components/constructor/script-blocks/lib';
import {mathIt} from './script-blocks-utils';
import {InputTypeType} from '@/components/constructor/side-bar/script-block/widget/types';

const initScales = [
    {label: 'Шкала 1', color: '#E9E003', value: 0},
    {label: 'Шкала 2', color: '#57D916', value: 0},
    {label: 'Шкала 3', color: '#00BAFF', value: 0},
    {label: 'Шкала 4', color: '#9252FA', value: 0},
    {label: 'Шкала 5', color: '#FF4CD9', value: 0},
    {label: 'Шкала 6', color: '#FF5DA1', value: 0}
];

export const progressBarsScriptModule: ScriptModule = {
    id: 'progressBars',
    name: 'Шкалы прогресса',
    icon: 'ProgressBarsProvider',
    color: '#27AE60',
    initialState: {
        scales: [],
        title: 'Заголовок',
        isHidden: true,
        isShiftOnHover: false,
    },
    Component: ProgressBarsCard,
    hook: useProgressBarsScripts,
};

function useProgressBarsScripts() {
    const setupProgressBarsBlock = scriptBlock({
        title: 'Установить список шкал',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft) => {
                draft.scales = inputs.newScales;
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            newScales: {
                label: 'Список объектов',
                type: InputTypeType.data,
                defaultValue: initScales,
            },
        },
    });

    const setProgressBarsCardIsHiddenBlock = scriptBlock({
        title: 'Показать/скрыть список шкал',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft) => {
                draft.isHidden = !inputs.isShown;
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

    const setProgressBarsCardIsShiftOnHoverBlock = scriptBlock({
        title: 'Сделать (не)кликабельным список шкал',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft) => {
                draft.isShiftOnHover = inputs.isShiftOnHover;
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            isShiftOnHover: {
                label: 'Сделать прозрачным при наведении?',
                type: InputTypeType.toggle,
                defaultValue: true,
            },
        },
    });

    const setProgressBarsCardTitleBlock = scriptBlock({
        title: 'Установить заголовок списка шкал',
        func: (inputs, {produceModuleState}) => {
            produceModuleState((draft) => {
                draft.title = inputs.title;
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            title: {
                label: 'Заголовок',
                type: InputTypeType.textarea,
                defaultValue: 'Прогресс',
            },
        },
    });

    const setProgressToProgressBarsBlock = scriptBlock({
        title: 'Добавить/изменить шкалу',
        func: ({
            label,
            valueString,
            color,
        }, {produceModuleState}) => {
            produceModuleState((draft) => {
                let isHere = false;
                draft.scales.forEach((scale, index) => {
                    if (scale.label === label) {
                        isHere = true;
                        draft.scales[index] = {
                            ...scale,
                            value: mathIt(scale.value, valueString),
                            ...(color && {color: color}),
                        };
                    }
                });

                if (!isHere) {
                    draft.scales.push({
                        label,
                        value: mathIt(0, valueString),
                        color,
                    });
                }
            });
        },
        isRunOnChangeInput: true,
        inputs: {
            label: {
                label: 'Название шкалы',
                type: InputTypeType.key,
                valueName: 'label',
                isCreatable: true,
                searchable: `scriptModulesStates.${progressBarsScriptModule.id}.scales`,
            },
            valueString: {
                label: 'Значение в %', // TODO: slider-input
                type: InputTypeType.textarea,
                defaultValue: '+10',
            },
            color: {
                label: 'Цвет в HEX', // TODO: Color-picker
                type: InputTypeType.textarea,
            },
        },
    });

    return {
        blocks: {
            setProgressToProgressBarsBlock,
            setProgressBarsCardTitleBlock,
            setProgressBarsCardIsHiddenBlock,
            setProgressBarsCardIsShiftOnHoverBlock,
            setupProgressBarsBlock,
        },
    };
}
