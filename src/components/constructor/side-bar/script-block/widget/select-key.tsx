import Icon from '@/components/icon';
import React from 'react';
import {Controller} from 'react-hook-form';
import SelectComponent from 'react-select';
import Creatable from 'react-select/creatable';
import {InputValues, WidgetProps} from './index';
import {StyledWrapper} from './common-styles';
import {SelectSmallStyles} from './select';
import classNames from 'classnames';
import {ConstructorScenarioState} from '@/context-providers/constructor-scenario';

export const suggestKeysItems = (
    obj: Record<string, any>,
    valueName: string,
    getSubstate,
    inputValues,
    searchableFilter?: (item, itemKey, globalState: ConstructorScenarioState, inputValues: InputValues) => boolean
) => {
    if (!obj) {
        return [];
    }
    const suggestedKeys = Object.keys(obj).map(
        (k) => {
            let val = '';
            if (valueName) {
                if (obj[k] && obj[k][valueName]) {
                    val = obj[k][valueName];
                } else {
                    return null;
                }
            } else {
                if (typeof obj[k] === 'string') {
                    val = obj[k];
                } else {
                    val = k;
                }
            }

            if (searchableFilter) {
                const globalState = getSubstate('root');
                if (!searchableFilter(val, k, globalState, inputValues)) {
                    return null;
                }
            }
            return {label: val, value: val};
        }).filter(Boolean);

    return suggestedKeys;
};

const SelectKey: React.FC<any> = ({control, params, getSubstate}: WidgetProps) => {
    const options = suggestKeysItems(
        params?.searchable,
        params?.valueName,
        getSubstate,
        params.inputValues,
        params.searchableFilter
    );
    const Component = params.isCreatable ? Creatable : SelectComponent;

    return (
        <Controller
            render={({field}) => {
                return (<label>
                    <StyledWrapper className={classNames({
                        disabled: params.isDisabled,
                        hidden: params.isHidden,
                    })}>
                        <Icon size={16} glyph={params.icon} />
                        {!params.isTableRowMode && params.label}
                        <Component
                            css={SelectSmallStyles}
                            {...field}
                            onChange={(value) => field.onChange(value?.value)}
                            value={field.value
                                ? {label: field.value, value: field.value}
                                : (params.autoSelectFirst && options[0])} // TODO: run onChange with first value on init
                            options={options || []}
                            isDisabled={params.isDisabled}
                            classNamePrefix="input-select"
                            noOptionsMessage={({inputValue}) => `Нет вариантов ${inputValue}...`}
                            isSearchable={true}
                            isCreatable={Boolean(params.isCreatable)}
                            isClearable={Boolean(params.isClearable)}
                            formatCreateLabel={(input) => `Создать новое ${input}`}
                            onCreateOption={(option) => {
                                field.onChange(option);
                            }}
                            openMenuOnFocus={true}
                            placeholder={params.placeholder || params.label || params.defaultValue || ''}
                        />
                    </StyledWrapper>
                </label>);
            }}
            name={params.name}
            control={control}
            defaultValue={params.value}
        />
    );
};

export default SelectKey;
