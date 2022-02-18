import React from 'react';
import {Draggable} from 'react-beautiful-dnd';
import Card from '../card';
import {defaultTheme} from '@/context-providers/theme/themes';
import {ValidationModes} from './state';
import classNames from 'classnames';
import {getImage} from '@/codgen/all-images';

export type ItemType = {
    id: string;
    isProperty?: boolean;
    propertyLabel?: string;
    name: string,
    src: string,
    droppedLayerSrc?: string;
    isCorrect?: boolean;
    isInvalid?: boolean;
}

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
            borderColor: (item.isCorrect
                ? defaultTheme.colors.success.default
                : defaultTheme.colors.error.default),
        };
    }
    if (!dropping || snapshot.draggingOver !== 'destination') {
        if (isDragging) {
            return {
                ...style,
                borderColor: (defaultTheme.colors.grayscale.line),
            };
        }
        if (item.isInvalid) {
            return {
                ...style,
                borderColor: (defaultTheme.colors.error.default),
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

    const translate = 'translate(50%, -200%)';
    const scale = 'scale(0.5)';
    return {
        ...style,
        opacity: 0,
        transform: `${translate} ${scale}`,
        transition: 'all ease 0.3s',
    };
};

const Item = ({item, validationMode, index, isDragDisabled, droppedItems}: {
    item: ItemType;
    index: number;
    validationMode: ValidationModes;
    isDragDisabled: boolean;
    droppedItems: ItemType[];
}) => {
    return (
        <Draggable
            draggableId={item.id}
            index={index}
            isDragDisabled={isDragDisabled}
        >
            {(provided, snapshot) => (<Card
                padding={0}
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
                <div className="wrapper">
                    {item.isProperty && <div className='title-plate'>
                        {item.propertyLabel ? item.propertyLabel : 'Свойство'}
                    </div>}
                    <div className={classNames({
                        content: true,
                        'space-between': !item.isProperty,
                    })}>
                        {item.src && <img src={getImage(item.src) || item.src} alt={item.name} width={100} />}
                        {item.name && <span>{item.name}</span>}
                    </div>
                </div>
            </Card>)}
        </Draggable>);
};

const ItemsList = ({items, validationMode, isDragDisabled}) => items.map((item, index) => (
    <Item
        item={item}
        key={item.id}
        index={index}
        validationMode={validationMode}
        isDragDisabled={isDragDisabled}
        droppedItems={items}

    />
));
export const MemoizedItemsList = React.memo(ItemsList);
