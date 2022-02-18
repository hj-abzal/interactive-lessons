import React from 'react';
import Icon from '@/components/icon';
import {usePopup} from '@/context-providers/popup';
import styled from '@emotion/styled';
import {Controller} from 'react-hook-form';
import {WidgetProps} from './index';
import {OnCollapsedStyles, StyledButton, StyledWrapper} from './common-styles';
import {InputTable} from './input-table';
import classNames from 'classnames';

const EditorWrapper = styled.div`
    width: 100vw;
`;

const DataTable: React.FC<any> = ({params, control, getSubstate, addValueToState}:WidgetProps) => {
    const {addPopup} = usePopup();

    return (
        <Controller
            render={({field}) => {
                return (<label>
                    <StyledWrapper className={classNames({
                        disabled: params.isDisabled,
                        hidden: params.isHidden,
                    })}
                    css={!field.value && OnCollapsedStyles}>
                        <Icon size={16} glyph={params.icon} />
                        {params.label} ({field.value?.length || 0} строк)
                        <StyledButton onClick={() => addPopup({
                            id: 'table',
                            content: <EditorWrapper>
                                <InputTable
                                    getSubstate={getSubstate}
                                    addValueToState={addValueToState}
                                    inputs={params.inputs}
                                    data={field.value}
                                    onChange={field.onChange}
                                />
                            </EditorWrapper>,
                            canClose: true,
                        })}>Редактировать данные</StyledButton>
                    </StyledWrapper>
                </label>);
            }}
            name={params.name}
            control={control}
            defaultValue={params.value}
        />
    );
};

export default DataTable;
