import React, {useEffect, useRef, useState} from 'react';
import {css} from '@emotion/react';
import scrollIntoView from 'scroll-into-view';
import Message from './message';
import Assistant from './assistant';
import {actionsPaddingTop, StyledChat} from './css';
import classNames from 'classnames';
import {useChat} from '@/context-providers/chat';
import {useSmartViewportWrapper} from '@/context-providers/smart-viewport-wrapper';
import {ActionInputProps, Actions} from './actions';
import {useHeightChange} from '@/utils/use-height-change';
import {round} from 'lodash';

const messageSpacing = 10;

export type ChatProps = {
  input?: ActionInputProps;
}

const Chat = ({input}: ChatProps) => {
    const {messages, buttons} = useChat();
    const {contentHeight} = useSmartViewportWrapper();
    const [messagesHeight, setMessagesHeight] = useState(0);
    const [isMessagesCollapsed, setIsMessagesCollapsed] = useState(false);

    const messagesEndRef = useRef(document.createElement('div'));
    const messagesRef = useRef(document.createElement('div'));

    const [actionsRef, chatBottomActionsHeight] = useHeightChange<HTMLDivElement>(buttons?.length);

    const scrollToBottom = () => {
        const messagesHeight = messagesRef.current.clientHeight;
        if ((messagesHeight + chatBottomActionsHeight + messageSpacing - contentHeight) > 0) {
            scrollIntoView(messagesEndRef.current, {
                time: 300,
                validTarget: function (target, parentsScrolled) {
                    return (
                        parentsScrolled < 2 &&
                        target !== window &&
                        target.matches('.scrollable')
                    );
                },
            });
        }
        setMessagesHeight(messagesRef.current.clientHeight);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const zeroOrPositive = (num) => num > 0 ? num : 0;

    return <StyledChat
        data-id="CHATT"
        className={classNames({collapsed: isMessagesCollapsed})}
        screenHeight={contentHeight}
        chatBottomActionsHeight={chatBottomActionsHeight}
    >
        <div className={'scrollable'} css={css`
          color: ${chatBottomActionsHeight};
          padding-top: ${zeroOrPositive(round(contentHeight -
          (messagesHeight + chatBottomActionsHeight +
          (chatBottomActionsHeight > 0 ? -actionsPaddingTop : 0))))}px;
          ${(messagesHeight + chatBottomActionsHeight + messageSpacing - contentHeight) > 0 && css`
            pointer-events: all;
          `}
        `}>
            <div className="messages" ref={messagesRef}>
                {messages.map((message, i) => (
                    <Message
                        key={`${message.text}-${message.tag}-${i}`} {...message}
                        onCloseClick={() => setIsMessagesCollapsed(true)}
                    />
                ))}

            </div>
            <div className="space" ref={messagesEndRef}></div>
        </div>
        {<Actions ref={actionsRef} input={input} buttons={buttons} height={chatBottomActionsHeight} />}
        <Assistant
            isVisible={isMessagesCollapsed}
            onClick={() => setIsMessagesCollapsed(false)}
            messagesCount={messages.length}
        />
    </StyledChat>;
};

export default Chat;
