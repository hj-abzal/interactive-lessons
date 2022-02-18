/* eslint-disable max-len */
import {Translate} from '@dnd-kit/core';
import {css} from '@emotion/react';
import styled from '@emotion/styled';

export const StageNodeWrapper = styled.div<{
  translateXY?: Translate;
  isDragging?: boolean;
  isCurrent?: boolean;
}>`
  position: absolute;
  background-color: white;
  border-radius: 16px;
  user-select: none;
  display: flex;
  align-items: center;
  flex-direction: column;
  transition: 0.1s ease, left 0.5s ease, top 0.5s ease;
  padding: 6px;
  border: 2px solid ${(p) => p.isCurrent ? p.theme.colors.primary.default : 'transparent'};
  
  left: ${(p) => p.translateXY?.x ?? 0}px;
  top: ${(p) => p.translateXY?.y ?? 0}px;
  
  z-index: ${(p) => p.isDragging ? 10 : 9};
  ${(p) => p.isDragging ? p.theme.shadows.largeDark : p.theme.shadows.medium};
  ${(p) => p.isDragging && css`
      pointer-events: none;
      transition: 0.1s ease, left 0s linear, top 0s linear;
  `}

  .action {
    padding: 8px 30px;
    position: relative;
    width: 100%;
    border-radius: 10px;
    white-space: nowrap;
    &.expand {
      color: ${(p) => p.theme.colors.grayscale.label};
      &:hover {
        color: ${(p) => p.theme.colors.primary.default};
      }
      text-align: center;
      > svg {
        margin: 3px 0 -3px 4px;
        display: inline-block;
      }
    }
    .connector {
      position: absolute;
      top: calc(50% - 6px);
      width: 12px;
      height: 12px;
      border-radius: 6px;
      border: 3px solid ${(p) => p.theme.colors.grayscale.line};
      background-color: transparent;
      &.connected {
        border: 3px solid transparent;
        background-color: ${(p) => p.theme.colors.grayscale.line};
      }
      &-left {
        left: 8px;
      }
      &-right {
        right: 8px;
      }
    }

    &.active, &:hover {
      .connector {
        border: 3px solid ${(p) => p.theme.colors.primary.default};
        background-color: transparent;
        &.connected {
          border: 3px solid transparent;
          background-color: ${(p) => p.theme.colors.primary.default};
        }
      }
    }
    &:hover {
      background-color: ${(p) => p.theme.colors.primary.light};
    }

    &.header {
      font-weight: 500;
      cursor: pointer;
      &:hover {
        .connector-right {
          opacity: 1;
        }
      }
      .connector-right {
        width: 16px;
        height: 16px;
        margin-top: -2px;
        color: ${(p) => p.theme.colors.primary.default};
        opacity: 0;
        background-color: transparent;
        border: none;
      }
    }
  }
`;
