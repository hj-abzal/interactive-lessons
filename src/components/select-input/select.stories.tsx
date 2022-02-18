import React, {useState} from 'react';
import {Story} from '@storybook/react';
import {SelectProps, SelectInput} from '.';
import {css} from '@emotion/react';

export default {
    component: SelectInput,
    title: 'SelectInput',
    parameters: {
        docs: {
            description: {
                component: 'SelectInput component',
            },
            source: {
                type: 'code',
            },
        },
        backgrounds: {
            default: 'light',
            values: [
                {name: 'light', value: '#F8F8F8'}
            ],
        },
    },
    argTypes: {
    },
};

export const Default: Story<SelectProps> = (args) => {
    const [value, setValue] = useState({value: 'lol', label: 'lolekus'});
    return <div css={css`
        max-width: 300px;
    `}>
        <SelectInput {...args} value={value} onChange={setValue} options={[
            {value: 'test1', label: 'test1'},
            {value: 'test2', label: 'test2'},
            {value: 'test3', label: 'test3'},
            {value: 'test4', label: 'test4'}
        ]} />
    </div>;
};
