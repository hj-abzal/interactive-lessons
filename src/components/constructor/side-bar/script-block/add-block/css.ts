import {InputStyles} from '@/components/select-input/css';
import styled from '@emotion/styled';
import {scriptBlockStyles} from '../index';

export const AddBlockWrapper = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s ease;
    transition-delay: .05s;
    margin: 0;

    height: 20px;
    &:hover {
        height: 56px;
        .plus-button {
            transform: scale(1);
            opacity: 1;
        }
    }


    &.is-full-width {
        height: 56px;
        margin: 20px 0 0 0;
        margin-top: 20px;
    }

    &.is-open {
        height: 300px;
        margin: 20px 0;
        display: block;
        ${scriptBlockStyles}
    }

    &.is-full-height {
        height: calc(100vh - 180px);
        margin-bottom: -10px;
    }

    .full-button {
        width: 100%;
    }
    .add-block_header {
        padding: 6px 6px 2px 6px;
        height: 54px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        overflow-x: auto;
        &::-webkit-scrollbar {
            display: none;
        }
        -ms-overflow-style: none;
        scrollbar-width: none;
        input {
            ${InputStyles}
            width: 120px;
            height: 42px;
            border-radius: 8px;
            margin-right: 8px;
        }
        > button {
            &:not(:last-of-type) {
                margin-right: 4px;
            }
            > .scriptModule-tab {
                padding: 12px;
                white-space: nowrap;
                border-radius: 6px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: ${(p) => p.theme.colors.grayscale.input};
                > span {
                    color: ${(p) => p.theme.colors.grayscale.offBlack};
                    margin: 0 4px;
                }
            }
        }
        
    }
    .add-block_content {
        padding: 2px 6px 6px 6px;
        overflow-y: auto;
        position: absolute;
        top: 54px;
        left: 0;
        right: 0;
        bottom: 0;
        button {
            display: flex;
            align-items: center;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 2px;
            transition: 0.3s ease;
            transition-delay: .05s;
            width: 100%;
            background: ${(p) => p.theme.colors.grayscale.input};
            &:hover {
                background: ${(p) => p.theme.colors.grayscale.line};
            }
            .item-icon {
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                padding: 8px;
                margin: -6px;
                margin-right: 8px;

                box-shadow: 0px 1px 3px rgba(37, 51, 79, 0.38);
                border-radius: 6px;
            }
        }
    }
    .plus-button {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: 0.3s ease;
        transition-delay: .05s;
        transform: scale(0.1);
        .button {
            padding: 8px;
            background-color: ${(p) => p.theme.colors.primary.default};
            border-radius: 100%;
            ${(p) => p.theme.shadows.mediumDark};
        }
    }
`;
