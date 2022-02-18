import React, {useEffect} from 'react';
// import AspectRatioProvider from '../smart-viewport-wrapper';
import {Story} from '@storybook/react';
import Chat, {ChatProps} from '.';
import {css} from '@emotion/react';
import {useChat} from '@/context-providers/chat';

export default {
    component: Chat,
    title: 'Chat',
    parameters: {
        docs: {
            description: {
                component: 'Chat component',
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

export const Default: Story<ChatProps> = (args) => {
    const {messages, sendMessage, typeMessage, clearMessages, blurMessages} = useChat();
    useEffect(() => {
        sendMessage({
            text: 'first message',
        });
    }, []);
    return (
        <div css={css`
                .dev-buttons {
                    padding: 20px;
                    position: absolute;
                    top: 0;
                    right: 0;
                    z-index: 10000;
                    & > div {
                        background-color: lightblue;
                        margin-bottom: 10px;
                        padding: 20px;
                        user-select: none; 
                        cursor: pointer;
                        &:hover {
                            background-color: lightskyblue;
                        }
                    }
                }
            `}>
            <div className="dev-buttons">
                <div onClick={() => {
                    sendMessage({
                        text: messages.length % 3 === 0 ? `test test test test test test 
                            test test test test test test test test test test test test test 
                            test test test test test test test test test` : 'hello world',
                        isRight: messages.length % 2 !== 0,
                    });
                }}>add message</div>

                <div onClick={() => {
                    typeMessage({
                        delay: 1500,
                        text: messages.length % 3 === 0 ? `test test test test test test 
                            test test test test test test test test test test test test test 
                            test test test test test test test test test` : 'hello world',
                        isRight: messages.length % 2 !== 0,
                    });
                }}>type message</div>

                <div onClick={async () => {
                    const msgs = [{
                        text: 'message initially blurred without tags',
                        isRight: true,
                        isBlurred: true,
                        delay: 500,
                    }, {
                        text: 'message with tag = "tag1"',
                        tag: 'tag1',
                        delay: 1000,
                    }, {
                        text: 'message although with tag = "tag1"',
                        tag: 'tag1',
                        delay: 1000,
                    }, {
                        text: 'message with tag = "tag2"',
                        tag: 'tag2',
                        delay: 2000,
                    }, {
                        text: 'message although with tag = "tag2"',
                        tag: 'tag2',
                        delay: 1000,
                    }];
                    await typeMessage(msgs[0]);
                    await typeMessage(msgs[1]);
                    await typeMessage(msgs[2]);
                    await typeMessage(msgs[3]);
                    await typeMessage(msgs[4]);
                }}>add messages pack</div>
                <div onClick={() => {
                    clearMessages();
                }}>clear all</div>
                <div onClick={() => {
                    blurMessages();
                }}>blur all</div>
                <div onClick={() => {
                    clearMessages('tag1');
                }}>clear all with tag = &quot;tag1&quot;</div>
                <div onClick={() => {
                    clearMessages('tag2');
                }}>clear all with tag = &quot;tag2&quot;</div>
                <div onClick={() => {
                    blurMessages('tag1');
                }}>blur all with tag = &quot;tag1&quot;</div>
            </div>
            <Chat {...args} />
        </div>);
};
Default.args = {};
