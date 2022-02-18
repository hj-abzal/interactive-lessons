import React from 'react';
import {Story} from '@storybook/react';
import Card, {CardProps} from './';

export default {
    component: Card,
    title: 'Card',
    parameters: {
        docs: {
            description: {
                component: 'Card component',
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
};

export const Default: Story<CardProps> = (args) =>
    <div>
        <Card {...args} >
            test content 1
            <br/>
            test content 2
            <br/>
            test content 3
            <br/>
            test content 4
            <br/>
        </Card>
    </div>;
