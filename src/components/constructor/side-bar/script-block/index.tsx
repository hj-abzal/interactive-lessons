/* eslint-disable max-len */
import React from 'react';
import {Clickable} from '@/components/clickable';
import Icon from '@/components/icon';
import {defaultTheme} from '@/context-providers/theme/themes';
import {css, useTheme} from '@emotion/react';
import classNames from 'classnames';
import {ScriptBlockInputs} from './inputs';
import {ScriptBlockFull} from '@/components/constructor/script-blocks/types';
import {StageParam} from '@/components/constructor/script-blocks/control-logic';

const theme = defaultTheme;

export const scriptBlockStyles = css`
    position: relative;
    border-radius: 12px;
    background-color: ${theme.colors.grayscale.white};
    ${theme.shadows.small};
`;

export const ScriptBlock = ({
    index,
    block,
    deleteScriptBlock,
    onChange,
    isSelected,
    onSelect,
    dragHandleProps,
    bindInputToStageParam,
    availableParamsToBind,
    isDragging,
    getSubstate,
    addValueToState,
}: {
    index: number;
    block: ScriptBlockFull;
    onChange: (newData) => void;
    deleteScriptBlock: (ind: number) => void,
    getSubstate: (fieldPath: string[]) => any,
    bindInputToStageParam: (params: {inputName: string, paramName?: string, tableItemPath?: string}) => void,
    availableParamsToBind?: {
        [name: string]: StageParam,
    },
    isSelected: boolean;
    onSelect: (id: string) => void;
    addValueToState: (path: string, value: any) => void,
    dragHandleProps: any;
    isDragging: boolean;
}) => {
    const theme = useTheme();

    const hasInputs = Object.keys(block.inputs || {}).length > 0;
    const isBlocked = block.isBlocked;

    return (
        <div css={css`
            ${scriptBlockStyles};
            transition: box-shadow 0.5s ease;
            user-select: none;
            ${block.data.isHighlighted
            ? css`
                background-color: lightyellow;
            `
            : css`
                transition: background-color 0.5s ease, box-shadow 0.5s ease;
                background-color: white;
            `};
            
            ${isDragging && css`
                ${theme.shadows.large};
            `}

            &::after {
                content: "";
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                border-radius: 12px;
                transition: 0.3s ease;
                pointer-events: none;
                border: 2px solid ${theme.colors.primary.default};
                opacity: 0;
            }

            ${isSelected && css`
                &::after {
                    opacity: 1;
                }
            `}

            .script-block_header {
                padding: 10px 14px;
                background: ${block.color || theme.colors.primary.default};
                border-radius: 12px 12px 0 0;
                /* height: 42px; */
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                outline: none;
                > span {
                    color: #FFF;
                    line-height: 24px;
                    width: 100%;
                }
                &.no-inputs {
                    border-radius: 12px;
                }
                &.selected {
                    border: 2px solid red;
                }
                ${isBlocked && css`
                    pointer-events: none;
                `}
            }
            
            .script-block_content {
                padding: 6px 6px 4px 6px;
                hr {
                    border: none;
                    color: ${theme.colors.grayscale.input};
                    background-color: ${theme.colors.grayscale.input};
                    height: 2px;
                    margin: 0 8px 2px 8px;
                }
            }
        `}
        >
            <div
                className={classNames({
                    'script-block_header': true,
                    'no-inputs': !hasInputs,
                })}
                onClick={(event: MouseEvent) => {
                    if (event.defaultPrevented) {
                        return;
                    }
                    event.preventDefault();

                    onSelect(block.data.dataId);
                }}

                {...dragHandleProps}
            >
                {block.icon && <Icon
                    css={css`margin: 2px 6px 0 0;`}
                    size={20}
                    glyph={block.icon}
                    color={theme.colors.grayscale.white}
                />}
                <span>{block.title}
                    {block.isRunOnChangeInput &&
                    <svg style={{margin: '2px -2px -1px 2px'}} width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.0513493 10.6886C-0.0983933 10.8483 0.107966 11.0803 0.303739 10.9723L9.90169 5.6796C10.0417 5.60239 10.0298 5.40983 9.88116 5.34819L5.73359 3.62794L8.89155 0.312507C9.04307 0.15343 8.83712 -0.0804231 8.64054 0.0274902L1.51794 3.93744C1.38793 4.0088 1.38606 4.18365 1.51452 4.25743L4.48296 5.96216L0.0513493 10.6886Z" fill="currentColor"/>
                    </svg>}
                </span>
                {!isBlocked && <Clickable onClick={() => deleteScriptBlock(index)}>
                    <Icon glyph={'CloseX'} color={theme.colors.transparent.white40} />
                </Clickable>}
            </div>
            {hasInputs && [block.data.dataId].map((id) => (
                <ScriptBlockInputs
                    bindInputToStageParam={bindInputToStageParam}
                    availableParamsToBind={availableParamsToBind}
                    key={id}
                    inputs={block.inputs}
                    inputValues={block.data.inputValues}
                    boundStageParams={block.data.boundStageParams}
                    getSubstate={getSubstate}
                    addValueToState={addValueToState}
                    onChange={onChange}
                />
            ))}
        </div>

    );
};
