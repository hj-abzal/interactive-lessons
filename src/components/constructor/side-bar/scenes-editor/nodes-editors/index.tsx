import React, {useCallback, useEffect, useRef} from 'react';
import {NodeStructure, NodeTypeEnum, NodeWithStateType} from '@/components/scenes-manager/types';
import {NodeEditor} from './node-editor';
import {SelectItemType} from '..';
import {FlattenNodeStructure} from '@/components/constructor/side-bar/scenes-editor/helpers';
import {css} from '@emotion/react';
import {useImmerState} from '@/utils/use-immer-state';
import _ from 'lodash';
import {
    AddNodeBar,
    AppendMode,
    availableNestingByType
} from '@/components/constructor/side-bar/scenes-editor/nodes-editors/add-node-bar';

const RootComponent = ({children}: any) => (
    <>
        {children}
    </>
);

export interface NodeProps {
    parentNodeId?: string;
    nodes: {
        [nodeId: string]: NodeWithStateType;
    };
    isShowAddButtonInNested?: boolean;
    currentSceneStateSelect?: SelectItemType;
    nestingLevel?: number;
    nodeStructure: NodeStructure;
    expandedId?: string;
    setExpandedId: (id?: string) => void;
    deleteNodeById: (id: string) => void;
    flattenNodes: FlattenNodeStructure[];
    addNode: (type: NodeTypeEnum, parentNodeId?: string, nodeIndex?: number) => void;
    bottomOffset?: number,
}

export type ContextMenuState = {
    isShown: boolean,
    coords: {
        x: number,
        y: number,
    },
    nodeId?: string,
    parentId?: string,
    appendMode: AppendMode,
    menuHeight: number,
    blocked: boolean,
}

export const NodeEditors = function _NodeEditors(p: NodeProps) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);

    const contextMenuHeight = contextMenuRef.current?.getBoundingClientRect().height || 86;

    const [contextMenuState, produceContextMenuState] = useImmerState<ContextMenuState>({
        isShown: false,
        coords: {x: 0, y: 0},
        nodeId: undefined,
        parentId: undefined,
        appendMode: AppendMode.AsChild,
        menuHeight: 0,
        blocked: false,
    });

    const onNodeContextMenu = useCallback((
        e: React.MouseEvent<HTMLElement>,
        params: {
            nodeId: string,
            parentId?: string,
        }
    ) => {
        e.preventDefault();

        const {top: nodeTop} = e.currentTarget.getBoundingClientRect();
        const wrapTop = wrapRef.current?.getBoundingClientRect().top || 0;

        const nodeType = p.nodes[params.nodeId!].type;
        const isAppendAvailable = !_.isEmpty(availableNestingByType[nodeType]);

        if (!isAppendAvailable) {
            return;
        }

        produceContextMenuState((draft) => {
            draft.coords.x = e.clientX;
            draft.coords.y = nodeTop - wrapTop;
            draft.isShown = true;
            draft.nodeId = params.nodeId;
            draft.parentId = params.parentId;
            draft.blocked = true;
        });
    }, [p.nodes, produceContextMenuState]);

    const onChangeAppendMode = useCallback((mode: AppendMode) => {
        produceContextMenuState((draft) => {
            draft.appendMode = mode;
        });
    }, [produceContextMenuState]);

    const onChangeContextMenuVisibility = useCallback((isVisible: boolean) => {
        produceContextMenuState((draft) => {
            draft.isShown = isVisible;
        });
    }, [produceContextMenuState]);

    const onAddNode = useCallback((type: NodeTypeEnum) => {
        if (contextMenuState.appendMode === AppendMode.AsChild) {
            const nestedLength = p.flattenNodes.find((flattenNode) =>
                flattenNode.nodeStructure.nodeId === contextMenuState.nodeId)?.nestedLength;

            p.addNode(type, contextMenuState.nodeId!, nestedLength);
        } else if (contextMenuState.appendMode === AppendMode.SameLevel) {
            const nodeIndex = p.flattenNodes.find((flattenNode) =>
                flattenNode.nodeStructure.nodeId === contextMenuState.nodeId)?.nodeIndex;

            p.addNode(type, contextMenuState.parentId!, nodeIndex! + 1);
        }
    }, [
        contextMenuState.appendMode,
        contextMenuState.nodeId,
        contextMenuState.parentId,
        p.flattenNodes.length
    ]);

    useEffect(function unblockContextMenu() {
        setTimeout(() => {
            produceContextMenuState((draft) => {
                draft.blocked = false;
            });
        }, 300);
    }, [contextMenuState.blocked]);

    const shouldTranslateVertical = contextMenuState.isShown
        && (p.flattenNodes
            .findIndex((flatten) =>
                flatten.nodeStructure.nodeId === contextMenuState.nodeId
            ) < 3);

    const contextMenuPositionOffset = shouldTranslateVertical ? 50 : -40;
    const contextMenuPosition = contextMenuState.coords.y - contextMenuHeight / 2 + contextMenuPositionOffset;

    return <div
        ref={wrapRef}
        css={css`
          ${shouldTranslateVertical && css`
            padding-top: 90px;
          `}
          
          padding-bottom: ${p.bottomOffset}px;

          .add-node-bar {
            z-index: 100000;
            position: absolute;
            
            top: ${contextMenuPosition}px;
            left: 0px;

            max-width: 300px;
          }
        `}
    >

        {contextMenuState.isShown &&
            <div className="add-node-bar" ref={contextMenuRef}>
                <AddNodeBar
                    blocked={contextMenuState.blocked}
                    isShown={contextMenuState.isShown}
                    currentNodeType={p.nodes[contextMenuState.nodeId!]?.type}
                    currentNodeId={contextMenuState.nodeId!}
                    parentNodeId={contextMenuState.parentId}
                    parentNodeType={p.nodes[contextMenuState.parentId!]?.type}
                    addNode={onAddNode}
                    appendMode={contextMenuState.appendMode}
                    setAppendMode={onChangeAppendMode}
                    onSetVisibility={onChangeContextMenuVisibility}
                />
            </div>
        }

        {p.flattenNodes.map(({
            nodeStructure,
            depth,
            parentId,
        }) => {
            const NodeEditorComponent = nodeStructure.nodeId === NodeTypeEnum.Root ? RootComponent : NodeEditor;

            const nodeId = nodeStructure.nodeId;
            const nodeData = p.nodes[nodeId];

            if (!nodeData) {
                return null;
            }

            return (
                <NodeEditorComponent
                    key={nodeId}
                    id={nodeId}
                    parentId={parentId}
                    onContextMenu={onNodeContextMenu}
                    name={nodeData.name}
                    type={nodeData.type}
                    depth={depth}
                    isExpanded={nodeId === p.expandedId}
                    onExpand={p.setExpandedId}
                    onDelete={p.deleteNodeById}
                    currentStateName={nodeData.currentStateName}
                    isParentSelected={p.expandedId === parentId}
                    isContextMenuOpened={contextMenuState.isShown && contextMenuState.nodeId === nodeId}
                    contextMenuAppendMode={contextMenuState.appendMode}
                />
            );
        })}
    </div>;
};
