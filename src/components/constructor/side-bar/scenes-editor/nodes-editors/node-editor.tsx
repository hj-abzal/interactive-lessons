import React from 'react';
import {NodeTypeEnum} from '@/components/scenes-manager/types';
import {iconGlyphByType} from './node-inputs';
import {css, useTheme} from '@emotion/react';
import Icon from '@/components/icon';
import {Clickable} from '@/components/clickable';
import {AppendMode} from '@/components/constructor/side-bar/scenes-editor/nodes-editors/add-node-bar';

type NodeObjectEditorProps = {
  id: string;
  parentId?: string | null,
  name: string,
  type: NodeTypeEnum;
  isExpanded?: boolean;
  depth: number;
  onExpand: (id?: string) => void;
  onDelete: (id: string) => void;
  currentStateName?: string,
  isParentSelected?: boolean,
  isContextMenuOpened?: boolean,
  contextMenuAppendMode: AppendMode,
  onContextMenu: (
      e: React.MouseEvent<HTMLDivElement>,
      params: {nodeId: string, parentId?: string}
  ) => void,
};

const getAppendIndicatorWidth = (params: {mode: AppendMode, isShown?: boolean}) => {
    if (!params.isShown) {
        return 0;
    }

    if (params.mode === AppendMode.AsChild) {
        return 50;
    }

    return 100;
};

export const NodeEditor = React.memo(function NodeEditor(p: NodeObjectEditorProps) {
    const theme = useTheme();

    return (
        <div
            onClick={() => !p.isExpanded ? p.onExpand(p.id) : p.onExpand(undefined)}
            onContextMenu={(e) =>
                p.onContextMenu(e, {
                    nodeId: p.id,
                    parentId: p.parentId || undefined,
                })
            }
            css={css`
                margin-left: ${(p.depth - 1) * 14}px;
                position: relative;
                pointer-events: all !important;
                display: flex;
                cursor: pointer;
                margin-bottom: 2px;
                position: relative;
                border-radius: 8px;
                
                .content {
                    padding: 0 8px;
                    border-radius: 6px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: relative;
                }
    
                &:first-of-type {
                  margin-top: 12px;
                }
                
                .node-icon {
                  margin-right: 8px;
                }
                    
                .node-name {
                    font-size: 14px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    transition: 0.3s ease;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    transition: 0.3s ease;
                    color: ${p.isExpanded ? theme.colors.primary.default : theme.colors.grayscale.ash};
                    pointer-events: auto;
                }
                
                .node-actions {
                  right: 0;
                  visibility: hidden;
                  opacity: 0;
                  pointer-events: none;
                  padding-right: 4px;
                }

                .node-action { 
                  border-radius: 6px;
                  padding: 4px;
                  background-color: ${theme.colors.grayscale.input};
                  transition: .1s ease-in-out;
                  &:hover {
                      background-color: ${theme.colors.grayscale.white};
                  }
                }
                
                .state-name {
                  font-size: 12px;
                  padding: 4px;
                  //background: ${theme.colors.grayscale.input};
                  color: ${theme.colors.grayscale.label};
                  white-space: nowrap;
                  margin-left: 4px;
                  max-width: 300px;
                }
                
                .left-content {
                  display: flex;
                  align-items: center;
                }
                
                .right-content {
                  display: flex;
                  position: absolute;
                  right: 0;
                }
              
                &:hover {
                  background-color: ${theme.colors.grayscale.input};
                
                  .node-actions {
                      visibility: visible;
                      opacity: 1;
                      pointer-events: all;
                      z-index: 1000;
                  }
                  
                }
                
                &:focus {
                  opacity: 0.8;
                }
                
                &:active {
                  opacity: 0.8;
                }
                
                .level-marker {
                  display: ${p.depth > 1 ? 'block' : 'none'};
                  position: absolute;
                  top: -2px;
                  left: -1px;
                  height: 110%;
                  width: 1px;
                  background-color: ${p.isParentSelected ? theme.colors.primary.default : 'transparent'};
                }
                
                .appending-indicator {
                    position: absolute;
                    bottom: -2px;
                    height: 2px;
                    right: 0;
                    pointer-events: none;
                    background-color: ${theme.colors.primary.default};
                    transition: width 0.2s ease-in-out;
                    width: ${getAppendIndicatorWidth({mode: p.contextMenuAppendMode, isShown: p.isContextMenuOpened})}%;
                }
            `}
        >

            <div className='level-marker' />

            <div className="content">
                <div className="left-content">
                    <Icon
                        className={'node-icon'}
                        size={12}
                        glyph={iconGlyphByType[p?.type]}
                        color={
                            p.isExpanded
                                ? theme.colors.primary.default
                                : theme.colors.grayscale.label
                        }
                    />

                    <div className="node-name">
                        {p.name}
                    </div>

                    <div className="state-name">
                        ●&nbsp;&nbsp;{p.currentStateName}
                    </div>
                </div>

                <div className="right-content">
                    <div className="node-actions">
                        <Clickable
                            className='node-action'
                            onClick={() => p.onDelete(p.id)}
                        >
                            <Icon
                                className={'node-шсщт'}
                                size={16}
                                glyph="Delete"
                                color='red'
                            />
                        </Clickable>
                    </div>
                </div>
            </div>
            <div className='appending-indicator' />
        </div>);
});
