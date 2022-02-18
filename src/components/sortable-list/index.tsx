import React, {useState} from 'react';
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
import {DragThumbOverlay, SortableItem} from './item';
import Button from '../button';
import {EmotionJSX} from '@emotion/react/types/jsx-namespace';

export type Item<TItemProps> = {
    id: string;
} & TItemProps;

export type SortableListProps<TItemProps> = {
    items: Item<TItemProps>[];
    ItemComponent: ((any) => EmotionJSX.Element) | any; // TODO: remove any
    onChange: (newItems: Item<TItemProps>[]) => void;
    getAddingItemProps?: (currentItems: Item<TItemProps>[]) => Item<TItemProps>;
}

export function SortableList<TItemProps = Record<string, any>>(p: SortableListProps<TItemProps>) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addRow = () => {
        if (p.getAddingItemProps) {
            const props = p.getAddingItemProps(p.items);
            const newItems = [...p.items, {...props}];
            p.onChange(newItems);
        }
    };

    const handleDragStart = ({active}) => {
        setActiveId(active.id);
    };

    const handleDragEnd = (event) => {
        const {active, over} = event;

        setActiveId(null);

        if (active.id !== over.id) {
            const itemsIds = p.items.map((item) => item.id);
            const oldIndex = itemsIds.indexOf(active.id);
            const newIndex = itemsIds.indexOf(over.id);
            const newItemsIds = arrayMove(itemsIds, oldIndex, newIndex);

            const newItems = [] as Item<TItemProps>[];

            newItemsIds.forEach((itemId) => {
                const item = p.items.find((item) => item.id === itemId);
                if (item) {
                    newItems.push(item);
                }
            });

            p.onChange(newItems);
        }
    };

    return <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
    >
        <SortableContext
            items={p.items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
        >
            {p.items.map((item, index) => {
                return <SortableItem<TItemProps>
                    key={item.id}
                    ItemComponent={p.ItemComponent}
                    {...item}
                    id={item.id}
                    index={index}
                />;
            })}
        </SortableContext>
        <DragOverlay dropAnimation={null}>
            <DragThumbOverlay
                item={p.items.find((item) => item.id === activeId)}
                ItemComponent={p.ItemComponent}
            />
        </DragOverlay>
        {p.getAddingItemProps &&
        <Button onClick={addRow}>
            Добавить
        </Button>}
    </DndContext>;
}
