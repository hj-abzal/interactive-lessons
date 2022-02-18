import React from 'react';
import {Clickable} from '@/components/clickable';
import ReactTooltip from 'react-tooltip';

export function RowActionsTooltip(p: {onRowLocalOperation: (p: any) => void}) {
    return <ReactTooltip
        className='more-table-row-list'
        effect='solid'
        event='click'
        clickable={true}
        type='light'
        place='bottom'
        multiline={true}
        id='table-row'
        backgroundColor='white'
        getContent={(dataTip) => <>
            <Clickable onClick={() => p.onRowLocalOperation({
                rowId: dataTip,
                action: 'dublicate',
            })}>Дублировать</Clickable>

            <Clickable onClick={() => p.onRowLocalOperation({
                rowId: dataTip,
                action: 'delete',
            })}>Удалить</Clickable>
        </>} />;
}
