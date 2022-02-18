import {css} from '@emotion/react';
import {defaultTheme} from '@/context-providers/theme/themes';

const theme = defaultTheme;

export const InputStyles = css`
  cursor: pointer;
  width: 100%;
  border: 2px solid transparent;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 15px;
  outline: none;
  font-family: Ubuntu, sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 25px;
  background: ${theme.colors.grayscale.white};
  transition: 0.2s;
  color: ${theme.colors.grayscale.ash};
  
  ${theme.shadows.medium};
  
  &::placeholder {
    color: #b5b9c7;
  }
  
  :hover {
    border: 2px solid ${theme.colors.grayscale.line};
  }
  
  :focus {
    border: 2px solid ${theme.colors.primary.default};
    background: ${theme.colors.grayscale.white};
  }
  
  &.isWrong {
    border: 2px solid ${theme.colors.accent.default};
    color: ${theme.colors.accent.default};
  }
  
  &.isCorrect {
    border: 2px solid ${theme.colors.primary.default};
    color: ${theme.colors.primary.default};
  }
`;

export const SelectStyles = css`
  width: 100%;
  
  &.disabled {
    pointer-events: none;

    .input-select {
      &__control {
        background-color: ${theme.colors.grayscale.input};
      }
    }
  }
  
  &.isWrong {
    .input-select {
      &__control,
      &__control:hover {
        border: 2px solid ${theme.colors.accent.default};
        color: ${theme.colors.accent.default};
      }
      &__menu {
        border: 2px solid ${theme.colors.accent.default};
      }
      &__option {
        &--is-selected {
          color: ${theme.colors.accent.default} !important;
        }
      }
    }
  }
  
  .input-select {
    &__control {
      ${InputStyles}
      padding: 4px 4px;
      height: 48px;
      &--is-focused,
      &--is-focused:hover {
        border: 2px solid ${theme.colors.primary.default};
        background: #fff;
        box-shadow: none;
      }
    }
    
    &__menu {
      z-index: 80000;
      top: 44px;
      border-radius: 12px;
      border: 2px solid transparent;
      padding: 2px 6px;
      ${theme.shadows.largeDark}
    }
    
    &__option {
      color: ${theme.colors.grayscale.offBlack};
      padding: 18px 16px;
      border-radius: 8px;
      z-index: 80000;
      
      &:hover {
        background: ${theme.colors.primary.light};
      }
      
      &--is-focused {
        background: ${theme.colors.primary.light};
      }
      
      &--is-selected {
        color: ${theme.colors.grayscale.offWhite};
        font-weight: bold;
        background: ${theme.colors.primary.default};
        &:hover {
            background: ${theme.colors.primary.default};
        }
      }
    }
    
    &__indicator-separator {
        display: none;
    }

    &__placeholder {
      width: calc(100% - 10px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

export const SelectStylesSideBar = css`
  ${SelectStyles}
  .input-select {
    &__menu {
      left: -52px;
      width: calc(100% + 104px);
      border-radius: 16px;
      &-list {
          max-height: min(60vh, 800px);
      }
    }
  }
`;

export const SelectStylesSideBarWithoutLeftAction = css`
  ${SelectStyles}
  .input-select {
    &__menu {
      left: 0;
      width: calc(100% + 52px);
      border-radius: 16px;
      &-list {
          max-height: min(60vh, 800px);
      }
    }
  }
`;
