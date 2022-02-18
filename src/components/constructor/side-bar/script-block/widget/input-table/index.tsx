import React, {useEffect, useMemo, useState} from 'react';
import {StyledTable} from './css';
import Card from '@/components/card';
import {ScriptBlockInputs} from '../../inputs';
import {useImmerState} from '@/utils/use-immer-state';
import {StyledButton, StyledWrapper} from '../common-styles';
import Icon, {IconProps} from '@/components/icon';
import {throttle} from 'lodash';
import {Inputs, InputValues} from '@/components/constructor/side-bar/script-block/widget';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {restrictToVerticalAxis} from '@dnd-kit/modifiers';
import {SortableRow} from './row';

export type InputTableProps = {
    inputs: Inputs;
    data: InputValues[];
    onChange: (newData) => void;
    getSubstate: (fieldPath: string[]) => any,
    addValueToState: (path: string, value: any) => void,
}

export const getRowId = (index) => `row-${index}`;

const rowArrToObj = (rowArr) => {
    const obj = {};
    rowArr?.forEach((rowData, index) => {
        obj[getRowId(index)] = rowData;
    });
    return obj;
};

export const InputTable = (p: InputTableProps) => {
    const [state, produceState] = useImmerState<Record<string, InputValues>>(rowArrToObj(p.data) || {});
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // !!! TODO: fix performance on big data
    const onChangeThrottle = useMemo(() => {
        const onChange = (rowIndex: number, newValue: any) => {
            produceState((draft) => {
                draft[getRowId(rowIndex)] = newValue;
            });
        };

        return throttle(onChange, 300) as typeof onChange;
    }, []);

    const addRow = () => {
        produceState((draft) => {
            const newItem = {};
            Object.keys(p.inputs).forEach((key) => {
                newItem[key] = p.inputs[key].defaultValue;
            });
            const rowsCount = Object.keys(draft).length;
            draft[getRowId(rowsCount)] = newItem;
        });
    };

    useEffect(() => {
        p.onChange(Object.values(state));
        // TODO: onchange on unmount table
    }, [state]);

    function handleDragStart({active}) {
        setActiveId(active.id);
    }
    function handleDragEnd(event) {
        const {active, over} = event;

        setActiveId(null);

        if (active.id !== over.id) {
            produceState((draft) => {
                const rowsIds = Object.keys(state);
                const overIndex = rowsIds.indexOf(over.id);
                const activeIndex = rowsIds.indexOf(active.id);
                const newRowsIds = arrayMove(rowsIds, activeIndex, overIndex);
                const oldRows = state;
                rowsIds.forEach((rowId) => {
                    delete draft[rowId];
                });
                newRowsIds.forEach((rowId) => {
                    draft[rowId] = oldRows[rowId];
                });
            });
        }
    }

    return <StyledTable>
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
        >
            <div className="scrollable">
                <Card>
                    <div className='row head'>
                        {Object.values(p.inputs).map((titleLabelData, index) =>
                            <label key={`head-${index}`}>
                                <StyledWrapper>
                                    <Icon size={16} glyph={titleLabelData.type as IconProps['glyph']} />
                                    {titleLabelData.label}
                                </StyledWrapper>
                            </label>)}
                    </div>
                    <SortableContext
                        items={Object.keys(state)}
                        strategy={verticalListSortingStrategy}
                    >
                        {Object.keys(state)?.map((rowId, rowIndex) => {
                            return <SortableRow
                                key={rowId}
                                id={rowId}
                                index={rowIndex}
                                getSubstate={p.getSubstate}
                                addValueToState={p.addValueToState}
                                inputs={p.inputs}
                                inputValues={state[rowId]}
                                onChangeByIndex={onChangeThrottle}
                                produceState={produceState}
                                isLast={rowIndex === Object.keys(state).length - 1}
                            />;
                        })}
                    </SortableContext>
                    <DragOverlay dropAnimation={null}>
                        {activeId ? (
                            <div key={getRowId(-1)} className='row hidden'>
                                <ScriptBlockInputs
                                    index={-1}
                                    getSubstate={p.getSubstate}
                                    addValueToState={p.addValueToState}
                                    isTableRowMode={true}
                                    inputs={p.inputs}
                                    inputValues={state[activeId]}
                                    onChangeByIndex={onChangeThrottle}
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                    <StyledButton
                        onClick={addRow}
                    >
                    Добавить строку
                    </StyledButton>
                </Card>
            </div>
        </DndContext>
    </StyledTable>;
};
