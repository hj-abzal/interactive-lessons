import styled from '@emotion/styled';
export const actionsPaddingBottom = 20;
export const actionsPaddingTop = 10;

type Props = {
    chatBottomActionsHeight: number;
    screenHeight: number;
};

export const StyledChat = styled.div<Props>`
    height: 100%;
    width: 400px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1000;
    pointer-events: none;
    &.collapsed {
      .scrollable {
          transform:  translate(-40%,  40vh) scale(0.1);
          opacity: 0;
          pointer-events: none;
      }
      .actions {
        transform: translateY(-100%);
        &.active {
          transform: translateX(80px) translateY(0%);
        }
      }
    }
    .scrollable {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: ${(p) => p.chatBottomActionsHeight ? p.chatBottomActionsHeight - actionsPaddingTop : 0}px;
      overflow-y: scroll;
      transition: 0.3s ease;
      overflow-y: auto;
  
      
      // It blocks background blur for messages in Chrome(
      mask-image: linear-gradient(
          0deg,
          rgba(255, 255, 255, 1) 0%,
          rgba(255, 255, 255, 0) 100%
        ),
        linear-gradient(
          0deg,
          rgba(255, 255, 255, 1) 0%,
          rgba(255, 255, 255, 1) 100%
        ),
        linear-gradient(
          0deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 1) 100%
        );
      mask-mode: alpha;
      mask-position: center 50px, center 120px, center bottom;
      mask-size: 100% 120px,100% calc(100% - 140px),100% 20px;
      mask-repeat: no-repeat;
  
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .messages {
      display: flex;
      flex-direction: column;
      padding: 0 20px 10px 20px;
    }
    .actions {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      pointer-events: all;
      transition: 0.3s ease;
      transition-delay: height 0.1s;
      transform: translateY(100%);
      padding: 0;
      &.active {
        transform: translateY(0%);
      }
    }
    .space {
      display: flex;
      min-height: 0px;
    }
    .content {
      display: inline-block;
      border-radius: 16px;
      background-color: ${(p) => p.theme.colors.grayscale.white};
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.16);
      padding: 20px;
    }
`;
