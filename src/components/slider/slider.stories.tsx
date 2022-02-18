import React, {useState} from 'react';
import {Story} from '@storybook/react';
import Slider, {SliderProps} from '.';
import {css} from '@emotion/react';

export default {
    component: Slider,
    title: 'Slider',
    parameters: {
        docs: {
            description: {
                component: 'Slider component',
            },
            source: {
                type: 'code',
            },
        },
    },
    argTypes: {
        color: {
            control: {type: 'color'},
        },
        step: {
            control: {
                type: 'range',
                min: 0,
                max: 50,
            },

        },
        min: {
            control: {
                type: 'range',
                min: 0,
                max: 100,
            },

        },
        max: {
            control: {
                type: 'range',
                min: 100,
                max: 200,
            },

        },
    },
};

export const Default: Story<SliderProps> = (args) => {
    const [value, setValue] = useState(50);
    return <div css={css`
        max-width: 300px;
    `}>
        <Slider {...args} value={value} onChange={setValue} />
        <br/>
        <br/>
        {value}
    </div>;
};
