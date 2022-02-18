import React from 'react';
import {WidgetProps} from './index';
import {Controller} from 'react-hook-form';
import styled from '@emotion/styled';
import {OnCollapsedStyles, StyledWrapper} from './common-styles';
import Icon from '@/components/icon';
import classNames from 'classnames';

const StyledInput = styled.input`
  width: 100%;
  min-height: 25px;
`;

const NumberInput: React.FC<any> = ({params, control}:WidgetProps) => {
    return (
        <Controller
            render={({field}) => {
                return (<label>
                    <StyledWrapper className={classNames({
                        disabled: params.isDisabled,
                        hidden: params.isHidden,
                    })}
                    css={(
                        !field.value
                        && field.value !== 0
                        && !params.isTableRowMode)
                        && OnCollapsedStyles}
                    >
                        <Icon size={16} glyph={params.icon} />
                        {!params.isTableRowMode && params.label}
                        <div className="wrapper">
                            <StyledInput
                                type="number"
                                placeholder={params.defaultValue || ''}
                                {...field}
                            />
                        </div>
                    </StyledWrapper>
                </label>);
            }}
            name={params.name}
            control={control}
            defaultValue={params.value}
        />
    );
};
export default NumberInput;
