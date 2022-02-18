import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Item, SortableListProps} from '.';
import {omit} from 'lodash';

export type DraggableItemProps<TItemProps>
    = Item<TItemProps> & {
        ItemComponent: SortableListProps<TItemProps>['ItemComponent'];
    };

export function SortableItem<TItemProps>(p: DraggableItemProps<TItemProps>) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: p.id});

    const style = {
        transform: CSS.Transform.toString(transform) || '',
        transition: transition || '',
    };

    const {ItemComponent} = p;
    const itemProps = omit(p, 'ItemComponent');

    return (

        <div
            ref={setNodeRef}
            style={style}
            className='row'
            {...attributes}
            {...listeners}
        >
            <ItemComponent
                {...itemProps}
            />
        </div>
    );
}

export type DragThumbOverlayProps<TItemProps> = {
    item?: Item<TItemProps>;
    ItemComponent: SortableListProps<TItemProps>['ItemComponent'];
};

export function DragThumbOverlay<TItemProps>({item, ItemComponent}: DragThumbOverlayProps<TItemProps>) {
    return item
        ? <div style={{opacity: 0}}>
            <SortableItem<TItemProps>
                ItemComponent={ItemComponent}
                {...item}
            />
        </div>
        : null;
}
