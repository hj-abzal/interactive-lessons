import React, {ReactNode, useEffect, useState} from 'react';
import styled from '@emotion/styled';
import classNames from 'classnames';
import {keyframes} from '@emotion/react';
import Markdown from 'markdown-to-jsx';

export const messageSpacing = 10;

const blinkAnimation = keyframes`
  50% {
    opacity: 0.5;
  }
`;

const StyledMessage = styled.div`
  padding: 20px;
  background-color: ${(p) => p.theme.colors.grayscale.white};
  transition: 0.3s ease;
  position: relative;
  align-self: flex-start;
  margin: 0 20px ${messageSpacing}px 0;
  border-radius: 28px 28px 28px 6px;
  pointer-events: all;
  ${(p) => p.theme.shadows.medium};
  ${(p) => p.theme.effects.bgBlur};
  
  opacity: 0;
  transform: scale(0.5) translateX(-100px);

  & > span, & > p {
    line-height: 24px;
    font-size: 15px;
    font-weight: normal;
  }
  
  em {
    font-style: italic;
  }

  &.right {
    align-self: flex-end;
    margin: 0 0 ${messageSpacing}px 20px;
    border-radius: 28px 28px 6px 28px;
    transform: scale(0.5) translateX(100px);
  }
  &.shown {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
  &.blurred {
    background-color: ${(p) => p.theme.colors.transparent.light40};
    ${(p) => p.theme.shadows.none};
    & > span {
      color: ${(p) => p.theme.colors.transparent.dark65};
    }
  }
  &.clickable {
    cursor: pointer;
  }
  .close {
    position: absolute;
    display: flex;
    overflow: hidden;
    cursor: pointer;
    opacity: 0;
    right: -4px;
    top: -4px;
    padding: 5px;
    border-radius: 16px;
    max-width: 22px;
    height: 22px;
    transition: 0.2s ease;
    background-color: ${(p) => p.theme.colors.error.default};
    color: ${(p) => p.theme.colors.grayscale.white};
    ${(p) => p.theme.shadows.redGlowBottomLeftLight};
    > span {
      margin: 0 16px 0 6px;
      font-size: 12px;
      color: white;
      transition: 0.2s ease;
      opacity: 0;
    }
    > svg {
      position: absolute;
      right: 0;
      top: 4px;
      width: 22px;
      height: 14px;
      background: linear-gradient(270deg, rgba(232, 68, 97, 1) 60%, rgba(232, 68, 97, 0) 100%);
    }
    &:hover {
      max-width: 84px;
      > span {
        opacity: 0.9;
      }
    }
  }
  &:hover {
    .close {
      opacity: 1;
    }
  }
  .typing-indicator {
    span {
      height: 15px;
      width: 15px;
      float: left;
      margin: 0 1px;
      background-color: #9E9EA1;
      display: block;
      border-radius: 50%;
      opacity: 0.2;
      &:nth-of-type(1) {
        animation: 1s ${blinkAnimation} infinite 0.333s;
      }
      &:nth-of-type(2) {
        animation: 1s ${blinkAnimation} infinite 0.666s;
      }
      &:nth-of-type(3) {
        animation: 1s ${blinkAnimation} infinite 0.999s;
      }
    }
  }
`;

export type MessageProps = {
    text: string;
    asHtml?: boolean,
    asMarkdown?: boolean,
    tag?: string | number;
    isRight?: boolean;
    isBlurred?:boolean;
    isTyping?:boolean;
    delay?: number;
    onCloseClick?: ()=>void;
    onTypingClick?: ()=>void;
    onMessageClick?: ()=>void;
}

export type TextEntryProps = {
    text?: ReactNode,
    asHtml?: boolean,
    asMarkdown?: boolean
};

const TextEntry = ({
    text = null,
    asHtml,
    asMarkdown,
}: TextEntryProps) => {
    if (asHtml && typeof text === 'string') {
        return <span dangerouslySetInnerHTML={{__html: text}} />;
    }

    if (asMarkdown && text) {
        // Странные типы у MarkDown
        // @ts-ignore
        return <Markdown>{text}</Markdown>;
    }

    return <span>{text}</span>;
};

const Message = ({
    text,
    isRight,
    isBlurred,
    isTyping,
    onCloseClick,
    onTypingClick,
    onMessageClick,
    asMarkdown,
    asHtml,
}: MessageProps) => {
    const [isShown, setIsShown] = useState(false);
    useEffect(() => {
        setIsShown(true);
    }, []);
    return <StyledMessage
        onClick={isTyping ? onTypingClick : (onMessageClick || undefined)}
        className={classNames({
            shown: isShown,
            right: isRight,
            blurred: isBlurred,
            clickable: isTyping || Boolean(onMessageClick),
        })}>
        {isTyping
            ? <div className="typing-indicator">
                <span />
                <span />
                <span />
            </div>
            : <TextEntry text={text} asHtml={asHtml} asMarkdown={asMarkdown} />
        }
        {!isTyping && <div className="close" onClick={() => onCloseClick && onCloseClick()}>
            <span>скрыть</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.5 3.5L11 11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3.5 11L11 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>

        </div>}
    </StyledMessage>;
};

export default Message;
