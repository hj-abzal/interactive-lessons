import React from 'react';
import {Story} from '@storybook/react';
import Button, {ButtonProps} from '.';

export default {
    component: Button,
    title: 'Button',
    parameters: {
        docs: {
            description: {
                component: 'Button component',
            },
            source: {
                type: 'code',
            },
        },
    },
};

export const Primary: Story<ButtonProps> = (args) =>
    <Button theme="primary" {...args} >Click me</Button>;

export const Secondary: Story<ButtonProps> = (args) =>
    <Button theme="secondary" {...args} >Click me</Button>;

export const PrimaryWithIcon: Story<ButtonProps> = (args) =>
    <Button theme="primary" rightIcon="ArrowChevronForward" {...args} >Click me</Button>;
