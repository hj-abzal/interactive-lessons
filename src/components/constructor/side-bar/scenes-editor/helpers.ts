/* eslint-disable no-loop-func */
import {
    NodeDataInputs,
    NodeStateType,
    NodeStructure,
    NodeWithStateType,
    NodeType,
    SceneStateType,
    ScenesManagerStateType
} from '@/components/scenes-manager/types';
import {original} from 'immer';
import _ from 'lodash';
import {ScenesEditorStateType} from '.';
import {DEFAULT_NODE_STATE_NAME, DEFAULT_SCENE_STATE_NAME} from './actions';
import {uneditableInputsByType} from './nodes-editors/node-inputs';

export function copyNodeIdHelper(
    currentScene: NodeStructure['nested'],
    path: string,
    newNodeId: string): NodeStructure['nested'] {
    if (currentScene) {
        const clipboard = {
            [newNodeId]: {nodeId: newNodeId},
        };
        const objEntries = Object.entries(original(currentScene) || {});
        const pathIndex = Object.keys(currentScene).indexOf(path);
        const index = pathIndex < 0 ? 0 : pathIndex + 1;
        objEntries.splice(index, 0, ...Object.entries(clipboard));
        // @ts-ignore
        return Object.fromEntries(objEntries);
    }
}

export function traverseNodeStructure(
    cb: (nodeId, path) => void,
    nodeStructure?: NodeStructure,
    path?: string
) {
    if (nodeStructure) {
        const nodeId = nodeStructure.nodeId;
        cb(nodeId, path);
        if (nodeStructure.nested) {
            Object.keys(nodeStructure.nested).forEach((nodeId) => {
                const newPath = path ? `${path}.nested.${nodeId}` : `nested.${nodeId}`;
                traverseNodeStructure(cb, nodeStructure.nested?.[nodeId], newPath);
            });
        }
    }
}

export function getNodeBaseData(nodeData: NodeDataInputs) {
    return {
        id: nodeData.id,
        name: nodeData.name,
        type: nodeData.type,
        nodeStatesIds: nodeData.nodeStatesIds,
        currentStateId: nodeData.currentStateId,
        isEditing: nodeData.isEditing,
        interactionTag: nodeData.interactionTag,
    } as NodeType;
}

const excludedInState = [
    'id',
    'name',
    'type',
    'nodeStatesIds',
    'currentStateId',
    'currentStateName',
    'isEditing',
    'interactionTag'
];

export function getNodeStateData(
    defaultNodeState: NodeStateType,
    prevNodeState: NodeStateType,
    nodeData: NodeDataInputs
) {
    const excludedInNotDefaultNodeState = uneditableInputsByType[nodeData.type].disabledOnOverride;

    let mergedNodeData = {};

    const newNodeState = _.mapValues(nodeData, (inputValue, inputName) => {
        if (excludedInState.includes(inputName) || (
            nodeData.currentStateName !== DEFAULT_NODE_STATE_NAME
            && excludedInNotDefaultNodeState.includes(inputName)
        )) {
            return undefined;
        }
        return inputValue;
    });
    mergedNodeData = _.mergeWith(prevNodeState, newNodeState, (objValue, srcValue) => {
        return !_.isNil(srcValue) ? srcValue : objValue;
    });
    return mergedNodeData as NodeStateType;
}

export function getNodeWithStateParams(p:{
    nodeData: NodeType;
    nodesStates: Record<string, NodeStateType>;
    optionalNodeStateId?: string;
    isIgnoreNodeStateId?: boolean;
}): NodeWithStateType {
    const nodesStatesIds = p.nodeData.nodeStatesIds;

    const nodeStateId = p.isIgnoreNodeStateId
        ? (p.optionalNodeStateId || '')
        : (p.nodeData.currentStateId || p.optionalNodeStateId || '');

    const defaultNodeStateId = nodesStatesIds?.find((nodeStateId) =>
        p.nodesStates[nodeStateId]?.name === DEFAULT_NODE_STATE_NAME);

    const nodeStateName = p.nodesStates[nodeStateId]?.name;

    const nodeStateData = nodeStateName === DEFAULT_NODE_STATE_NAME
        ? p.nodesStates[nodeStateId]
        : _.merge({},
            defaultNodeStateId ? p.nodesStates[defaultNodeStateId] : {},
            p.nodesStates[nodeStateId]
        );

    const nodeWithStateData = {
        ...p.nodeData,
        ...nodeStateData,
        id: p.nodeData.id,
        name: p.nodeData.name,
        isEditing: p.nodeData.isEditing,
        interactionTag: p.nodeData.interactionTag,
        currentStateName: nodeStateName,
        currentStateId: nodeStateId,
        nodeStatesIds: nodesStatesIds,
    } as NodeWithStateType;

    return nodeWithStateData;
}

export function getNodesWithStateParamsFromSceneState(
    nodes: Record<string, NodeType>,
    nodesStatesIds: SceneStateType['nodesStatesIds'],
    nodesStates: Record<string, NodeStateType>,
    isIgnoreNodeStateId?: boolean
) {
    return _.mapValues(nodes, (node, nodeId: string) => {
        const nodeStateId = nodesStatesIds?.[nodeId];
        return getNodeWithStateParams({
            nodeData: node,
            nodesStates: nodesStates,
            optionalNodeStateId: nodeStateId,
            isIgnoreNodeStateId: isIgnoreNodeStateId,
        });
    });
}

export const updateSceneStatesOnDraft = (draft: ScenesManagerStateType) => {
    const scenesStates = draft.scenesStates;

    const defaultSceneStateId = Object.keys(scenesStates)
        .find((sceneId) => scenesStates[sceneId].name === DEFAULT_SCENE_STATE_NAME);

    if (defaultSceneStateId) {
        const defaultSceneState = scenesStates[defaultSceneStateId];

        _.mapValues(scenesStates, (sceneState, sceneStateId) => {
            _.mapValues(defaultSceneState.nodesStatesIds, (nodeId, nodeStateId) => {
                if (!sceneState.nodesStatesIds[nodeId]) {
                    draft.scenesStates[sceneStateId].nodesStatesIds[nodeId] = nodeStateId;
                }
            });
        });
    }
};

export type FlattenNodeStructure = {
    nodeStructure: NodeStructure,
    depth: number,
    path: string,
    parentId: string | null,
    nodeIndex: number,
    nestedLength: number,
}

export const flattenNodeStructure = (nodeStructure: NodeStructure): FlattenNodeStructure[] => {
    const stack: FlattenNodeStructure[] = [{
        nodeStructure,
        depth: 0,
        parentId: null,
        path: 'root',
        nodeIndex: 0,
        nestedLength: Object.keys(nodeStructure.nested || {}).length,
    }];

    const result: any = [];

    while (stack.length) {
        const current = stack.pop();

        if (!current?.nodeStructure) {
            return [];
        }

        result.push(current);

        if (nodeStructure.nested) {
            stack.push(
                ...Object.values(current.nodeStructure.nested || {})
                    .map((nested, i) => ({
                        nodeStructure: nested,
                        depth: current.depth + 1,
                        path: `${current.path}.nested.${nested.nodeId}`,
                        parentId: current.nodeStructure.nodeId,
                        nodeIndex: i,
                        nestedLength: Object.keys(nested.nested || {}).length,
                    }))
                    .reverse()
            );
        }
    }

    return result;
};

export function getCloseFlattenNodeId(
    flattenNodes: FlattenNodeStructure[],
    editor: ScenesEditorStateType,
    isPrev: boolean
) {
    const expandedIdNodeIndex = flattenNodes.findIndex((f) => f.nodeStructure.nodeId === editor.expandedId);

    if (expandedIdNodeIndex > 0) {
        const expandedIdNodeNext = flattenNodes[expandedIdNodeIndex + (isPrev ? -1 : 1)];
        if (expandedIdNodeNext) {
            return expandedIdNodeNext?.nodeStructure.nodeId;
        }
    }
}
