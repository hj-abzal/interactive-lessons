import React from 'react';
import SelectComponent from 'react-select';
import cl from 'classnames';
import {SelectStyles} from './css';

export type SelectItem = {
    value: string;
    label: string;
}

export type SelectProps = {
    onChange?: (val: SelectItem) => void;
    onBlur?: () => void;
    onTouch?: () => void;
    value?: SelectItem;
    options: SelectItem[];
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    isError?: boolean,
    isSearchable?: boolean,
    isClearable?: boolean,
    openMenuOnFocus?: boolean,
    noOptionsMessage?: string,
}

export const SelectInput = ({
    onChange,
    onBlur,
    onTouch,
    options,
    value,
    name,
    placeholder,
    isSearchable,
    isClearable,
    openMenuOnFocus,
    noOptionsMessage,
    disabled,
    isError,
}:SelectProps) => {
    return (
        <SelectComponent
            isError={isError}
            css={SelectStyles}
            className={cl({
                isWrong: isError,
                disabled: disabled,
            })}
            onChange={(value) => onChange ? onChange(value) : null}
            value={value}
            onMenuOpen={onTouch}
            onBlur={onBlur}
            isSearchable={isSearchable}
            isClearable={isClearable}
            openMenuOnFocus={openMenuOnFocus}
            noOptionsMessage={noOptionsMessage}
            name={name}
            classNamePrefix="input-select"
            placeholder={placeholder}
            options={options}
        />
    );
};
