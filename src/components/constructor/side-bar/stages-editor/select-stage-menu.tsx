import React, {useState} from 'react';
import {components} from 'react-select';

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
import {useConstructorScenario} from '@/context-providers/constructor-scenario';
import {OptionThumb} from './select-stage-option';

export function MenuList(props: {children: React.ReactNode; options: any[]}) {
    const {state, produceState} = useConstructorScenario();
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <components.MenuList {...props}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext
                    items={props.options.map((option) => option.value)}
                    strategy={verticalListSortingStrategy}
                >
                    {props.children}
                </SortableContext>

                <DragOverlay dropAnimation={null}>
                    {activeId ? (
                        <OptionThumb {...{
                            label: props.options.find((o) => o.value === activeId).label,
                        }} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </components.MenuList>
    );

    function handleDragStart({active}) {
        setActiveId(active.id);
    }
    function handleDragEnd(event) {
        const {active, over} = event;

        setActiveId(null);

        if (active.id !== over.id) {
            produceState((draft) => {
                const stagesIds = (Object.keys(state.stages) || []);
                const overIndex = stagesIds.indexOf(over.id);
                const activeIndex = stagesIds.indexOf(active.id);
                const newStagesIds = arrayMove(stagesIds, activeIndex, overIndex);
                const newStages = {};

                newStagesIds.forEach((stageId) => {
                    newStages[stageId] = state.stages[stageId];
                });

                draft.stages = newStages;
            });
        }
    }
}
