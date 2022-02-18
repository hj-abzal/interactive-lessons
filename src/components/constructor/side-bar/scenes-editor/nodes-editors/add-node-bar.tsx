import Button from '@/components/button';
import Icon from '@/components/icon';
import {NodeTypeEnum} from '@/components/scenes-manager/types';
import {css, useTheme} from '@emotion/react';
import React, {useCallback, useRef, useState} from 'react';
import classNames from 'classnames';
import {Clickable} from '@/components/clickable';
import {useClickOutside} from '@/utils/use-click-outside';
import {iconGlyphByType} from './node-inputs';

type AddNodeBarProps = {
    blocked: boolean,
    currentNodeId?: string,
    currentNodeType?: NodeTypeEnum,
    parentNodeId?: string,
    parentNodeType?: NodeTypeEnum;
    addNode: (type: NodeTypeEnum) => void;
    appendMode: AppendMode,
    setAppendMode: (mode: AppendMode) => void,
    onSetVisibility: (isVisible: boolean) => void,
    isShown?: boolean,
    isRootMode?: boolean;
}

export const availableNestingByType = {
    [NodeTypeEnum.Object]: {
        [NodeTypeEnum.Object]: true,
        [NodeTypeEnum.Layer]: true,
        [NodeTypeEnum.Point]: true,
        [NodeTypeEnum.DropArea]: true,
        [NodeTypeEnum.Text]: true,
        [NodeTypeEnum.PathAnimation]: true,
        [NodeTypeEnum.StrictWrapper]: false,
    },
    [NodeTypeEnum.StrictWrapper]: {
        [NodeTypeEnum.Object]: true,
        [NodeTypeEnum.Layer]: false,
        [NodeTypeEnum.Point]: false,
        [NodeTypeEnum.DropArea]: false,
        [NodeTypeEnum.Text]: false,
        [NodeTypeEnum.PathAnimation]: false,
        [NodeTypeEnum.StrictWrapper]: false,
    },
    [NodeTypeEnum.Layer]: {
        [NodeTypeEnum.Object]: true,
        [NodeTypeEnum.Layer]: false,
        [NodeTypeEnum.Point]: true,
        [NodeTypeEnum.DropArea]: true,
        [NodeTypeEnum.Text]: true,
        [NodeTypeEnum.PathAnimation]: true,
        [NodeTypeEnum.StrictWrapper]: false,
    },
    [NodeTypeEnum.Point]: false,
    [NodeTypeEnum.DropArea]: false,
    [NodeTypeEnum.Text]: false,
    default: {
        [NodeTypeEnum.Object]: true,
        [NodeTypeEnum.Layer]: true,
        [NodeTypeEnum.Point]: true,
        [NodeTypeEnum.DropArea]: true,
        [NodeTypeEnum.Text]: true,
        [NodeTypeEnum.PathAnimation]: true,
        [NodeTypeEnum.StrictWrapper]: true,
    },
};

export enum AppendMode {
    AsChild = 'AsChild',
    SameLevel = 'SameLevel',
}

export function getNestingTypes(p: AddNodeBarProps, mode: AppendMode) {
    if (mode === AppendMode.AsChild && p.currentNodeType) {
        return availableNestingByType[p.currentNodeType];
    }

    if (mode === AppendMode.SameLevel) {
        return p.parentNodeType ?
            availableNestingByType[p.parentNodeType]
            // Обработка вставки в рут
            : availableNestingByType.default;
    }

    return {};
}

export function AddNodeBar(p: AddNodeBarProps) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const availableNesting = getNestingTypes(p, p.appendMode);

    const [hoveredNodeType, setHoveredNodeType] = useState<string | null>(null);

    useClickOutside(wrapRef, () => {
        if (p.isShown && !p.blocked) {
            p.onSetVisibility(false);
        }
    });

    const onAddNode = useCallback((type: NodeTypeEnum) => {
        if (p.blocked) {
            return;
        }

        p.addNode(type);
    }, [p.addNode, p.blocked]);

    return (
        <div
            ref={wrapRef}
            css={css`
                display: flex; 
                align-items: flex-start;
                flex-direction: column;
                background-color: ${theme.colors.grayscale.white};
                border-radius: 12px;
                pointer-events: all !important;
                padding: 0;
                
                ${theme.shadows.medium};

                .plus-icon {
                    margin: 10px 4px 10px 10px;
                }
                
                .node-types {
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: flex-start;
                  padding: 4px;

                  max-width: 100%;
                  overflow: auto;
                }
                
                .node-type {
                    padding: 0 3px 0 0;
                    > button {
                        height: 35px;
                        width: 35px;
                        min-width: 35px;
                        border-radius: 8px;

                        > svg {
                            width: 16px;
                            height: 16px;
                        }

                        &:before {
                            display: none;
                        }
                    }
                }
                .node-type:last-child {
                    padding: 0;
                }
                
                .menu-delimiter {
                  padding: 4px 0;
                  margin: 0 8px;
                  height: 25px;
                  width: 2px;
                  background-color: ${theme.colors.grayscale.input};
                }
                
                .controls-header-toggle {
                  display: flex;
                  align-items: center;
                  width: 100%;
                  padding: 4px 4px 0 4px;
                }

                .controls-header-node-name {
                    max-width: 216px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-left: 6px;
                    color: ${theme.colors.grayscale.placeholder};
                }
                
                .controls-header-toggle-item {
                  height: 35px;
                  width: 35px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-radius: 8px;
                  margin: 0;

                  &.active {
                    background-color: ${theme.colors.grayscale.input};
                  }
                }
        `}>
            <div className='controls-header-toggle'>
                {!p.isRootMode && <><Clickable
                    onClick={() => p.setAppendMode(AppendMode.SameLevel)}
                    className={classNames({
                        'controls-header-toggle-item': true,
                        active: p.appendMode === AppendMode.SameLevel,
                    })}
                >
                    <Icon
                        glyph="InsertAfter"
                        size={16}
                        color={
                            p.appendMode === AppendMode.SameLevel
                                ? theme.colors.primary.default
                                : theme.colors.grayscale.label
                        }
                    />
                </Clickable>

                <Clickable
                    onClick={() => p.setAppendMode(AppendMode.AsChild)}
                    className={classNames({
                        'controls-header-toggle-item': true,
                        active: p.appendMode === AppendMode.AsChild,
                    })}
                >
                    <Icon
                        glyph="InsertIn"
                        size={16}
                        color={
                            p.appendMode === AppendMode.AsChild
                                ? theme.colors.primary.default
                                : theme.colors.grayscale.label
                        }
                    />
                </Clickable></>}
                {p.isRootMode
                    && <Icon className='plus-icon' glyph='ActionsPlus' size={16} color={theme.colors.grayscale.line} />}
                <div className="controls-header-node-name">
                    {hoveredNodeType
                        ? p.isRootMode
                            ? hoveredNodeType
                            : `+ ${hoveredNodeType}`
                        : null}
                </div>
            </div>

            <div className="node-types">
                {Object.values(NodeTypeEnum).map((nodeType) => availableNesting[nodeType] && <div
                    className='node-type'
                    onMouseEnter={() => setHoveredNodeType(nodeType)}
                    onMouseLeave={() => setHoveredNodeType(null)}
                ><Button
                        theme='secondaryBright'
                        leftIcon={iconGlyphByType[nodeType]}
                        onClick={() => onAddNode(nodeType)}
                    /></div>)}
            </div>
        </div>
    );
}
