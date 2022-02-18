import React from 'react';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {MainFrame} from '../layered-object-constructor/css';
import {useDragDropConstructor} from '../../context-providers/drag-n-drop-constructor';
import {DroppedItems, SourceItems} from './css';
import {MemoizedItemsList} from './draggable-list';

export const DragDropConstructor = () => {
    const {
        sourceItems,
        droppedItems,
        onDragEnd,
        onDragStart,
        isDropDisabled,
        validationMode,
    } = useDragDropConstructor();

    return (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <MainFrame>
                <Droppable
                    droppableId="destination"
                    direction="vertical"
                    isDropDisabled={isDropDisabled}
                >
                    {(provided) => (
                        <DroppedItems
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <MemoizedItemsList
                                items={droppedItems}
                                validationMode={validationMode}
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
                            items={sourceItems}
                            validationMode={validationMode}
                        />
                        {provided.placeholder}
                    </SourceItems>
                )}
            </Droppable>
            <SourceItems className="overlay" />
        </DragDropContext>
    );
};
