import React, {useEffect, useMemo, useState} from 'react';
import {css} from '@emotion/react';
import {OnCollapsedStyles, StyledWrapper} from './common-styles';
import SelectComponent from 'react-select';
import {defaultTheme} from '@/context-providers/theme/themes';
import Icon from '@/components/icon';
import {
    controlLogicScriptModule,
    FullBoundStageParamData,
    StageParam
} from '@/components/constructor/script-blocks/control-logic';
import Creatable from 'react-select/creatable';
import {get} from 'lodash';
import {InputTypeType} from '@/components/constructor/side-bar/script-block/widget/types';

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

export const SelectSmallStyles = css`
   width: 100%;
   border: none;
  
  &.isWrong {
    .input-select {
      &__control,
      &__control:hover {
        border: 2px solid ${theme.colors.accent.default};
        color: ${theme.colors.accent.default};
      }
      &__menu {
        border: 2px solid ${theme.colors.accent.default};
      }
      &__option {
        &--is-selected {
          color: ${theme.colors.accent.default};
        }
      }
    }
  }
  .input-select {
    &__control {
      min-height: 25px;
      margin: -2.5px 0;
      padding: 0;
      border: none;
      background: transparent;
      cursor: inherit;
      &--is-focused,
      &--is-focused:hover {
        /* border: 2px solid ${theme.colors.primary.default}; */
        background: transparent;
        box-shadow: none;
      }
    }
    
    &__menu {
      left: -32px;
      width: calc(100% + 40px);
      border-radius: 6px;
      /* border: 2px solid transparent; */
      overflow: hidden;
      padding: -0px 4px ;
      ${theme.shadows.largeDark}
    }
    
    &__option {
      color: ${theme.colors.grayscale.offBlack};
      padding: 6px 6px 6px 30px;
      border-radius: 3px;
      
      &:hover {
        background: ${theme.colors.grayscale.background};
      }
      
      &--is-focused {
        background: ${theme.colors.grayscale.background};
      }
      
      &--is-selected {
        color: ${theme.colors.primary.default};
        font-weight: bold;
        background: ${theme.colors.primary.light};
        &:hover {
            background: ${theme.colors.primary.light};
        }
      }
    }
    
    &__placeholder {
      width: calc(100% - 10px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: 0;
    }

    &__placeholder + div {
        margin-left: 0;
    }

    &__value-container {
        padding: 0;
        min-height: 25px;
        line-height: 20px;
    }


    &__single-value {
        margin-left: 0;
    }

    &__value-container * {
        line-height: 20px;
        margin: 0;
        padding: 0;
    }

    &__indicators {
      align-items: flex-start;
      padding: 0;
    }
    &__indicator {
        padding: 0;
        margin-bottom: -3px;
        margin-top: 3px;
    }
    &__indicator-separator {
        display: none;
    }

    &__multi-value {
      position: relative;
    }

  }

  &.multi-select .input-select {
    &__multi-value {
      /* padding: 0 4px; */
      margin: 2px 4px 2px 0;
      background-color: ${theme.colors.primary.default};
      color: rgb(255, 255, 255);
      &__label {
        color: #FFF;
        margin: 0 4px;
      }
    }
  }

  &.select-path .input-select {
    &__multi-value::after {
      position: absolute;
      content: "";
      right: -5px;
      top: 1px;
      width: 0;
      border-top: 9px solid transparent;
      border-left: 6px solid ${theme.colors.primary.darkmode};
      border-bottom: 9px solid transparent;
    }

    &__multi-value:nth-last-of-type(-n+2)::after {
      border-left: 6px solid ${theme.colors.primary.default};
    }
  }
`;

type Props = {
    inputType: InputTypeType,
    inputName: string,
    availableParamsToBind: {
        [key: string]: StageParam,
    },
    boundStageParam?: FullBoundStageParamData,
    bindInputToStageParam: (params: {inputName: string, paramName?: string, tableItemPath?: string}) => void,
    getSubstate: (fieldPath: string[]) => any,
    inputLabel?: string,
}

export const BindStageParamInput = ({
    inputType,
    availableParamsToBind,
    bindInputToStageParam,
    boundStageParam,
    inputName,
    getSubstate,
}: Props) => {
    const options = useMemo(() => {
        return Object.values(availableParamsToBind)
            .filter((param) => param.simpleType === inputType || Boolean(param.tableIdRef))
            .map((param) => ({
                label: `${param.name} ${param.tableIdRef ? '(Таблица)' : ''}`,
                value: param.name,
            }));
    }, [availableParamsToBind]);

    // eslint-disable-next-line max-len
    const fieldPath = `root.scriptModulesStates.${controlLogicScriptModule.id}.tables.${boundStageParam?.tableIdRef}.items.0`;

    const subState = getSubstate(fieldPath.split('.'));

    return (
        (
            <label>
                <StyledWrapper>
                    <Icon size={16} glyph={'WorkFlower'} />

                    Привязанный параметр

                    <SelectComponent
                        css={SelectSmallStyles}
                        onChange={(option) => bindInputToStageParam({inputName, paramName: option.value})}
                        options={options}
                        value={boundStageParam && options.find((opt) => opt.value === boundStageParam.name)}
                        classNamePrefix="input-select"
                        noOptionsMessage={({inputValue}) => `Нет вариантов ${inputValue}...`}
                        isSearchable={true}
                        isClearable={true}
                        openMenuOnFocus={true}
                        placeholder={'Выберите параметр'}
                    />
                </StyledWrapper>

                {boundStageParam?.tableIdRef &&
                    <SelectPathComponent
                        searchableSubstate={subState}
                        value={boundStageParam.tableItemPath}
                        onChange={(value) =>
                            bindInputToStageParam({inputName, paramName: boundStageParam?.name, tableItemPath: value})
                        }
                    />
                }
            </label>
        )
    );
};

const typeTranslations = {
    string: 'строка',
    number: 'число',
    object: 'объект',
    undefined: 'пустой',
};

const suggestPathItem = (input: string[], obj: Record<string, unknown>) => {
    if (!obj) {
        return [];
    }
    const subTree = input?.length ? get(obj, input) : obj;

    if (!subTree) {
        return [];
    }

    if (typeof subTree !== 'object') {
        return [];
    }

    const suggestedKeys = Object.keys(subTree)
        .map((k) => ({label: `${k} (${typeTranslations[typeof subTree[k]]})`, value: k}));

    return suggestedKeys;
};

export function SelectPathComponent({
    searchableSubstate,
    onChange,
    value,
}: any) {
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

        const suggections = suggestPathItem(values, searchableSubstate);

        setOptions(suggections);

        const stringValue: string = value.map((val) => val.value).join('.');

        onChange(stringValue);
    };

    const crateableValue = typeof value === 'string'
        ? value
            .split('.')
            .filter(Boolean)
            .map((val, index, {length}) => ({label: val, value: val, isFixed: index + 1 !== length}))
        : [];

    useEffect(() => {
        handleChange(crateableValue, {action: 'setup', removedValue: null});
    }, []);

    return <label>
        <StyledWrapper css={!value && OnCollapsedStyles}>
            <Icon size={16} glyph="Constructor" />
            Путь
            <Creatable
                className={'select-path'}
                css={SelectSmallStyles}
                styles={styles}
                onChange={handleChange}
                value={crateableValue}
                options={options}
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
