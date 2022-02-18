import React, {useEffect, useState} from 'react';
import {TemplateParams, WidgetProps} from './index';
import {Controller, ControllerRenderProps, FieldValues} from 'react-hook-form';
import {OnCollapsedStyles, StyledWrapper} from './common-styles';
import Creatable from 'react-select/creatable';
import {SelectSmallStyles} from './select';
import Icon from '@/components/icon';
import {get} from 'lodash';
import {defaultTheme} from '@/context-providers/theme/themes';
import classNames from 'classnames';

const theme = defaultTheme;

const styles = {
    multiValue: (base, state) => {
        const styles = {
            ...base,
            backgroundColor: theme.colors.primary.darkmode,
            borderRadius: '4px !important',
            marginRight: '8px !important',
            padding: '0 4px !important',
        };
        return state.data.isFixed
            ? styles
            : {
                ...styles,
                backgroundColor: theme.colors.primary.default,
            };
    },
    multiValueLabel: (base, state) => {
        return state.data.isFixed
            ? {...base, fontWeight: 'medium', color: 'white', paddingRight: 6}
            : {...base, fontWeight: 'medium', color: 'white', paddingRight: 6};
    },
    multiValueRemove: (base, state) => {
        return state.data.isFixed ? {...base, display: 'none'} : {...base, display: 'none'};
    },
};

const SelectPath: React.FC<any> = ({control, params}: WidgetProps) => {
    const input = params;

    return (
        <Controller
            render={({field}) => {
                return <SelectPathComponent field={field} params={params}/>;
            }}
            name={input.name}
            control={control}
            defaultValue={input.value}
        />
    );
};

const suggestPathItem = (input: string[], obj: Record<string, unknown>) => {
    if (!obj) {
        return [];
    }
    const subTree = input?.length ? get(obj, input) : obj;
    if (!subTree) {
        return [];
    }
    const suggestedKeys = Object.keys(subTree).map((k) => ({label: k, value: k}));
    return suggestedKeys;
};

export function SelectPathComponent(
    {
        field,
        params,
    }: {
        field: ControllerRenderProps<FieldValues, any>,
        params: TemplateParams
    }
) {
    const [options, setOptions] = useState<{label: string, value: string}[]>([]);
    // const {produceModuleState} = useConstructorScenario();

    const handleChange = (value, {action, removedValue}) => {
        switch (action) {
            case 'remove-value':
            case 'pop-value':
                if (!removedValue || removedValue.isFixed) {
                    return;
                }
                break;
            case 'clear':
                break;
        }
        const values: string[] = value.map((val) => val.value).filter(Boolean);
        const suggections = suggestPathItem(values, params?.searchable);
        setOptions(suggections);

        const stringValue: string = value.map((val) => val.value).join('.');

        field.onChange(stringValue);
    };

    const crateableValue = typeof field.value === 'string'
        ? field.value
            .split('.')
            .filter(Boolean)
            .map((val, index, {length}) => ({label: val, value: val, isFixed: index + 1 !== length}))
        : [];

    useEffect(() => {
        handleChange(crateableValue, {action: 'setup', removedValue: null});
    }, []);

    return <label>
        <StyledWrapper className={classNames({
            disabled: params.isDisabled,
            hidden: params.isHidden,
        })}
        css={(!field.value && !params.isTableRowMode) && OnCollapsedStyles}
        >
            <Icon size={16} glyph={params.icon} />
            {!params.isTableRowMode && params.label}
            <Creatable
                className={'select-path'}
                css={SelectSmallStyles}
                {...field}
                styles={styles}
                onChange={handleChange}
                value={crateableValue}
                options={options}
                onCreateOption={(option) => {
                    const path = crateableValue.map((v) => v.value).filter(Boolean);
                    path.push(option);
                    field.onChange(path.join('.'));
                    params.addValueToState(path, null);
                }}
                formatCreateLabel={(input) => `Создать новый ${input}`}
                classNamePrefix="input-select"
                isSearchable={true}
                isMulti={true}
                isClearable={true}
                openMenuOnFocus={true}
                blurInputOnSelect={false}
                closeMenuOnSelect={false}
                noOptionsMessage={({inputValue}) => `Нет вариантов ${inputValue}...`}
                placeholder={'Путь к данным'} />
        </StyledWrapper>
    </label>;
}

export default SelectPath;
