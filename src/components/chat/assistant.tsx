import React from 'react';
import styled from '@emotion/styled';
import {keyframes} from '@emotion/react';
import {assistantImageBase64} from './assistant-image';
import classNames from 'classnames';

// eslint-disable-next-line max-len

export const AssistantSpacing = 10;

export const floatingRotate = keyframes`
  0% {
    transform: rotate(-10deg);
  }

  50% {
    transform: rotate(10deg);
  }

  100% {
    transform: rotate(-10deg);
  }
`;

const StyledAssistant = styled.div`
  position: absolute;
  bottom: 16px;
  left: 20px;
  width: 64px;
  height: 64px;
  background-color: ${(p) => p.theme.colors.primary.default};
  border-radius: 50%;
  cursor: pointer;
  opacity: 1;
  transform: translate(0, 0) scale(1.001) rotate(0deg);
  pointer-events: all;

  transition: 0.3s ease;
  ${(p) => p.theme.shadows.blueGlow};

  &:hover {
    transform: scale(1.1);
  }

  &.hidden {
    opacity: 0;
    transform: translate(-30px, 30px) scale(0.2) rotate(90deg);
  }


  .assistant-avatar-image {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: 0.5s ease;
    background-image: url("data:image/png;base64,${assistantImageBase64}");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    animation: ${floatingRotate} 10s infinite ease both;
  }

  .assistant-messages-counter {
    position: absolute;
    right: -4px;
    top: -4px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(p) => p.theme.colors.grayscale.white};
    border-radius: 12px;
    background-color: ${(p) => p.theme.colors.accent.default};
    font-size: 15px;
    ${(p) => p.theme.shadows.redGlowBottomLeft};
  }
`;

export type AssistantProps = {
  messagesCount?: number;
  isVisible?: boolean;
  onClick?: () => void;
}

const Assistant = ({onClick, isVisible, messagesCount}: AssistantProps) => {
    return <StyledAssistant className={classNames({hidden: !isVisible})} onClick={onClick}>
        <div className="assistant-avatar-image"></div>
        {messagesCount ? <div className="assistant-messages-counter">{messagesCount}</div> : <></>}
    </StyledAssistant>;
};

export default Assistant;
