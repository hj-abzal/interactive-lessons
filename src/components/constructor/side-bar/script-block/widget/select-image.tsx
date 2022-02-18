import React, {useEffect, useState} from 'react';
import {TemplateParams, WidgetProps} from './index';
import {Controller, ControllerRenderProps, FieldValues} from 'react-hook-form';
import {OnCollapsedStyles, StyledWrapper} from './common-styles';
import SelectComponent, {components} from 'react-select';
import {SelectSmallStyles} from './select';
import Icon from '@/components/icon';
import {get} from 'lodash';
import {defaultTheme} from '@/context-providers/theme/themes';
import styled from '@emotion/styled';
import images, {getImage} from '@/codgen/all-images';
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

const StyledOptionSmall = styled.div`
    position: relative;
    > div {
        height: 52px;
        display: flex;
        align-items: center;
    }

    .selected-option {
        padding-left: 20px;
        padding-right: 60px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        text-align: left;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        label {
            color: ${theme.colors.grayscale.label};
            font-size: 12px;
            b {
                color: ${theme.colors.grayscale.offBlack};
            font-size: 15px;
            }
        }
    }
    > img {
        position: absolute;
        padding: 0;
        right: 0;
        top: 4px;
        height: calc(100% - 8px);

        width: auto;
        max-width: 60px;
        border-radius: 4px;
    }
`;

const SelectImage: React.FC<any> = ({control, params}: WidgetProps) => {
    const input = params;

    return (
        <Controller
            render={({field}) => {
                return <Select field={field} params={params}/>;
            }}
            name={input.name}
            control={control}
            defaultValue={input.value}
        />
    );
};

const suggestPathItem = (input: string[], obj: Record<string, unknown>) => {
    if (!obj || Array.isArray(obj)) {
        return [];
    }
    const subTree = input?.length ? get(obj, input) : obj;

    if (!subTree || Array.isArray(subTree) || typeof subTree === 'string') {
        return [];
    }

    const suggestedKeys = Object.keys(subTree).map((k) => ({
        label: k,
        value: k,
        src: typeof subTree[k] === 'string' && subTree[k],
    }));

    return suggestedKeys;
};

function Select({field, params}: {field: ControllerRenderProps<FieldValues, any>, params: TemplateParams}) {
    const [options, setOptions] = useState<{label: string, value: string}[]>([]);

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
        const suggestions = suggestPathItem(values, images);
        setOptions(suggestions);

        const stringValue: string = value.map((val) => val.value).join('.');

        field.onChange(stringValue);
    };

    const creatableValue = typeof field.value === 'string'
        ? field.value
            .split('.')
            .filter(Boolean)
            .map((val, index, {length}) => ({label: val, value: val, isFixed: index + 1 !== length}))
        : [];

    useEffect(() => {
        handleChange(creatableValue, {action: 'setup', removedValue: null});
    }, []);

    const Option = (p) => {
        return (
            <StyledOptionSmall>
                <components.Option {...p} />
                {p.data.src && <img src={p.data.src}/>}
            </StyledOptionSmall>
        );
    };

    return <label>
        <StyledWrapper className={classNames({
            disabled: params.isDisabled,
            hidden: params.isHidden,
        })}
        css={(!field.value && !params.isTableRowMode) && OnCollapsedStyles}
        >
            <Icon size={16} glyph={params.icon} />
            {!params.isTableRowMode && params.label}
            <SelectComponent
                className={'select-path'}
                css={SelectSmallStyles}
                {...field}
                styles={styles}
                onChange={handleChange}
                components={{Option}}
                value={creatableValue}
                isDisabled={params.isDisabled}
                options={options}
                onBlur={() => {
                    if (options.length !== 0) {
                        field.onChange();
                    }
                    field.onBlur();
                }}
                formatCreateLabel={(input) => `Создать новый ${input}`}
                classNamePrefix="input-select"
                isSearchable={true}
                isMulti={true}
                isClearable={true}
                openMenuOnFocus={true}
                blurInputOnSelect={false}
                closeMenuOnSelect={false}
                noOptionsMessage={() => {
                    const image = getImage(field.value);
                    const path = (typeof field.value === 'string')
                        ? field.value.split('.')
                        : '';
                    const name = path[path.length - 1];

                    return image && <StyledOptionSmall>
                        <div className='selected-option'>
                            <label>Выбран:</label>
                            <label><b>{name}</b></label>
                        </div>
                        <img src={getImage(field.value)}/>
                    </StyledOptionSmall>;
                }}
                placeholder={'Выбор изображения'} />
        </StyledWrapper>
    </label>;
}

export default SelectImage;
