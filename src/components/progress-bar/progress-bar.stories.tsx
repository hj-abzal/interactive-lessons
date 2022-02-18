import React from 'react';
import {Story} from '@storybook/react';
import ProgressBar, {ProgressBarProps} from '.';
import {css} from '@emotion/react';

export default {
    component: ProgressBar,
    title: 'ProgressBar',
    parameters: {
        docs: {
            description: {
                component: 'ProgressBar component',
            },
            source: {
                type: 'code',
            },
        },
    },
    argTypes: {
        withLabel: {
            control: {
                type: 'boolean',
            },
        },
        value: {
            control: {
                type: 'range',
                min: 0,
                max: 100,
            },

        },
        color: {
            control: {type: 'color'},
        },
    },
};

export const Default: Story<ProgressBarProps> = (args) => {
    return <div css={css`
        max-width: 300px;
    `}>
        <ProgressBar {...args} />
    </div>;
};
