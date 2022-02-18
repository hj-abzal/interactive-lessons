import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {SideBarProps} from '../../index';
import scrollIntoView from 'scroll-into-view';
import {Droppable} from 'react-beautiful-dnd';
import {allScriptModules} from '../../../script-blocks';
import {AddBlockBar} from '../../script-block/add-block';
import mergeRefs from '@/utils/merge-refs';
import _ from 'lodash';
import classNames from 'classnames';
import {ScriptBlockFull, ScriptModule} from '@/components/constructor/script-blocks/types';
import {Actions, ConstructorScenarioContextType, Targets} from '@/context-providers/constructor-scenario';
import {DraggableBlock} from './draggable-block';
import {controlLogicScriptModule, ControlLogicState} from '@/components/constructor/script-blocks/control-logic';

type ScriptsModulesPreviews = {
    [key: string]: Omit<ScriptModule, 'hook'>,
}

export const scriptModulesPreviews: ScriptsModulesPreviews = {
    all: {
        color: '#333',
        id: 'all',
        name: 'Все блоки',
    },
    ...allScriptModules.reduce((acc, module) => {
        acc[module.id] = module;
        return acc;
    }, {}),
};

export const ScriptBlocksEditor = ({
    state,
    produceState,
    currentStage,
    disabled,
    addQueueTask,
    updateStages,
}: {
    state: SideBarProps['state'];
    produceState: SideBarProps['produceState'];
    addQueueTask: SideBarProps['addQueueTask'];
    updateStages: ConstructorScenarioContextType['updateStages'];
    currentStage: string;
    disabled?: boolean;
}) => {
    const hiddenScriptBlocksIds = useMemo(() => {
        return Object.keys(state.availableScriptBlocks || {})
            .filter((key) => state.availableScriptBlocks[key].isHidden);
    }, [state.availableScriptBlocks]);

    const scriptBlocksData = state.stages[currentStage];

    const activeRef = useRef<HTMLDivElement>(null);
    const addBlockRef = useRef<HTMLDivElement>(null);
    const scrollEndRef = useRef<HTMLDivElement>(null);

    const [addBlocksState, setAddBlocksState] = useState({
        index: -2,
        isOpened: false,
    });

    const [currentScriptModule, setCurrentScriptModule] = useState<keyof typeof scriptModulesPreviews>('all');

    const scrollToRef = (ref) => scrollIntoView(ref.current, {
        time: 300,
        validTarget: function (target, parentsScrolled) {
            return (
                parentsScrolled < 2 &&
                target !== window &&
                target.matches('.script-blocks')
            );
        },
    });

    const highlightBlock = useCallback((index) => {
        produceState((draft) => {
            draft.currentStageScriptIndex = index;
        });
        setTimeout(() => {
            produceState((draft) => {
                draft.currentStageScriptIndex = undefined;
            });
        }, 500);
    }, [produceState]);

    const selectBlock = useCallback((id) => {
        produceState((draft) => {
            if (draft.constructor.modifierKeys?.shiftKey) {
                if (draft.constructor.currentStageSelectedBlocksIds.includes(id)) {
                    const idOfIndex = draft.constructor
                        .currentStageSelectedBlocksIds
                        .findIndex((idItem) => idItem === id);
                    delete draft.constructor
                        .currentStageSelectedBlocksIds[idOfIndex];
                } else {
                    draft.constructor.currentStageSelectedBlocksIds.push(id);
                }
            } else {
                draft.constructor.currentStageSelectedBlocksIds = [id];
            }
        });
    }, [produceState]);

    const unselectAll = () => {
        if (state.constructor.currentStageSelectedBlocksIds.length) { // remove
            produceState((draft) => {
                draft.constructor.currentStageSelectedBlocksIds = [];
            });
        }
        if (state.constructor.currentStageSelectedBlocksIds.length) {
            produceState((draft) => {
                draft.constructor.currentStageSelectedBlocksIds = [];
            });
        }
    };

    const selectAll = () => {
        produceState((draft) => {
            if (draft.stages[currentStage]?.length) {
                draft.constructor.currentStageSelectedBlocksIds = draft.stages[currentStage].map((sb) => sb.dataId);
            }
        });
    };

    const onWindowClick = (event: MouseEvent) => {
        if (event.defaultPrevented) {
            return;
        }
        unselectAll();
    };

    const onWindowTouchEnd = (event: TouchEvent) => {
        if (event.defaultPrevented) {
            return;
        }
        unselectAll();
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (
            (event.ctrlKey || event.metaKey)
            && event.code === 'KeyA' // @ts-ignore
            && event.target.nodeName !== 'INPUT' // @ts-ignore
            && event.target.nodeName !== 'TEXTAREA'
        ) {
            selectAll();
            event.preventDefault();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        document.addEventListener('click', onWindowClick);
        document.addEventListener('touchend', onWindowTouchEnd);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('click', onWindowClick);
            document.removeEventListener('touchend', onWindowTouchEnd);
        };
    }, [currentStage]);

    const scriptCount = (scriptBlocksData && scriptBlocksData.length || 0);

    useEffect(() => {
        scrollToRef(activeRef);
    }, [state.currentStageScriptIndex]);

    useEffect(() => {
        if (addBlocksState.isOpened) {
            if (addBlocksState.index === scriptCount) {
                setTimeout(() => {
                    scrollToRef(scrollEndRef);
                }, 150);
            } else {
                scrollToRef(addBlockRef);
            }
        }
    }, [addBlocksState]);

    useEffect(() => {
        setAddBlocksState({
            index: -2,
            isOpened: false,
        });
    }, [currentStage]);

    const updateScriptBlockDataThrottle = useMemo(() => {
        const updateScriptBlockData = (block: ScriptBlockFull, formData) => {
            updateStages({
                target: Targets.scriptBlock,
                action: Actions.update,
                stageId: currentStage,
                scriptDataId: block.data.dataId,
                newValue: formData,
            });
            if (block.isRunOnChangeInput) {
                const thisBlockData = state.stages[currentStage].find((b) => b.dataId === block.data.dataId);
                if (thisBlockData) {
                    addQueueTask(currentStage, {...thisBlockData, inputValues: formData});
                }
            }
        };

        return _.debounce(updateScriptBlockData, 300);
    }, [updateStages, addQueueTask, currentStage, state?.stages[currentStage]]);

    const bindInputToStageParam = useCallback((block: ScriptBlockFull, {inputName, paramName, tableItemPath}) => {
        updateStages({
            target: Targets.scriptBlock,
            action: Actions.bindStageParam,
            stageId: currentStage,
            scriptDataId: block.data.dataId,
            paramName,
            inputName,
            tableItemPath,
        });
    }, [updateStages, currentStage, state?.stages[currentStage]]);

    const availableParamsToBind = useMemo(() => {
        const controlLogicState: ControlLogicState = state.scriptModulesStates[controlLogicScriptModule.id];

        return controlLogicState?.stagesParams[currentStage]?.params;
    }, [
        currentStage,
        state.scriptModulesStates[controlLogicScriptModule.id]?.stagesParams[currentStage]
    ]);

    const getSubstate = useCallback((fieldPath: string[]) => {
        return _.get({root: state}, fieldPath);
    }, [state?.states, state?.scriptModulesStates]);

    const addValueToState = useCallback((path: string, value: any) => {
        produceState((draft) => {
            // TODO: throw error if adding string key in existing array
            _.setWith(draft, path, value, Object);
        });
    }, []);

    const deleteScriptBlock = useCallback((index: number) => {
        produceState((draft) => {
            draft.stages[currentStage].splice(index, 1); // TODO: change to move to "deleted"
        });
    }, [currentStage, state?.stages[currentStage]]);

    const getIsActive = (index) => {
        return state.constructor.currentStage === state.queueStats.runningStageId
        && state.currentStageScriptIndex === index;
    };

    const getBlockRef = (index) => {
        return mergeRefs([
            getIsActive(index) && activeRef,
            addBlocksState.index === index && addBlockRef
        ]);
    };

    return (
        <>
            <div className="script-blocks">
                <div className={classNames({
                    'script-blocks-inner': true,
                    disabled: disabled,
                })}>
                    <Droppable droppableId='current-script-blocks' direction="vertical">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {scriptBlocksData?.map((blockData, index) =>
                                    hiddenScriptBlocksIds.includes(blockData.scriptBlockId)
                                        ? null
                                        : (
                                            <div key={blockData.dataId} ref={getBlockRef(index)}>
                                                <DraggableBlock
                                                    produceState={produceState}
                                                    getSubstate={getSubstate}
                                                    addValueToState={addValueToState}
                                                    deleteScriptBlock={deleteScriptBlock}
                                                    availableScriptBlocks={state.availableScriptBlocks}
                                                    blockData={blockData}
                                                    index={index}
                                                    isHighlighted={getIsActive(index)}
                                                    isSelected={state.constructor
                                                        .currentStageSelectedBlocksIds.includes(blockData.dataId)}
                                                    addBlocksState={addBlocksState}
                                                    currentStage={currentStage}
                                                    setAddBlocksState={setAddBlocksState}
                                                    highlightBlock={highlightBlock}
                                                    currentScriptModule={currentScriptModule}
                                                    setCurrentScriptModule={setCurrentScriptModule}
                                                    updateScriptBlockDataThrottle={updateScriptBlockDataThrottle}
                                                    bindInputToStageParam={bindInputToStageParam}
                                                    availableParamsToBind={availableParamsToBind}
                                                    selectBlock={selectBlock}
                                                />
                                            </div>
                                        )
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <AddBlockBar
                        availableScriptBlocks={state.availableScriptBlocks}
                        isFullWidth
                        isFullHeight={scriptCount === 0}
                        produceState={produceState}
                        isOpen={scriptCount === 0
                                || (addBlocksState.index === scriptCount
                                && addBlocksState.isOpened)}
                        currentStage={currentStage}
                        onOpen={() => setAddBlocksState({
                            index: scriptCount,
                            isOpened: true,
                        })}
                        onAdd={() => highlightBlock(scriptCount)}
                        onClose={() => setAddBlocksState({
                            index: scriptCount,
                            isOpened: false,
                        })}
                        index={scriptCount}
                        currentScriptModule={currentScriptModule}
                        setCurrentScriptModule={setCurrentScriptModule}
                    />
                    <div ref={scrollEndRef} className="bottom"></div>
                </div>
            </div>
            <div className="script-blocks-overlay"></div>
        </>
    );
};
