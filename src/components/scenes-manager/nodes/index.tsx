import React, {useMemo} from 'react';
import {BasicNodeType, NodeStructure, NodeTypeEnum, NodeWithStateType} from '../types';
import {NodeEditorOverlay} from './node-editor-overlay';
import {nodeByType} from './nodes';

const RootComponent = ({children}: any) => (
    <>
        {children}
    </>
);

export interface NodeProps {
    nodes: {
        [nodeId: string]: NodeWithStateType;
    };
    nodeStructure: NodeStructure,
    getInteractionListeners: (nodeId: string, nodeData: NodeWithStateType, interactionTag?: string) => void;
    isParentHidden?: boolean,
}

export const Node = React.memo(function NodesMemo(p: NodeProps) {
    const nodeId = p.nodeStructure.nodeId;
    const getCurrentInteractionListeners = useMemo(() => {
        return () =>
            p.getInteractionListeners(nodeId, p.nodes[nodeId]);
    }, [p.getInteractionListeners, nodeId, p.nodes[nodeId]]);

    const {nodeData, NodeComponent, isHidden} = useMemo(() => {
        if (p.nodeStructure.nodeId === NodeTypeEnum.Root) {
            return {
                isHidden: false,
                nodeData: {
                    id: NodeTypeEnum.Root,
                    name: NodeTypeEnum.Root,
                    type: NodeTypeEnum.Root,
                    nodeStatesIds: [],
                    currentStateId: '',
                    isEditing: false,
                } as BasicNodeType,
                NodeComponent: RootComponent,
            };
        } else {
            return {
                isHidden: p.isParentHidden || (p.nodes[p.nodeStructure.nodeId] as any)?.isHidden,
                nodeData: p.nodes[p.nodeStructure.nodeId],
                NodeComponent: p.nodes[p.nodeStructure.nodeId] && nodeByType[p.nodes[p.nodeStructure.nodeId].type],
            };
        }
    }, [p.nodeStructure.nodeId, p.nodes[p.nodeStructure.nodeId]]);

    if (!NodeComponent) {
        return null;
    }

    return (
        <NodeComponent
            getCurrentInteractionListeners={getCurrentInteractionListeners}
            {...nodeData}
            isHidden={isHidden}
        >
            {p.nodeStructure.nested && Object.keys(p.nodeStructure.nested).map((nestedId) => (
                <Node
                    key={nestedId}
                    getInteractionListeners={p.getInteractionListeners}
                    nodeStructure={p.nodeStructure.nested?.[nestedId] as NodeStructure}
                    nodes={p.nodes}
                    isParentHidden={isHidden}
                />
            ))}
            {(nodeData.type && nodeData.isEditing) && (
                <NodeEditorOverlay
                    editingNodeId={p.nodeStructure.nodeId}
                    type={nodeData.type}
                    isActive={Boolean(nodeData.isEditing)}
                />
            )}
        </NodeComponent>
    );
});
