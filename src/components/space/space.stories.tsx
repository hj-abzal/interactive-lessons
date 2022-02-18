import React from 'react';
import {Story} from '@storybook/react';
import Space, {SpaceProps} from '.';
import {css} from '@emotion/react';

export default {
    component: Space,
    title: 'Space',
    parameters: {
        docs: {
            description: {
                component: 'Space component',
            },
            source: {
                type: 'code',
            },
        },
    },
    decorators: [
        (Story) => (
            <div css={css`
                .visible {
                    background-color: #dca7ff;
                }
            `}>
                <Story/>
            </div>
        )
    ],
};

export const Default: Story<SpaceProps> = (args) =>
    <div>
        test block 1
        <Space className='visible' {...args} />
        test block 2
    </div>;
Default.args = {size: 16};

export const Horizontal: Story<SpaceProps> = (args) =>
    <div css={css`
        display: flex;
        `}>
        test block 1
        <Space className='visible' {...args} />
        test block 2
    </div>;
Horizontal.args = {size: 16};
