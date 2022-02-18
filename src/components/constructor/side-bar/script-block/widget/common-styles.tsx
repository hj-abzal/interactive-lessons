import {defaultTheme} from '@/context-providers/theme/themes';
import {css} from '@emotion/react';
import styled from '@emotion/styled';
const theme = defaultTheme;

export const OnCollapsedStyles = css`
    & > div {
    transition: .2s ease;
    opacity: 1;
    height: 25px;
    }

    &:not(:focus-within) > div,
    &:not(:focus-within) > input,
    &:not(:focus-within) > textarea {
        opacity: 0;
        height: 0;
        pointer-events: none;
    }
`;

export const StyledButton = styled.button`
    display: block;
    width: 100%;
    min-height: 25px;
    margin-top: 4px;
    border: none;
    outline: none;
    border-radius: 4px;
    background-color: ${theme.colors.primary.default};
    color: ${theme.colors.grayscale.white};
    font-family: Ubuntu, sans-serif;
    font-weight: 500;
    font-size: 15px;
    line-height: 20px;
    padding: 3px 0;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        background-color: ${theme.colors.primary.dark};
    }
    &:focus {
        border: none;
    }
`;

export const StyledWrapper = styled.div`
    position: relative;
    cursor: pointer;
    width: 100%;
    border: 1px solid transparent;
    box-sizing: border-box;
    border-radius: 6px;
    
    line-height: 20px;
    padding: 8px 8px 8px 30px;

    margin-bottom: 2px;
    outline: none;
    font-family: Ubuntu, sans-serif;
    font-weight: 500;
    font-size: 15px;
    transition: 0.2s;
    background: transparent;
    color: ${theme.colors.grayscale.placeholder};

    > svg {
        position: absolute;
        left: 8px;
        top: 9px;
    }

    > span {
        min-height: 25px;
        padding: 3px 0;
        color: ${theme.colors.grayscale.placeholder};
        font-weight: 500;
        font-size: 15px;
        line-height: 20px;
    }
    
    
    :hover {
        background: ${theme.colors.grayscale.input};
        color: ${theme.colors.grayscale.label};
        /* border: 2px solid ${theme.colors.grayscale.line}; */
        > span {
            color: ${theme.colors.grayscale.label};
        }
    }
    
    :focus-within {
        border: 1px solid ${theme.colors.primary.default};
        background: ${theme.colors.grayscale.input};
    }
    
    &.isWrong {
        border: 1px solid ${theme.colors.accent.default};
        color: ${theme.colors.accent.default};
    }
    
    &.isCorrect {
        border: 1px solid ${theme.colors.primary.default};
        color: ${theme.colors.primary.default};
    }
    input, textarea {
        display: block;
        width: 100%;
        min-height: 25px;
        margin: -2.5px 0;
        border: none;
        outline: none;
        background-color: transparent;
        font-family: Ubuntu, sans-serif;
        font-weight: 500;
        font-size: 15px;
        line-height: 20px;
        padding: 3px 0;
        &::placeholder {
            color: ${theme.colors.grayscale.line};
        }
        &:focus {
            border: none;
        }
    }

    &.disabled {
        background: transparent;
        color: ${theme.colors.grayscale.placeholder};
        cursor: default;
        opacity: 0.5;
    }

    &.hidden {
        display: none;
    }

    &.no-icon {
        padding: 8px;
    }
`;
