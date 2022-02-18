import React from 'react';
import {Story} from '@storybook/react';

export default {
    component: () => null,
    title: 'Typography',
    parameters: {
        docs: {
            description: {
                component: 'Тексты',
            },
            source: {
                type: 'code',
            },
        },
    },
};

export const Default: Story = () =>
    <div>
        <h1>H1 заголовок</h1>
        <h2>H2 заголовок</h2>
        <h3>H3 заголовок</h3>
        <h4>H3 заголовок</h4>
        <h5>H3 заголовок</h5>
        <p>P параграф</p>
        <span>span текст</span>
    </div>;
