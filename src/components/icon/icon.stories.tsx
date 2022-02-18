import React from 'react';
import {Story} from '@storybook/react';
import Icon, {IconProps} from '.';

export default {
    component: Icon,
    title: 'Icon',
    parameters: {
        docs: {
            description: {
                component: 'Icon component',
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
    },
};

const Template: Story<IconProps> = (args) => <Icon {...args} />;

export const Default = Template.bind({});
Default.args = {glyph: 'ArrowChevronDown'};
