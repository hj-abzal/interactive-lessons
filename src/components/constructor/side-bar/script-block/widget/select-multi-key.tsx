import Icon from '@/components/icon';
import React from 'react';
import {Controller} from 'react-hook-form';
import SelectComponent from 'react-select';
import Creatable from 'react-select/creatable';
import {WidgetProps} from './index';
import {StyledWrapper} from './common-styles';
import {SelectSmallStyles} from './select';
import {suggestKeysItems} from './select-key';
import classNames from 'classnames';

const SelectMultiKey: React.FC<any> = ({control, params, getSubstate}: WidgetProps) => {
    const input = params;
    const options = suggestKeysItems(
        params?.searchable,
        params?.valueName,
        getSubstate,
        params.inputValues,
        params.searchableFilter
    );
    const Component = input.isCreatable ? Creatable : SelectComponent;

    return (
        <Controller
            render={({field}) => {
                return (<label>
                    <StyledWrapper className={classNames({
                        disabled: params.isDisabled,
                        hidden: params.isHidden,
                    })}>
                        <Icon size={16} glyph={input.icon} />
                        <Component
                            css={SelectSmallStyles}
                            className='multi-select'
                            {...field}
                            onChange={(value) =>
                                field.onChange(value.map((val) => val.value))}
                            value={Array.isArray(field.value)
                                ? field.value.map((val) => ({label: val, value: val}))
                                : typeof field.value === 'string' && field.value !== ''
                                    ? [{label: field.value, value: field.value}]
                                    : []}
                            options={options || []}
                            classNamePrefix="input-select"
                            noOptionsMessage={({inputValue}) => `Нет вариантов ${inputValue}...`}
                            isSearchable={true}
                            isMulti={true}
                            isClearable={true}
                            filterOption={() => true}
                            isCreatable={Boolean(input.isCreatable)}
                            formatCreateLabel={(input) => `Создать новое ${input}`}
                            onCreateOption={(option) => {
                                const value = Array.isArray(field.value)
                                    ? field.value
                                    : [];
                                field.onChange(value.concat([option]));
                            }}
                            openMenuOnFocus={true}
                            blurInputOnSelect={false}
                            closeMenuOnSelect={false}
                            hideSelectedOptions={!input.isShowSelectedOptions}
                            placeholder={input.label || input.defaultValue || ''}
                        />
                    </StyledWrapper>
                </label>);
            }}
            name={input.name}
            control={control}
            defaultValue={input.value}
        />
    );
};

export default SelectMultiKey;
