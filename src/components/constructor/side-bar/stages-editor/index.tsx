import React, {useCallback, useEffect, useRef, useState} from 'react';
import Button from '@/components/button';
import {SelectStylesSideBar} from '@/components/select-input/css';
import Creatable from 'react-select/creatable';
import {DragDropContext} from 'react-beautiful-dnd';
import {ScriptBlocksEditor} from './script-blocks-editor';
import {onStageOperation, OptionStage} from './select-stage-option';
import {reorder} from './script-blocks-editor/on-drag-utils';
import {MenuList} from './select-stage-menu';
import {ConstructorScenarioContextType} from '@/context-providers/constructor-scenario';
import {OverlayStagesNav} from './overlay-stages-nav';
import {useInputHandler} from '../../utils/use-input-handler';
import {css, useTheme} from '@emotion/react';
import mergeRefs from '@/utils/merge-refs';
import scrollIntoView from 'scroll-into-view';
import {StageParamsEditor} from '@/components/constructor/side-bar/stages-editor/stage-params-editor';

export const StagesEditor = ({
    runStage,
    state,
    produceState,
    currentStage,
    setCurrentStage,
    addQueueTask,
    updateStages,
    disabled,
}: {
    runStage: ConstructorScenarioContextType['runStage'];
    state: ConstructorScenarioContextType['state'];
    produceState: ConstructorScenarioContextType['produceState'];
    addQueueTask: ConstructorScenarioContextType['addQueueTask'];
    updateStages: ConstructorScenarioContextType['updateStages'];
    currentStage?: string;
    setCurrentStage: (s: string) => void;
    disabled: boolean
}) => {
    const theme = useTheme();

    const [stagesIds, setStagesIds] = useState<string[]>([]);
    const {inputValue, setInputValue, inputRef} = useInputHandler();

    const selectRef = useRef(null);

    useEffect(() => {
        setStagesIds(Object.keys(state.stages));
    }, [state.stages]);

    useEffect(() => {
        produceState((draft) => {
            if (state.constructor.currentStage) {
                draft.constructor.stagesHistory.unshift(state.constructor.currentStage);
            }
        });
    }, [state.constructor.currentStage]);

    useEffect(() => {
        if (state.queueStats.runningStageId && state.queueStats.runningStageId !== 'setup') {
            setCurrentStage(state.queueStats.runningStageId);
        }
    }, [state.queueStats.runningStageId]);

    const onDragStart = useCallback(() => {
        produceState((draft) => {
            // unselect all selected blocks
            draft.constructor.currentStageSelectedBlocksIds = [];
        });
    }, []);

    const onDragEnd = useCallback((result) => {
        if (!result.destination) {
            return;
        }
        produceState((draft) => {
            if (currentStage) {
                if (result.source.droppableId === result.destination.droppableId) {
                    const reorderedBlocks = reorder(
                        state.stages[currentStage],
                        result.source.index,
                        result.destination.index
                    );
                    draft.stages[currentStage] = reorderedBlocks;
                }
            }
        });
    }, []);

    const onMenuOpen = () => {
        setTimeout(() => {
            const selectedEl = document.getElementsByClassName('input-select__option--is-selected')[0];
            if (selectedEl) {
                scrollIntoView(selectedEl, {
                    time: 0,
                    validTarget: function (target, parentsScrolled) {
                        return (
                            parentsScrolled < 2 &&
                            target !== window &&
                            target.matches('.input-select__menu-list')
                        );
                    },
                });
            }
        }, 0);
    };

    const Option = (p) =>
        <OptionStage {...p}
            onStageOperation={(p) => onStageOperation(p, produceState, setCurrentStage)}
        />;

    return (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <ScriptBlocksEditor
                addQueueTask={addQueueTask}
                currentStage={currentStage || Object.keys(state.stages)[0]}
                state={state}
                produceState={produceState}
                updateStages={updateStages}
                disabled={disabled || Boolean(state.queueStats.runningStageId)}
            />
            <div className="stages-nav">
                <StageParamsEditor />

                {stagesIds &&
                    <Creatable
                        css={SelectStylesSideBar}
                        components={{Option, MenuList}}
                        onChange={(value) => setCurrentStage(value.value)}
                        onMenuOpen={onMenuOpen}
                        value={currentStage
                            && {
                                label: currentStage,
                                value: currentStage,
                            }
                            || undefined}
                        options={stagesIds.map((id) => ({label: id, value: id}))}
                        onCreateOption={(option) => {
                            setCurrentStage(option);
                            produceState((draft) => {
                                draft.stages[option] = [];
                            });
                        }}
                        inputValue={inputValue}
                        onInputChange={setInputValue}
                        ref={mergeRefs([selectRef, inputRef])}
                        formatCreateLabel={(input) => `Создать новую ${input}`}
                        classNamePrefix="input-select"
                        isSearchable={true}
                        menuShouldScrollIntoView={true}
                        placeholder="Название сценарной ветки"
                    />}
                {currentStage && <Button
                    leftIcon='Play'
                    size='small'
                    className='last'
                    keyListener={'Backslash'}
                    disabled={Boolean(state.queueStats.runningStageId)}
                    onClick={() => runStage(currentStage || '')}
                    css={css`${theme.shadows.medium};`}
                />}
            </div>
            <OverlayStagesNav state={state} setCurrentStage={setCurrentStage} />
        </DragDropContext>
    );
};
