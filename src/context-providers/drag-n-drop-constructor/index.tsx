import React from 'react';
import {createSafeContext, ProviderProps} from '@/utils/create-safe-context';
import {useImmerState} from '@/utils/use-immer-state';
import {ItemType} from '../../components/drag-drop-constructor/draggable-list';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

export enum ValidationModes {
    onSubmit = 'onSubmit',
    onDragOver = 'onDragOver',
    onDrop = 'onDrop',
}

export type DragDropConstructorStateType = {
    sourceItems: ItemType[];
    setSourceItems: (items: ItemType[]) => void;
    droppedItems: ItemType[];
    setDroppedItems: (items: ItemType[]) => void;
    onDragStart: (result?: any) => void;
    onDragEnd: (result?: any) => void;
    isDropDisabled: boolean;
    setDropDisabled: (isDropDisabled: boolean) => void;
    isDragDisabled: boolean;
    setDragDisabled: (isDagDisabled: boolean) => void;
    validationMode: ValidationModes;
    setValidationMode: (mode: ValidationModes) => void;
    validate: () => void;
}

const defaultValue: DragDropConstructorStateType = {
    sourceItems: [],
    setSourceItems: () => {},
    droppedItems: [],
    setDroppedItems: (items) => {},
    onDragStart: (result) => {},
    onDragEnd: (result) => {},
    isDropDisabled: false,
    setDropDisabled: (isDropDisabled) => {},
    isDragDisabled: false,
    setDragDisabled: (isDagDisabled) => {},
    validationMode: ValidationModes.onDrop,
    setValidationMode: (mode) => {},
    validate: () => {},
};

export const [
    DragDropConstructorContext,
    useDragDropConstructor
] = createSafeContext<DragDropConstructorStateType>('DragDropConstructor');

const reorderItem = (oldItems, startIndex, endIndex) => {
    const [removed] = oldItems.splice(startIndex, 1);
    oldItems.splice(endIndex, 0, removed);
    return oldItems;
};

const moveItem = (source, destination, droppableSourceIndex, droppableDestinationIndex) => {
    const [removed] = source.splice(droppableSourceIndex, 1);
    destination.splice(droppableDestinationIndex, 0, removed);
    // destination.push(removed);
};

export default function DragDropConstructorProvider({children}: ProviderProps) {
    const [state, produceState] = useImmerState<{
        sourceItems: DragDropConstructorStateType['sourceItems'];
        droppedItems: DragDropConstructorStateType['droppedItems'];
        isDropDisabled: DragDropConstructorStateType['isDropDisabled'];
        isDragDisabled: DragDropConstructorStateType['isDragDisabled'];
        validationMode: DragDropConstructorStateType['validationMode'];
    }>({
        sourceItems: [],
        droppedItems: [],
        isDropDisabled: defaultValue.isDropDisabled,
        isDragDisabled: defaultValue.isDragDisabled,
        validationMode: defaultValue.validationMode,
    });
    const {
        sourceItems,
        droppedItems,
        isDropDisabled,
        validationMode,
        isDragDisabled,
    } = state;

    const setSourceItems = (newSourceItems) => produceState((draft) => {
        draft.sourceItems = newSourceItems;
    });
    const setDroppedItems = (newDroppedItems) => produceState((draft) => {
        draft.droppedItems = newDroppedItems;
    });
    const setDropDisabled = (isDropDisabled) => produceState((draft) => {
        draft.isDropDisabled = isDropDisabled;
    });
    const setDragDisabled = (isDragDisabled) => produceState((draft) => {
        draft.isDragDisabled = isDragDisabled;
    });
    const setValidationMode = (validationMode) => produceState((draft) => {
        draft.validationMode = validationMode;
    });

    const cleanErrors = () => produceState((draft) => {
        draft.sourceItems.forEach((item) => {
            item.isInvalid = false;
        });
    });

    const setError = (itemIndex) => produceState((draft) => {
        draft.sourceItems.forEach((item, index) => {
            if (index === itemIndex) {
                item.isInvalid = true;
            }
        });
    });

    const validate = () => {
        let isValid = false;
        produceState((draft) => {
            const itemsToReturn = draft.droppedItems
                .filter((item) => !item.isCorrect)
                .map((item) => ({...item, isInvalid: true}));
            draft.droppedItems = draft.droppedItems.filter((item) => item.isCorrect);
            draft.sourceItems = [...draft.sourceItems, ...itemsToReturn];
            if (itemsToReturn.length === 0) {
                isValid = true;
            }
        });
        return isValid;
    };

    const onDragStart = (result) => {
        cleanErrors();
        if (validationMode === ValidationModes.onDrop || validationMode === ValidationModes.onDragOver) {
            if (!sourceItems[result.source.index].isCorrect) {
                setDropDisabled(true);
                setError(result.source.index);
            } else {
                setDropDisabled(false);
            }
        }
    };

    const onDragEnd = (result) => {
        const {source, destination} = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === 'destination' && destination.droppableId === 'source') {
            return;
        }

        if (source.droppableId === destination.droppableId && source.droppableId === 'source') {
            cleanErrors();
            if (destination.index === source.index) {
                return;
            }
            produceState((draft) => {
                reorderItem(
                    draft.sourceItems,
                    source.index,
                    destination.index
                );
            });
        } else {
            if (validationMode !== ValidationModes.onSubmit && !sourceItems[source.index].isCorrect) {
                return;
            }
            produceState((draft) => {
                moveItem(
                    draft.sourceItems,
                    draft.droppedItems,
                    source.index,
                    destination.index
                );
            });
        }
    };

    return (
        <DragDropConstructorContext.Provider value={{
            sourceItems,
            setSourceItems,
            droppedItems,
            setDroppedItems,
            onDragStart,
            onDragEnd,
            isDropDisabled,
            setDropDisabled,
            isDragDisabled,
            setDragDisabled,
            validationMode,
            setValidationMode,
            validate,
        }}>
            {children}
        </DragDropConstructorContext.Provider>
    );
}
