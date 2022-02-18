import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {ScriptBlockInputs} from '../../inputs';
import {Clickable} from '@/components/clickable';
import Icon from '@/components/icon';
import {useTheme} from '@emotion/react';
import classNames from 'classnames';
import {getRowId} from '.';
import {InputValues} from '..';
import {RowActionsTooltip} from './row-actions-tooltip';

export function SortableRow(p) {
    const theme = useTheme();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
        transition,
    } = useSortable({id: p.id});

    const style = {
        transform: CSS.Transform.toString(transform) || '',
        transition: transition || '',
    };

    const onRowLocalOperation = (params) => onRowOperation(params, p.produceState);

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                className={classNames({
                    dragging: isDragging,
                }, 'row')}
            >

                <ScriptBlockInputs
                    index={p.index}
                    getSubstate={p.getSubstate}
                    addValueToState={p.addValueToState}
                    isTableRowMode={true}
                    inputs={p.inputs}
                    inputValues={p.inputValues}
                    onChangeByIndex={p.onChangeByIndex}
                />
                <Clickable
                    {...attributes}
                    {...listeners}
                    data-tip={p.id}
                    data-for={'table-row'}
                    className='drag-handle'
                >
                    <Icon
                        glyph='Handle'
                        size={16}
                        color={
                            p.isSelected
                                ? theme.colors.grayscale.offWhite
                                : theme.colors.grayscale.body
                        }/>
                </Clickable>
            </div>
            {p.isLast && <RowActionsTooltip onRowLocalOperation={onRowLocalOperation} />}
        </>
    );
}

function onRowOperation(p, produceState) {
    switch (p.action) {
        case 'dublicate':
            produceState((draft: Record<string, InputValues>[]) => {
                const keyValues = Object.entries(draft);
                const keys = Object.keys(draft);
                const index = keys.indexOf(p.rowId);
                const newRowId = getRowId(draft.length);
                keyValues.splice(index + 1, 0, [
                    newRowId,
                    JSON.parse(JSON.stringify(draft[p.rowId]))
                ]);

                // @ts-ignore
                const newRows = Object.fromEntries(keyValues);

                keys.forEach((key) => {
                    delete draft[key];
                });

                Object.keys(newRows).forEach((key) => {
                    draft[key] = newRows[key];
                });
            });
            break;
        case 'delete':
            produceState((draft) => {
                delete draft[p.rowId];
            });
            break;

        default:
            break;
    }
}
