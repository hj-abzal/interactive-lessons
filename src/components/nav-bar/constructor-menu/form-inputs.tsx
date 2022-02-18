import {SelectInput, SelectItem} from '@/components/select-input';
import {Controller} from 'react-hook-form';
import React from 'react';
import SvelteJSONEditor from '@/components/data-editor/svelte-json-editor';

type SelectProps = {
    options: SelectItem[],
    name: string,
    value?: string,
    placeholder: string,
    control: any,
    className?: string,
}

export const SelectFormInput = ({options, name, value, placeholder, control, className}: SelectProps) => {
    return (
        <Controller
            render={({field}) => {
                return (
                    <label className={className}>
                        <SelectInput
                            {...field}
                            onChange={(value) => field.onChange(value?.value)}
                            value={field.value as any && options.find((op) => op.value === field.value)}
                            options={options}
                            isSearchable={true}
                            isClearable={true}
                            openMenuOnFocus={true}
                            placeholder={placeholder}
                        />
                    </label>
                );
            }}
            name={name}
            control={control}
            defaultValue={value}
        />
    );
};

export type JsonInputProps = {
    name: string,
    value?: any,
    control: any
}

export const JsonFormInput = ({name, value, control}: JsonInputProps) => {
    return (
        <Controller
            render={({field}) => {
                return (
                    <SvelteJSONEditor
                        json={field.value}
                        text={undefined}
                        readOnly={false}
                        navigationBar={true}
                        mainMenuBar={true}
                        onChange={(newDataJSON) => {
                            field.onChange(newDataJSON.json);
                        }}
                        isInitiallyCollapsed={true}
                    />
                );
            }}
            name={name}
            control={control}
            defaultValue={value}
        />
    );
};
