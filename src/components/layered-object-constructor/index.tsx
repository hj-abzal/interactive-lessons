/* eslint-disable no-case-declarations */
import React, {useEffect} from 'react';
import common from '@/codgen/common';
import LayeredObject from '@/components/layered-object';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {DroppedItems, MainFrame, SourceItems, StyledRoot} from './css';
import {MemoizedItemsList} from './draggable-list';
import {
    ErrorEnum,
    LayeredObjectConstructorStateType,
    SuccessConditionCheck,
    SuccessConditionModes,
    ValidationModes
} from './state';
import {css} from '@emotion/react';

const reorderItem = (oldItems, startIndex, endIndex) => {
    const [removed] = oldItems.splice(startIndex, 1);
    oldItems.splice(endIndex, 0, removed);
    return oldItems;
};

const moveItem = (source, destination, droppableSourceIndex, droppableDestinationIndex) => {
    const [removed] = source.splice(droppableSourceIndex, 1);
    destination.splice(droppableDestinationIndex, 0, removed);
};

const Object = (state: LayeredObjectConstructorStateType) => {
    if (state.objects) {
        const currentObject = state.currentObject;
        if (currentObject) {
            if (currentObject.layers.length > 0) {
                return <LayeredObject
                    width={'500px'}
                    height={'500px'}
                    layers={currentObject.layers}
                    anchors={currentObject.anchors}
                    transform={currentObject.transform}
                />;
            }
        }
    }
    return null;
};

const LayeredObjectConstructor = (state: LayeredObjectConstructorStateType) => {
    const {produceState: produceComponentState} = state;

    const setDropDisabled = (isDropDisabled) => produceComponentState((draft) => {
        draft.isDropDisabled = isDropDisabled;
    });

    const cleanErrors = () => produceComponentState((draft) => {
        draft.currentItems.forEach((item) => {
            item.isInvalid = false;
        });
    });

    const setError = (itemIndex) => {
        state.currentSuccessCondition.onError();
        produceComponentState((draft) => {
            draft.currentItems.forEach((item, index) => {
                if (index === itemIndex) {
                    item.isInvalid = true;
                }
            });
        });
    };

    const setValidationError = (err: ErrorEnum | false) => {
        produceComponentState((draft) => {
            if (err) {
                draft.error = err;
            } else {
                draft.error = false;
            }
        });
    };

    const validate = () => {
        const successCondition = state.currentSuccessCondition;
        if (state.validationMode === ValidationModes.onSubmit) {
            if (successCondition.mode === SuccessConditionModes.items) {
                produceComponentState((draft) => {
                    const itemsToReturn = draft.droppedItems
                        .filter((item) => !item.isCorrect)
                        .map((item) => ({...item, isInvalid: true}));
                    draft.droppedItems = draft.droppedItems.filter((item) => item.isCorrect);
                    draft.currentItems = [...draft.currentItems, ...itemsToReturn];
                    if (itemsToReturn.length === 0) {
                        draft.isValid = true;
                        setValidationError(false);
                    }
                });
            }
            if (state.isValid) {
                successCondition.onSuccess();
            } else {
                successCondition.onError();

                if (state.error) {
                    switch (state.error) {
                        case ErrorEnum.correctItemsCountNotLessThan:
                            if (successCondition.check === SuccessConditionCheck.countOf) {
                                produceComponentState((draft) => {
                                    const itemsToReturn = draft.droppedItems
                                        .map((item, index) => (successCondition.correctItemsCountMoreThan
                                            && successCondition.correctItemsCountMoreThan > index + 1
                                            ? {...item, isInvalid: true}
                                            : item));

                                    draft.droppedItems = [];
                                    draft.currentItems = itemsToReturn;
                                });
                            }
                            successCondition.onErrorMoreThan();
                            break;
                        case ErrorEnum.correctItemsCountNotMoreThan:
                            successCondition.onErrorLessThan();
                            break;

                        default:
                            break;
                    }
                }
            }
        }

        produceComponentState((draft) => {
            draft.triggerValidation = false;
        });

        return state.isValid;
    };

    useEffect(() => {
        if (state.triggerValidation) {
            validate();
        }
    }, [state.triggerValidation]);

    const onDragStart = (result) => {
        cleanErrors();
        if (
            state.validationMode === ValidationModes.onDrop
            || state.validationMode === ValidationModes.onDragOver
        ) {
            if (!state.currentItems[result.source.index].isCorrect) {
                setDropDisabled(true);
            } else {
                setDropDisabled(false);
            }
        }
    };

    const onDragEnd = (result) => {
        const {source, destination} = result;

        if (
            (state.validationMode === ValidationModes.onDrop
            || state.validationMode === ValidationModes.onDragOver)
            && !state.currentItems[source.index].isCorrect
        ) {
            setError(source.index);
        }

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
            produceComponentState((draft) => {
                reorderItem(
                    draft.currentItems,
                    source.index,
                    destination.index
                );
            });
        } else {
            if (
                state.validationMode !== ValidationModes.onSubmit
                && !state.currentItems[source.index].isCorrect) {
                return;
            }
            produceComponentState((draft) => {
                moveItem(
                    draft.currentItems,
                    draft.droppedItems,
                    source.index,
                    destination.index
                );
            });
            if (state.currentItems[source.index].isCorrect) {
                state.currentSuccessCondition
                    .onDropCorrect(state.currentItems[source.index]);
            } else {
                state.currentSuccessCondition
                    .onDropIncorrect(state.currentItems[source.index]);
            }
        }
    };

    useEffect(() => {
        if (state.objects.length > 0) {
            produceComponentState((draft: LayeredObjectConstructorStateType) => {
                const currentLayers = draft.currentObject?.layers;
                switch (state.currentSuccessCondition.check) {
                    case SuccessConditionCheck.anyOf:
                        if (state.currentSuccessCondition.mode === SuccessConditionModes.items) {
                            if (draft.droppedItems
                            && (draft.droppedItems || []).some((item) => item.isCorrect)) {
                                draft.isValid = true;
                            } else {
                                draft.isValid = false;
                            }
                        }
                        if (state.currentSuccessCondition.mode === SuccessConditionModes.layers) {
                            if (currentLayers && currentLayers.some((layer) => layer.isCorrect && layer.isShown)) {
                                draft.isValid = true;
                            } else {
                                draft.isValid = false;
                            }
                        }
                        break;

                    case SuccessConditionCheck.eachOf:
                        if (state.currentSuccessCondition.mode === SuccessConditionModes.items) {
                            if (draft.droppedItems
                                && (draft.droppedItems || []).every((item) => item.isCorrect)
                                && (draft.currentItems || []).every((item) => !item.isCorrect)
                            ) {
                                draft.isValid = true;
                            } else {
                                draft.isValid = false;
                            }
                        }
                        if (state.currentSuccessCondition.mode === SuccessConditionModes.layers) {
                            if (currentLayers && currentLayers.every((layer) => layer.isCorrect && layer.isShown)) {
                                draft.isValid = true;
                                setValidationError(false);
                            } else {
                                draft.isValid = false;
                            }
                        }
                        break;

                    case SuccessConditionCheck.countOf:
                        let isLayersOrItemsExists = false;
                        let correctItemsOrLayersCount = 0;
                        if (state.currentSuccessCondition.mode === SuccessConditionModes.items) {
                            isLayersOrItemsExists = Boolean(draft.droppedItems);
                            correctItemsOrLayersCount = (draft.droppedItems || [])
                                .filter((item) => item.isCorrect).length;
                        }
                        if (state.currentSuccessCondition.mode === SuccessConditionModes.layers) {
                            isLayersOrItemsExists = Boolean(currentLayers);
                            correctItemsOrLayersCount = (currentLayers || [])
                                .filter((layer) => layer.isCorrect && layer.isShown).length;
                        }

                        if (isLayersOrItemsExists) {
                            const rightItemsCountEqual =
                                Number(state.currentSuccessCondition.correctItemsCountEqual);
                            const rightItemsCountLessThan =
                                Number(state.currentSuccessCondition.correctItemsCountLessThan);
                            const rightItemsCountMoreThan =
                                Number(state.currentSuccessCondition.correctItemsCountMoreThan);

                            if (rightItemsCountEqual) {
                                draft.isValid = rightItemsCountEqual === correctItemsOrLayersCount;
                            } else {
                                if (rightItemsCountMoreThan) {
                                    draft.isValid = correctItemsOrLayersCount > rightItemsCountMoreThan;
                                    if (!draft.isValid) {
                                        setValidationError(ErrorEnum.correctItemsCountNotMoreThan);
                                    }
                                }
                                if (rightItemsCountLessThan) {
                                    draft.isValid = correctItemsOrLayersCount < rightItemsCountLessThan;
                                    if (!draft.isValid) {
                                        setValidationError(ErrorEnum.correctItemsCountNotLessThan);
                                    }
                                }
                                if (rightItemsCountMoreThan && rightItemsCountLessThan) {
                                    draft.isValid = correctItemsOrLayersCount > rightItemsCountMoreThan
                                        && correctItemsOrLayersCount < rightItemsCountLessThan;
                                }
                            }
                        } else {
                            draft.isValid = false;
                        }
                        if (draft.isValid) {
                            setValidationError(false);
                        }
                        break;

                    default:
                        break;
                }
            });
        }
    }, [state.droppedItems, state.currentItems, state.currentObject?.layers]);

    useEffect(() => {
        produceComponentState((draft) => {
            const currentObject = draft.currentObject;
            if (currentObject && state.droppedItems.length > 0) {
                currentObject.layers.forEach((layer) => {
                    if (state.droppedItems.some((item) => item.id === layer.id)) {
                        layer.isShown = true;
                    }
                });
            }
        });
    }, [state.droppedItems]);

    useEffect(() => {
        switch (state.validationMode) {
            case ValidationModes.onDrop:
                if (state.isValid) {
                    state.currentSuccessCondition.onSuccess();
                }
                break;

            default:
                break;
        }
    }, [state.isValid]);

    useEffect(() => {
        if (state.currentSuccessCondition && state.currentItems) {
            produceComponentState((draft: LayeredObjectConstructorStateType) => {
                draft.currentItems.forEach((item) => {
                    item.isCorrect = state.currentSuccessCondition.rightIds
                        .some((rightId) => rightId === item.id);
                });
                draft.currentObject?.layers.forEach((layer) => {
                    layer.isCorrect = state.currentSuccessCondition.rightIds
                        .some((rightId) => rightId === layer.id);
                });
            });
        }
    }, [state.currentSuccessCondition, state.currentItems]);

    return (
        <StyledRoot>
            <MainFrame>
                <img src={common.ui.roundBackPlate.huge} width="600px" alt="" css={css`
                    transform: ${state.isPlateShown ? 'scale(1)' : 'scale(0.5)'};
                    opacity: ${state.isPlateShown ? '1' : '0'};
                    transition: 0.5s ease;
                `} />
            </MainFrame>
            <MainFrame>
                <Object {...state} />
            </MainFrame>

            <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                <MainFrame style={{pointerEvents: 'none'}}>
                    <Droppable
                        droppableId="destination"
                        direction="vertical"
                        isDropDisabled={state.isDropDisabled}
                    >
                        {(provided) => (
                            <DroppedItems
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <MemoizedItemsList
                                    items={state.droppedItems}
                                    validationMode={state.validationMode}
                                    isDragDisabled={state.isDragDisabled}
                                />
                                {provided.placeholder}
                            </DroppedItems>
                        )}
                    </Droppable>
                </MainFrame>
                <Droppable
                    droppableId="source"
                    direction="horizontal"
                >
                    {(provided) => (
                        <SourceItems
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <MemoizedItemsList
                                items={state.currentItems}
                                validationMode={state.validationMode}
                                isDragDisabled={state.isDragDisabled}
                            />
                            {provided.placeholder}
                        </SourceItems>
                    )}
                </Droppable>
                <SourceItems className="overlay" />
            </DragDropContext>
        </StyledRoot>
    );
};

export default LayeredObjectConstructor;
