import React from 'react';
import {WidgetProps} from './index';
import {Controller} from 'react-hook-form';
import {css} from '@emotion/react';
import {StyledWrapper} from './common-styles';
import SelectComponent from 'react-select';
import {defaultTheme} from '@/context-providers/theme/themes';
import Icon from '@/components/icon';
import classNames from 'classnames';

const theme = defaultTheme;

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
      z-index: 80000;
      left: -32px;
      width: calc(100% + 40px);
      border-radius: 6px;
      overflow: hidden;
      padding: -0px 4px ;
      ${theme.shadows.largeDark}
    }
    
    &__option {
      color: ${theme.colors.grayscale.offBlack};
      padding: 6px 6px 6px 30px;
      border-radius: 3px;
      z-index: 80000;
      
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
      color: ${theme.colors.grayscale.placeholder};
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

const Select: React.FC<any> = ({params, control}:WidgetProps) => {
    return (
        <Controller
            render={({field}) => {
                return (<label>
                    <StyledWrapper className={classNames({
                        disabled: params.isDisabled,
                        hidden: params.isHidden,
                    })}
                    >
                        <Icon size={16} glyph={params.icon} />
                        <SelectComponent
                            css={SelectSmallStyles}
                            {...field}
                            onChange={(value) => field.onChange(value?.value)}
                            value={field.value && {label: field.value, value: field.value}}
                            options={params.options ? params.options.map((id) => ({label: id, value: id})) : []}
                            classNamePrefix="input-select"
                            noOptionsMessage={({inputValue}) => `Нет вариантов ${inputValue}...`}
                            isSearchable={true}
                            isClearable={Boolean(params.isClearable)}
                            openMenuOnFocus={true}
                            placeholder={params.label || params.defaultValue || ''}
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
export default Select;
