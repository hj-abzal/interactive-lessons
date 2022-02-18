import React from 'react';
import {Draggable} from 'react-beautiful-dnd';
import {ScriptBlock} from '../../script-block';
import {connectFullScript} from '@/components/constructor/script-blocks/lib';
import {ScriptBlockData, ScriptBlockFull} from '../../../script-blocks/types';
import {AddBlockBar} from '../../script-block/add-block';
import mergeRefs from '@/utils/merge-refs';
import {StageParam} from '@/components/constructor/script-blocks/control-logic';

export type DraggableBlockProps = {
    blockData: ScriptBlockData;
    index: number;
    addBlocksState: {
        index: number;
        isOpened: boolean;
    };
    currentStage: string;
    setAddBlocksState: React.Dispatch<React.SetStateAction<{
        index: number;
        isOpened: boolean;
    }>>;
    isHighlighted: boolean,
    isSelected: boolean,
    produceState: any, // Shit
    availableScriptBlocks: { [key: string]: ScriptBlockFull },
    deleteScriptBlock: (ind: number) => void,
    getSubstate: (fieldPath: string[]) => any,
    addValueToState: (path: string, value: any) => void,
    highlightBlock: (index: any) => void;
    currentScriptModule: string | number;
    setCurrentScriptModule: React.Dispatch<React.SetStateAction<string | number>>;
    updateScriptBlockDataThrottle: (block: ScriptBlockFull, formData: any) => void;
    selectBlock: (id: string) => void;
    bindInputToStageParam: (
        block: ScriptBlockFull,
        params: {inputName: string, paramName?: string, tableItemPath?: string}
    ) => void,
    availableParamsToBind?: {
        [name: string]: StageParam,
    }
}

// eslint-disable-next-line react/display-name
export const DraggableBlock = React.memo(React.forwardRef(function DraggableBlock(p: DraggableBlockProps, ref) {
    const {
        blockData,
        index,
        addBlocksState,
        currentStage,
        setAddBlocksState,
        getSubstate,
        deleteScriptBlock,
        highlightBlock,
        isSelected,
        produceState,
        isHighlighted,
        addValueToState,
        availableScriptBlocks,
        currentScriptModule,
        setCurrentScriptModule,
        updateScriptBlockDataThrottle,
        bindInputToStageParam,
        availableParamsToBind,
        selectBlock,
    } = p;

    return <Draggable draggableId={blockData.dataId} index={index}>
        {(provided, snapshot) => {
            let fullScript = connectFullScript(blockData, availableScriptBlocks);

            fullScript = {
                ...fullScript,
                data: {
                    ...fullScript.data,
                    isHighlighted,
                },
            };

            return (
                <div
                    className='ref-wrap'
                    key={fullScript.data.dataId}
                    ref={mergeRefs([
                        provided.innerRef, ref
                    ])}
                    {...provided.draggableProps}
                >
                    <AddBlockBar
                        availableScriptBlocks={availableScriptBlocks}
                        isOpen={addBlocksState.index === index
                            && addBlocksState.isOpened}
                        currentStage={currentStage}
                        onOpen={() => setAddBlocksState({
                            index: index,
                            isOpened: true,
                        })}
                        onClose={() => setAddBlocksState({
                            index: index,
                            isOpened: false,
                        })}
                        produceState={produceState}
                        onAdd={() => highlightBlock(index)}
                        index={index}
                        currentScriptModule={currentScriptModule}
                        setCurrentScriptModule={setCurrentScriptModule} />

                    <ScriptBlock
                        index={index}
                        block={fullScript}
                        deleteScriptBlock={deleteScriptBlock}
                        onChange={(newFormData) => updateScriptBlockDataThrottle(fullScript, newFormData)}
                        isSelected={isSelected}
                        onSelect={selectBlock}
                        dragHandleProps={provided.dragHandleProps}
                        getSubstate={getSubstate}
                        addValueToState={addValueToState}
                        isDragging={snapshot.isDragging}
                        bindInputToStageParam={({inputName, paramName, tableItemPath}) =>
                            bindInputToStageParam(fullScript, {inputName, paramName, tableItemPath})
                        }
                        availableParamsToBind={availableParamsToBind}
                    />
                </div>
            );
        } }
    </Draggable>;
}));
