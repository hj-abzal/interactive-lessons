import React from 'react';
import {Clickable} from './';
import {css} from '@emotion/react';
import {Story} from '@storybook/react';

export default {
    component: Clickable,
    title: 'Clickable',
    parameters: {
        docs: {
            description: {
                component: 'Abstract Clickable component',
            },
            source: {
                type: 'code',
            },
        },
    },
};

export const Default: Story = () => {
    return (
        <Clickable >
            Click me
        </Clickable>
    );
};

export const Div = () => {
    return (
        <Clickable >
            <div css={css`
              background-color: yellow;
              width: 60px;
              height: 60px;
            `} />
        </Clickable>
    );
};

export const Multiple = () => {
    return (
        <>
            <Clickable >
                <div css={css`
                      background-color: yellow;
                      width: 60px;
                      height: 60px;
                `} />
            </Clickable>

            <Clickable >
                <div css={css`
                  background-color: blue;
                  width: 60px;
                  height: 60px;
                `} />
            </Clickable>

            <Clickable >
                <div css={css`
                  background-color: orange;
                  width: 60px;
                  height: 60px;
                `} />
            </Clickable>
        </>
    );
};
