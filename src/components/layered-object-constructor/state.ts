/* eslint-disable @typescript-eslint/no-empty-function */
import {ItemType} from '@/components/drag-drop-constructor/draggable-list';
import {LayerType} from '@/components/layered-object';
import {ProgressBarProps} from '@/components/progress-bar';
import {AnchorType} from '../layered-object/anchor-point';
import {NavButtonsProps} from '../nav-buttons';

export enum OrganoidType {
    Membrana = 'Membrana',
    KletochnayaStenka = 'KletochnayaStenka',
    Yadro = 'Yadro',
    Vakuol = 'Vakuol',
    Khloroplasti = 'Khloroplasti',
    Mitokhondrii = 'Mitokhondrii',
    Nukleoid = 'Nukleoid',
    Zhgutik = 'Zhgutik',
    Vklyucheniya = 'Vklyucheniya'
}

export enum CellType {
    Rastitelnaya = 'Rastitelnaya',
    Gribnaya = 'Gribnaya',
    Bakterialnaya = 'Bakterialnaya',
    Zhivotnaya = 'Zhivotnaya',
}

export type StepType = {
    currentItems: ItemType[];
    startText?: string;
    action: string;
    scale: {
        scaleId: number;
        valuePerDroppedItem: number;
    };
    explanation: string;
    addText?: string;
    successCondition: SuccessConditionType;
}

export enum SuccessConditionCheck {
    anyOf = 'Один верный установлен',
    eachOf = 'Все верные установлены',
    countOf = 'Количество (N) верных установлено',
}

export enum SuccessConditionModes {
    items = 'Проверять dnd элементы',
    layers = 'Проверять слои объекта',
}

export const initSuccessCondition: SuccessConditionType = {
    mode: SuccessConditionModes.items,
    check: SuccessConditionCheck.anyOf,
    rightIds: [],
    onSuccess: () => {},
    onError: () => {},
    onErrorMoreThan: () => {},
    onErrorLessThan: () => {},
    onDropCorrect: () => {},
    onDropIncorrect: () => {},
    onLayerCorrect: () => {},
    onLayerIncorrect: () => {},
};

export type SuccessConditionType =
{
    mode: SuccessConditionModes;
    rightIds: string[];
    onSuccess: () => void;
    onError: () => void;
    onErrorMoreThan: () => void;
    onErrorLessThan: () => void;
    onDropCorrect: (droppedItem: ItemType) => void;
    onDropIncorrect: (droppedItem: ItemType) => void;
    onLayerCorrect: () => void;
    onLayerIncorrect: () => void;
} &
({
    check: SuccessConditionCheck.anyOf;
} | {
    check: SuccessConditionCheck.eachOf;
} | {
    check: SuccessConditionCheck.countOf;
    correctItemsCountEqual?: number;
    correctItemsCountMoreThan?: number;
    correctItemsCountLessThan?: number;
});

export enum ValidationModes {
    onSubmit = 'onSubmit',
    onDragOver = 'onDragOver',
    onDrop = 'onDrop',
}

type LayeredObjectType = {
    id: string;
    layers: LayerType[];
    anchors: AnchorType[];
    transform?: string;
    transition?: string;
}

export enum ErrorEnum {
    correctItemsCountNotEqual = 'correctItemsCountNotEqual',
    correctItemsCountNotMoreThan = 'correctItemsCountNotMoreThan',
    correctItemsCountNotLessThan = 'correctItemsCountNotLessThan',
    incorrectItems = 'incorrectItems',
    correctItemsMissSome = 'correctItemsMissSome',
    correctItemsMissAll = 'correctItemsMissAll',
}

export type LayeredObjectConstructorStateType = {
    objects: LayeredObjectType[];
    currentObject?: LayeredObjectType;
    scales: ProgressBarProps[];
    isSourceItemsDisabled?: boolean;
    buttons: NavButtonsProps['buttons'];
    sourceItems: ItemType[];
    currentItems: ItemType[];
    droppedItems: ItemType[];
    isDropDisabled: boolean;
    isDragDisabled: boolean;
    isValid: boolean;
    error?: ErrorEnum | false;
    triggerValidation: boolean;
    isPlateShown?: boolean;
    currentSuccessCondition: SuccessConditionType;
    validationMode: ValidationModes;
    produceState: (draftCB: (draft: LayeredObjectConstructorStateType) => void) => void;
}

export const initEmptyState: LayeredObjectConstructorStateType = {
    objects: [],
    scales: [],
    isSourceItemsDisabled: false,
    buttons: [],
    sourceItems: [],
    currentItems: [],
    droppedItems: [],
    isDropDisabled: false,
    isDragDisabled: false,
    isValid: false,
    isPlateShown: false,
    triggerValidation: false,
    currentSuccessCondition: initSuccessCondition,
    validationMode: ValidationModes.onDrop,
    produceState: () => {},
};
