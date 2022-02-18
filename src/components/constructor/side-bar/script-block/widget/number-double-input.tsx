import React from 'react';
import Icon from '@/components/icon';
import classNames from 'classnames';
import {Controller, ControllerRenderProps, FieldValues} from 'react-hook-form';
import {OnCollapsedStyles, StyledWrapper} from './common-styles';
import {TemplateParams, WidgetProps} from './index';
import styled from '@emotion/styled';

export const MiniInputs = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  > .mini-input {
    width: 100%;
    margin-right: 4px;
    margin-left: 0;
    padding: 2px 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    transition: 0.2s;
    border: 2px solid transparent;
    background-color: ${(p) => p.theme.colors.grayscale.input};
    &:hover, &:focus-within {
        border: 2px solid ${(p) => p.theme.colors.grayscale.line};
        background-color: ${(p) => p.theme.colors.grayscale.input};
    }
    input {
        width: 100%;
        margin-left: 4px;
        height: 25px;
    }
  }
  &.disabled {
    > .mini-input {
        border: 2px solid transparent;
        background-color: ${(p) => p.theme.colors.grayscale.input};
    }
  }
`;

const NumberDoubleInput: React.FC<any> = ({control, params}: WidgetProps) => {
    const input = params;

    return (
        <Controller
            render={({field}) => {
                return <NumberDouble field={field} params={params}/>;
            }}
            name={input.name}
            control={control}
            defaultValue={input.value}
        />
    );
};

function NumberDouble({field, params}: {field: ControllerRenderProps<FieldValues, any>, params: TemplateParams}) {
    const firstValueName = params.valueNames[0];
    const secondValueName = params.valueNames[1];

    const isNoValue = !field.value
        || typeof field.value[firstValueName] !== 'number'
        || typeof field.value[secondValueName] !== 'number'
        || isNaN(field.value[firstValueName])
        || isNaN(field.value[secondValueName]);

    const onChange = (key, val) => {
        field.onChange({...field.value, [key]: parseFloat(val.replace(/,/, '.'))});
    };

    return (<label onClick={() => isNoValue && field.onChange({[firstValueName]: 0, [secondValueName]: 0})}>
        <StyledWrapper
            className={classNames({
                disabled: params.isDisabled,
                hidden: params.isHidden,
            })}
            css={(isNoValue
                && !params.isTableRowMode)
                && OnCollapsedStyles}
        >
            <Icon size={16} glyph={params.icon} />
            {!params.isTableRowMode && params.label}
            <MiniInputs className={classNames('wrapper', {
                disabled: params.isDisabled,
            })} >
                <div className='mini-input'>
                    {firstValueName}:
                    <input
                        disabled={params.isDisabled}
                        type='number'
                        onChange={(event) => onChange(firstValueName, event.target.value)}
                        value={field.value?.[firstValueName]}
                    />
                </div>
                <div className='mini-input'>
                    {secondValueName}:
                    <input
                        disabled={params.isDisabled}
                        type='number'
                        onChange={(event) => onChange(secondValueName, event.target.value)}
                        value={field.value?.[secondValueName]}
                    />
                </div>
            </MiniInputs>
        </StyledWrapper>
    </label>);
}
export default NumberDoubleInput;
