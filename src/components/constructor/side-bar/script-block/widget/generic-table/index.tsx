import React from 'react';
import {OnCollapsedStyles, StyledButton, StyledWrapper} from '../common-styles';
import Icon from '@/components/icon';
import {Inputs, WidgetProps} from '@/components/constructor/side-bar/script-block/widget';
import {InputTypeType} from '@/components/constructor/side-bar/script-block/widget/types';
import styled from '@emotion/styled';
import {usePopup} from '@/context-providers/popup';
import {Controller} from 'react-hook-form';
import {InputTable} from '@/components/constructor/side-bar/script-block/widget/input-table';

type TableColumnConfigRow = {
    columnName: string,
    columnType: InputTypeType,
    defaultValue?: any,
    columnSettings?: any,
}

const disabledColumnTypes = [
    InputTypeType.table,
    InputTypeType.auto
];

const tableStructureInputs: Inputs = {
    columnName: {
        label: 'Имя столбца',
        type: InputTypeType.textarea,
        defaultValue: 'Столбец',
    },
    columnType: {
        label: 'Тип столбца',
        type: InputTypeType.select,
        options: Object.values(InputTypeType).filter((t) => !disabledColumnTypes.includes(t)),
    },
    columnSettings: {
        label: 'Настройки столбца',
        type: InputTypeType.data,
    },
    defaultValue: {
        label: 'Значение по умолчанию',
        type: InputTypeType.data,
    },
};

export const ID_COLUMN: TableColumnConfigRow = {
    columnName: 'id',
    columnType: InputTypeType.id,
    columnSettings: {
        autoGenerate: true,
    },
};

const EditorWrapper = styled.div`
    width: 100vw;
`;

const columnsArrayToConfig = (columns: TableColumnConfigRow[]) =>
    columns.filter((col) => Boolean(col.columnType)).reduce((acc, col) => {
        acc[col.columnName] = {
            type: col.columnType,
            label: col.columnName,
            defaultValue: col.defaultValue,
            ...(col.columnSettings || {}),
        };

        return acc;
    }, {});

export const GenericTableInput = ({params, control, addValueToState, getSubstate}: WidgetProps) => {
    const {addPopup} = usePopup();

    return (
        <Controller
            render={({field}) => {
                const columnsConfig = columnsArrayToConfig(field.value?.columns || []);

                return (<label>
                    <StyledWrapper css={!field.value?.columns && OnCollapsedStyles}>
                        <Icon size={16} glyph={params.icon} />
                        Столбцы ({field.value?.columns?.length})
                        <StyledButton
                            onClick={() => addPopup({
                                id: 'columns',
                                content: <EditorWrapper>
                                    <InputTable
                                        getSubstate={getSubstate}
                                        addValueToState={addValueToState}
                                        inputs={tableStructureInputs}
                                        data={field.value?.columns}
                                        onChange={(columns) => field.onChange({...field.value, columns: columns})}
                                    />
                                </EditorWrapper>,
                                canClose: true,
                            })}
                        >
                            Настроить
                        </StyledButton>
                    </StyledWrapper>

                    {field.value?.columns &&
                        <StyledWrapper css={!field.value?.items && OnCollapsedStyles}>
                            <Icon size={16} glyph={params.icon} />
                            Элементы ({field.value?.items?.length} стр)
                            <StyledButton
                                onClick={() => addPopup({
                                    id: 'table',
                                    content: <EditorWrapper>
                                        <InputTable
                                            getSubstate={getSubstate}
                                            addValueToState={addValueToState}
                                            inputs={columnsConfig}
                                            data={field.value?.items}
                                            onChange={(items) => field.onChange({...field.value, items})}
                                        />
                                    </EditorWrapper>,
                                    canClose: true,
                                })}
                            >
                                Редактировать данные
                            </StyledButton>
                        </StyledWrapper>
                    }
                </label>);
            }}
            name={params.name}
            control={control}
            defaultValue={params.value || {items: [], columns: [ID_COLUMN]}}
        />
    );
};
