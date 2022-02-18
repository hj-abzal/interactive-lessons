import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StagesFlowEditorWrapper} from './css';
import {ActionType, StageNode, StageNodeType} from './node';
import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
import {useImmerState} from '@/utils/use-immer-state';
import {
    DndContext,
    useSensor,
    MouseSensor,
    TouchSensor,
    KeyboardSensor,
    useSensors,
    useDroppable
} from '@dnd-kit/core';
import {useTheme} from '@emotion/react';
import {uniq} from 'lodash';
import {ConstructorScenarioState, useConstructorScenario} from '@/context-providers/constructor-scenario';
import {connectFullScript} from '../script-blocks/lib';
import mergeRefs from '@/utils/merge-refs';
import scrollIntoView from 'scroll-into-view';
import {useLocationSearchParams} from '@/utils/use-location-query';
import {InputTypeType} from '@/components/constructor/side-bar/script-block/widget/types';

type ConnectionType = {
    start: string;
    end: string;
    isActive?: boolean;
}

const defaultCoordinates = {
    x: 0,
    y: 0,
};

const activationConstraint = {
    distance: 15,
};

const gridSize = 20;
const charSize = 8;

const initialTranslate = defaultCoordinates;

function getActionsConnections(stageId, globalState: ConstructorScenarioState) {
    const actions = [] as ActionType[];
    const connections = [] as ConnectionType[];

    let width = stageId.length * charSize;
    let height = 82;

    globalState.stages[stageId].forEach((blockData) => {
        const fullScript = connectFullScript(blockData, globalState.availableScriptBlocks);
        Object.keys(fullScript?.inputs || {}).forEach((inputName) => {
            if (fullScript.inputs[inputName].type === InputTypeType.stage) {
                const endStageId = blockData.inputValues[inputName];
                const actionId = `${fullScript.data.dataId}-${inputName}`;
                const startActionId = `${stageId}-${actionId}`;
                const hasEnd = globalState.stages[endStageId] !== undefined;

                actions.push({
                    id: actionId,
                    name: fullScript.inputs[inputName].label,
                    isConnected: hasEnd,
                });

                if (hasEnd && fullScript.inputs[inputName].label.length * charSize > width) {
                    width = fullScript.inputs[inputName].label.length * charSize;
                }

                if (hasEnd) {
                    height += 64;
                }

                if (hasEnd) {
                    connections.push({
                        start: startActionId,
                        end: endStageId,
                    });
                }
            }
        });
    });

    return {actions, connections, width, height};
}

export const StagesFlowEditor = () => {
    const theme = useTheme();

    const {state: globalState, produceState: produceGlobalState} = useConstructorScenario();

    const [isRendered, setIsRendered] = useState<boolean>(false);

    const [canvasSize, setCanvasSize] = useState({width: 0, height: 0});

    const [initialWindowScroll, setInitialWindowScroll] = useState(
        defaultCoordinates
    );

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint,
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint,
    });

    const keyboardSensor = useSensor(KeyboardSensor, {});
    const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

    const updateXarrow = useXarrow();

    const scrollableContainerRef = useRef<HTMLDivElement>(null);

    const [flowState, produceFlowState] = useImmerState<{
        nodes: StageNodeType[];
        connections: ConnectionType[];
    }>({
        nodes: [],
        connections: [],
    });

    const nodeConnectionsRefs = useRef<HTMLDivElement[]>([]);

    const {setNodeRef} = useDroppable({
        id: 'stages-editor',
    });

    const [queryParams, setSearchParams] = useLocationSearchParams<{[s:string]: string}>();

    // TODO: remove this logic from this component
    const setCurrentEditorStage = (stage) => produceGlobalState((draft) => {
        draft.constructor.currentStage = stage;
        const locationCurrentStage = queryParams.get('stage');
        if (locationCurrentStage !== stage) {
            setSearchParams({stage: stage});
        }
    });

    useEffect(function setNodeConnectionsRefsEff() {
        nodeConnectionsRefs.current = nodeConnectionsRefs.current.slice(0, flowState.nodes.length);
    }, [flowState.nodes]);

    useEffect(function produceNodesToLocalState() {
        if (globalState.stages) {
            produceFlowState((draft) => {
                // const rowHeights = {};
                const [firstNode, ...stagesNodes] = Object.keys(globalState.stages).map((stageId) => ({
                    stageId,
                    ...getActionsConnections(stageId, globalState),
                }));

                const stack = [firstNode];
                const sortedNodes: any = [];
                const sortedNodesIds = {};

                while (stack.length) {
                    const node: any = stack.pop();

                    const unresolvedConnections = {};

                    if (sortedNodesIds[node.stageId]) {
                        continue;
                    }

                    sortedNodes.push(node);
                    sortedNodesIds[node.stageId] = true;
                    unresolvedConnections[node.stageId] = false;

                    node?.connections.forEach((connection) => {
                        if (connection.end && !sortedNodesIds[connection.end]) {
                            unresolvedConnections[connection.end] = true;
                        }
                    });

                    let nextNodes: any = stagesNodes.filter((node) => {
                        return unresolvedConnections[node.stageId] && !sortedNodesIds[node.stageId];
                    });

                    if (nextNodes.length === 0) {
                        const someNode = stagesNodes.find((node) => !sortedNodesIds[node.stageId]);
                        nextNodes = someNode ? [someNode] : null;
                    }

                    if (nextNodes?.length) {
                        const toPush = nextNodes
                            .filter((n) => !sortedNodesIds[n.stageId])
                            .sort((a, b) => b.connections.length - a.connections.length);

                        stack.push(...toPush);
                    }
                }

                const rowHeights = [0] as number[];

                let prevWidth = 0;
                let prevHeight = 0;
                let prevX = 0;
                let prevY = 0;
                // let prevConnections = [] as ConnectionType[];
                let maxX = 0;
                let maxY = 0;

                draft.nodes = sortedNodes.map((x) => {
                    const {actions, connections, width, height, stageId} = x;

                    const connectedActions = actions.filter((act) => act.isConnected);

                    if (draft.connections.some((connection) => connection.start === stageId)) {
                        rowHeights.push(0);
                    }

                    const rowIndex = rowHeights.length - 1;

                    const rowHeight = rowHeights[rowIndex] || 0;

                    const hasConnections = connectedActions.length;

                    const translate = {
                        x: prevX + prevWidth + 130,
                        y: prevY + (connectedActions.length ? prevHeight : 80) + 20,
                    };

                    prevWidth = hasConnections ? width : prevWidth;
                    prevHeight = height;
                    prevX = hasConnections ? translate.x : prevX + 20;
                    prevY = translate.y;

                    maxX = translate.x + 520 > maxX ? translate.x + 520 : maxX;
                    maxY = translate.y + height + 20 > maxY ? translate.y + height + 20 : maxY;

                    const node = {
                        id: stageId,
                        name: stageId,
                        translate: translate,
                        initialTranslate: translate,
                        actions: actions,
                    };

                    rowHeights[rowIndex] = rowHeight + height + 20;

                    draft.connections = uniq(draft.connections.concat(connections));

                    return {
                        ...node,
                        ...(!node.translate ? {translate: initialTranslate} : {}),
                        ...(!node.initialTranslate
                            ? node.translate
                                ? {initialTranslate: node.translate}
                                : {initialTranslate: initialTranslate}
                            : {}
                        ),
                    };
                });

                draft.nodes.forEach((node) => {
                    node.isConnected = draft.connections.some((c) => c.end === node.id);
                });

                setCanvasSize({
                    width: maxX,
                    height: maxY,
                });
                setIsRendered(true);
            });
        }
    }, [globalState.stages]); //Object.keys(globalState.stages).join()

    const onDragStart = useCallback(
        () => {
            setInitialWindowScroll({
                x: window.scrollX + (scrollableContainerRef.current?.scrollLeft || 0),
                y: window.scrollY + (scrollableContainerRef.current?.scrollTop || 0),
            });
        },
        [
            window.scrollX,
            window.scrollY,
            scrollableContainerRef.current?.scrollTop,
            scrollableContainerRef.current?.scrollLeft
        ]
    );

    const onDragMove = useCallback(
        ({active, delta}) => {
            const index = flowState.nodes.findIndex((node) => node.id === active.id);
            const translate = {
                x: (flowState.nodes[index].initialTranslate?.x || 0) + delta.x - initialWindowScroll.x,
                y: (flowState.nodes[index].initialTranslate?.y || 0) + delta.y - initialWindowScroll.y,
            };
            updateXarrow();
            produceFlowState((draft) => {
                draft.nodes[index].translate = translate;
            });
        },
        [flowState.nodes]
    );

    const onDragEnd = useCallback(
        ({active}) => {
            updateXarrow();
            produceFlowState((draft) => {
                const index = flowState.nodes.findIndex((node) => node.id === active.id);
                const translate = {
                    x: Math.round((draft.nodes[index].translate?.x || 0) / gridSize) * gridSize,
                    y: Math.round((draft.nodes[index].translate?.y || 0) / gridSize) * gridSize,
                };
                draft.nodes[index].translate = translate;
                draft.nodes[index].initialTranslate = translate;
            });
            setInitialWindowScroll(defaultCoordinates);
        },
        [flowState.nodes]
    );

    const onHoverAction = (actionId, isHovered) => {
        produceFlowState((draft) => {
            const connectedActionIds = [] as string[];
            draft.connections.forEach((connection) => {
                if (connection.end === actionId || connection.start === actionId) {
                    connectedActionIds.push(connection.end);
                    connectedActionIds.push(connection.start);
                    if (isHovered) {
                        connection.isActive = true;
                    } else {
                        connection.isActive = false;
                    }
                }
            });
            uniq(connectedActionIds).forEach((actionId) => {
                draft.nodes.forEach((node) => {
                    if (node.id === actionId) {
                        if (isHovered) {
                            node.isActive = true;
                        } else {
                            node.isActive = false;
                        }
                    }
                    node.actions?.forEach((action) => {
                        const actionCombinedId = `${node.id}-${action.id}`;
                        if (actionCombinedId === actionId) {
                            if (isHovered) {
                                action.isActive = true;
                            } else {
                                action.isActive = false;
                            }
                        }
                    });
                });
            });
        });
    };

    const onClickAction = (actionId) => {
        const stageToSet = flowState.connections.find((c) => c.start === actionId)?.end;

        if (stageToSet) {
            setCurrentEditorStage(stageToSet);
        }
    };

    useEffect(() => {
        const index = flowState.nodes.findIndex((node) => node.id === globalState.constructor.currentStage);
        const ref = nodeConnectionsRefs.current[index];
        scrollIntoView(ref, {
            time: 300,
            validTarget: function (target, parentsScrolled) {
                return (
                    parentsScrolled < 2 &&
                target !== window &&
                target.matches('.flow-editor')
                );
            },
        });
    }, [globalState.constructor.currentStage, isRendered]);

    return <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        onDragCancel={({active}) => {
            updateXarrow();
            produceFlowState((draft) => {
                const index = flowState.nodes.findIndex((node) => node.id === active.id);
                draft.nodes[index].translate = flowState.nodes[index].initialTranslate;
            });
            setInitialWindowScroll(defaultCoordinates);
        }}
        // modifiers={[restrictToWindowEdges]}
    >
        <StagesFlowEditorWrapper className='flow-editor' ref={mergeRefs([setNodeRef, scrollableContainerRef])}>
            <div className="content" style={canvasSize}>
                <Xwrapper>
                    {flowState.nodes.map((node, index) =>
                        <StageNode
                            key={node.id}
                            id={node.id}
                            name={node.name}
                            isActive={node.isActive}
                            isConnected={node.isConnected}
                            actions={node.actions}
                            translate={node.translate}
                            initialTranslate={node.initialTranslate}
                            isCurrent={node.id === globalState.constructor.currentStage}
                            ref={(el: HTMLDivElement) => {
                                nodeConnectionsRefs.current[index] = el;
                            }}
                            onHoverAction={onHoverAction}
                            onClickAction={onClickAction}
                            setCurrentEditorStage={setCurrentEditorStage}
                        />)}
                    {flowState.connections.map((connection, index) =>
                        <Xarrow
                            key={`${connection.start}-${connection.end}-${index}`}
                            start={connection.start}
                            end={connection.end}
                            showHead={false}
                            startAnchor={'right'}
                            endAnchor={'left'}
                            curveness={0.8}
                            zIndex={connection.isActive ? 1 : 0}
                            animateDrawing={false}
                            color={connection.isActive ? theme.colors.primary.default : theme.colors.grayscale.line}
                        />
                    )}
                </Xwrapper>
            </div>
        </StagesFlowEditorWrapper>

    </DndContext>;
};
