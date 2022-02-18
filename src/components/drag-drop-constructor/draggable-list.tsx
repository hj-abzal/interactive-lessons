import React from 'react';
import {Draggable} from 'react-beautiful-dnd';
import {ValidationModes} from '../../context-providers/drag-n-drop-constructor';
import Card from '../card';
import {defaultTheme} from '@/context-providers/theme/themes';
import {useDragDropConstructor} from '../../context-providers/drag-n-drop-constructor';

export type ItemType = {
    id: string;
    objectId: string;
    name: string,
    src: string,
    droppedLayerSrc?: string;
    isCorrect?: boolean;
    isInvalid?: boolean;
}

const getBorder = (color: string) => `4px solid ${color}`;

const getStyle = (
    style,
    snapshot,
    droppedItems,
    item,
    validationMode,
    isDragDisabled
) => {
    const dropping = snapshot.dropAnimation;
    const isDragging = snapshot.isDragging;

    if (!dropping
        && snapshot.draggingOver === 'destination'
        && validationMode === ValidationModes.onDragOver) {
        return {
            ...style,
            border: getBorder(item.isCorrect
                ? defaultTheme.colors.success.default
                : defaultTheme.colors.error.default),
        };
    }
    if (!dropping || snapshot.draggingOver !== 'destination') {
        if (isDragging) {
            return {
                ...style,
                border: getBorder(defaultTheme.colors.grayscale.line),
            };
        }
        if (item.isInvalid) {
            return {
                ...style,
                border: getBorder(defaultTheme.colors.error.default),
            };
        }
        if (isDragDisabled) {
            return {
                ...style,
                opacity: 0.5,
                pointerEvents: 'none',
            };
        }
        return style;
    }

    const {curve, duration, moveTo} = dropping;

    // TODO: убрать костыль 👇
    const offsetX = (droppedItems?.length === 0) ? 180 : 500;

    const translate = `translate(${moveTo.x + offsetX}px, -200%)`;
    const scale = 'scale(0.5)';
    return {
        ...style,
        opacity: 0,
        transform: `${translate} ${scale}`,
        transition: `all ${curve} ${duration + 1}s`,
    };
};

const Item = ({item, validationMode, index}: {
    item: ItemType;
    index: number;
    validationMode: ValidationModes;
}) => {
    const {droppedItems, isDragDisabled} = useDragDropConstructor();
    return (
        <Draggable
            draggableId={item.id}
            index={index}
            isDragDisabled={isDragDisabled}
        >
            {(provided, snapshot) => (<Card
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                isDragging={snapshot.isDragging && !snapshot.isDropAnimating}
                style={getStyle(
                    provided.draggableProps.style,
                    snapshot,
                    droppedItems,
                    item,
                    validationMode,
                    isDragDisabled
                )}
            >
                <img src={item.src} alt="" width={100} />
                <span>{item.name}</span>
            </Card>)}
        </Draggable>);
};

const ItemsList = ({items, validationMode}) => items.map((item, index) => (
    <Item
        item={item}
        key={item.id}
        index={index}
        validationMode={validationMode}
    />
));
export const MemoizedItemsList = React.memo(ItemsList);
