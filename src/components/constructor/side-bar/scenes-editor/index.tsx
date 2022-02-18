import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {commonNodesStatesIds, commonNodeStates, NodeTypeEnum, ScenesManagerStateType, SceneType}
    from '@/components/scenes-manager/types';
import {SelectStylesSideBarWithoutLeftAction} from '@/components/select-input/css';
import {OptionWithMenu} from '@/components/select-input/option-with-menu';
import {useConstructorScenario} from '@/context-providers/constructor-scenario';
import {logger} from '@/utils/logger';
import {useImmerState} from '@/utils/use-immer-state';
import classNames from 'classnames';
import _ from 'lodash';
import Creatable from 'react-select/creatable';
import {scenesManager} from '../../script-blocks/scenes-manager';
import {ActionContext, actions} from './actions';
import {flattenNodeStructure, getCloseFlattenNodeId, getNodesWithStateParamsFromSceneState} from './helpers';
import {NodeEditors} from './nodes-editors';
import SideButton from './side-button';
import {NodeForm} from '@/components/constructor/side-bar/scenes-editor/nodes-editors/node-form';
import {AddNodeBar, AppendMode} from './nodes-editors/add-node-bar';

export const initEmptyState: ScenesManagerStateType = {
    currentScenesIds: [],
    scenes: {},
    scenesStates: {},
    nodes: {},
    nodesStates: commonNodeStates,
    commonNodesStatesIds: commonNodesStatesIds,
    currentPopupScenes: [],
    interactionTags: [],
    dropTags: [],
    sceneEventTasks: [],
    onSceneEvent: () => null,
};

export const initEmptyScene: SceneType = {
    name: 'scene',
    currentSceneStateId: undefined,
    nodeStructure: {
        nodeId: NodeTypeEnum.Root,
    },
    sceneStatesIds: [],
};

export type SelectItemType = {
    label: string;
    value: string;
}

export type ScenesEditorStateType = {
    isLaunched?: boolean;
    currentSceneSelect?: SelectItemType;
    availableScenesSelect?: SelectItemType[];
    currentSceneStateSelect?: SelectItemType;
    currentSceneStatesSelect?: SelectItemType[];
    expandedId?: string;
}

export const ScenesEditor = (p: {
    disabled?: boolean;
}) => {
    const {
        state: globalState,
        produceState: produceGlobalState,
        scenesData,
        saveScenesData,
    } = useConstructorScenario();

    const moduleState: ScenesManagerStateType = globalState.scriptModulesStates[scenesManager.id];
    const produceModuleState = useMemo(() =>
        (draftCb: (draft:ScenesManagerStateType) => void, disableSyncToScriptBlock?: boolean) => {
            produceGlobalState((old) => {
                const draftModuleState = old.scriptModulesStates[scenesManager.id];
                if (draftModuleState) {
                    draftCb(draftModuleState);
                }
            });
            if (!disableSyncToScriptBlock) {
                saveScenesData();
                logger.info('Saving to stages:', draftCb);
            }
        }, [produceGlobalState, moduleState]);

    const [editor, produceEditorState] = useImmerState<ScenesEditorStateType>({});

    const [nodeFormAvoidingOffset, setNodeFormAvoidingOffset] = useState(300);

    const onNodeFormHeightChange = useMemo(() => {
        const onChangeFn = (height) => {
            setNodeFormAvoidingOffset(Math.max(height, 300));
        };

        return _.debounce(onChangeFn, 300);
    }, [setNodeFormAvoidingOffset]);

    const execute = <TAction extends keyof typeof actions>
        (type: TAction, payload?: Parameters<typeof actions[TAction]>[1]) => {
        const func = actions[type] as (p: ActionContext, payload: any) => ReturnType<typeof actions[TAction]>;

        return func({
            moduleState,
            produceModuleState,
            editor,
            produceEditorState,
        }, payload);
    };

    const setExpandedId = useCallback((nodeId) => {
        produceEditorState((draft) => {
            if (draft.expandedId === nodeId) {
                draft.expandedId = undefined;
            } else {
                draft.expandedId = nodeId;
            }
        });
        produceModuleState((draft) => {
            Object.keys(draft.nodes).forEach((iteratedNodeId) => {
                delete draft.nodes[iteratedNodeId].isEditing;
            });

            if (draft.editorExpandedNodeId !== nodeId && draft.nodes && draft.nodes[nodeId]) {
                draft.nodes[nodeId].isEditing = true;
            }

            if (draft.editorExpandedNodeId === nodeId) {
                draft.editorExpandedNodeId = undefined;
            } else {
                draft.editorExpandedNodeId = nodeId;
            }
        });
    }, [produceEditorState]);

    const currentScene = useMemo(() =>
        editor.currentSceneSelect
            && moduleState?.scenes[editor.currentSceneSelect.value],
    [editor.currentSceneSelect, moduleState?.scenes]);

    const flattenNodes = useMemo(() => {
        if (!currentScene?.nodeStructure) {
            return [];
        }
        const res = flattenNodeStructure(currentScene.nodeStructure);

        return res;
    }, [currentScene?.nodeStructure]);

    const onCopy = useCallback((event: ClipboardEvent) => {
        if (editor.expandedId && !window?.getSelection()?.toString()) {
            const nodeData = Object.values(scenesData.nodes)
                .find((i) => i.id === editor.expandedId);

            const nodeStatesData = Object.values(scenesData.nodesStates)
                .filter((i) => nodeData?.nodeStatesIds.includes(i.id));

            const data = {
                type: 'scene',
                data: {
                    nodeData,
                    nodeStatesData,
                },
            };

            const clipboard = JSON.stringify(data);
            event.clipboardData?.setData('application/json', clipboard);
            event.preventDefault();
        }
    }, [scenesData]);

    const onPaste = useCallback((event: ClipboardEvent) => {
        const clipboard = JSON.parse(event.clipboardData?.getData('application/json') || '');
        if (
            typeof clipboard === 'object'
            && clipboard.type === 'scene'
            && editor.expandedId
        ) {
            execute('copyByNodeId',
                {
                    clipboard,
                    path: editor.expandedId,
                });
        }
    }, [execute, scenesData]);

    const onCut = useCallback((event: ClipboardEvent) => {
        if (editor.expandedId && !window?.getSelection()?.toString()) {
            onCopy(event);
            execute('deleteNodeById', {nodeId: editor.expandedId});
        }
    }, [execute, onCopy, editor.expandedId]);

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        if (
            event.key === 'ArrowDown' // @ts-ignore
            && event.target.nodeName !== 'INPUT' // @ts-ignore
            && event.target.nodeName !== 'TEXTAREA'
        ) {
            const nextId = getCloseFlattenNodeId(flattenNodes, editor, false);
            if (nextId) {
                setExpandedId(nextId);
            }
        }
    }, [editor.expandedId, flattenNodes, setExpandedId]);

    const onKeyUp = useCallback((event: KeyboardEvent) => {
        if (
            event.key === 'ArrowUp' // @ts-ignore
            && event.target.nodeName !== 'INPUT' // @ts-ignore
            && event.target.nodeName !== 'TEXTAREA'
        ) {
            const prevId = getCloseFlattenNodeId(flattenNodes, editor, true);
            if (prevId) {
                setExpandedId(prevId);
            }
        }
    }, [editor.expandedId, flattenNodes, setExpandedId]);

    useEffect(() => {
        // document.addEventListener('cut', onCut);
        document.addEventListener('copy', onCopy);
        document.addEventListener('paste', onPaste);

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            // document.removeEventListener('cut', onCut);
            document.removeEventListener('copy', onCopy);
            document.removeEventListener('paste', onPaste);

            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [onCopy, onCut, onPaste]);

    useEffect(function cleanModuleState() {
        produceModuleState((draft) => {
            draft.nodes = _.mapValues(scenesData?.nodes || {},
                (nodeData) => ({...nodeData, currentStateId: undefined, currentStateName: undefined}));

            commonNodesStatesIds.slice().reverse().forEach((commonNodeStateId) => {
                if (!Object.keys(draft.nodesStates).includes(commonNodeStateId)) {
                    draft.nodesStates = {
                        [commonNodeStateId]: commonNodeStates[commonNodeStateId],
                        ...draft.nodesStates,
                    };
                    draft.commonNodesStatesIds = _.uniq([commonNodeStateId, ...draft.commonNodesStatesIds]);
                }
            });
        }, true);
        return () => {
            execute('cleanModuleState');
            saveScenesData();
        };
    }, []);

    useEffect(function updateCurrentSceneStatesOptions() {
        execute('updateCurrentSceneStatesSelect');
    }, [Object.keys(moduleState?.scenesStates || {}).join(), editor.currentSceneSelect]);

    useEffect(function updateAvailableSceneOptions() {
        execute('updateAvailableScenesSelect');
    }, [Object.keys(moduleState?.scenes || {}).join(), moduleState?.currentScenesIds]);

    const SceneStateOption = (p: any) => (
        <OptionWithMenu
            {...p}
            menuItems={[
                {
                    name: 'Удалить',
                    onClick: (id) => execute('deleteSceneStateById', {
                        sceneStateId: id,
                    }),
                }
            ]}
        />
    );

    const SceneOption = (p: any) => (
        <OptionWithMenu
            {...p}
            menuItems={[
                {
                    name: 'Удалить',
                    onClick: (id) => execute('deleteSceneById', {
                        sceneId: id,
                    }),
                }
            ]}
        />
    );

    const getSubstate = useCallback((fieldPath: string[]) => {
        return _.get({root: globalState}, fieldPath);
    }, [
        globalState?.states,
        globalState?.scriptModulesStates?.scenesManager?.scenes,
        globalState?.scriptModulesStates?.scenesManager?.scenesStates,
        globalState?.scriptModulesStates?.scenesManager?.nodesStates
    ]);

    const addValueToState = useCallback((path: string, value: any) => {
        produceGlobalState((draft) => {
            // TODO: throw error if adding string key in existing array
            _.setWith(draft, path, value, Object);
        });
    }, []);

    const onNodeDataChange = useCallback((nodeId: string, newData: any, oldData: any) => {
        execute('setNodeDataByNodeId', {nodeId, newData, oldData});
    }, [
        Object.values(moduleState?.nodes).map((node) => [node.currentStateId, node.currentStateName]).join(),
        moduleState?.scenesStates,
        moduleState.currentScenesIds,
        editor.currentSceneStateSelect
    ]);

    const addNode = useCallback((type: NodeTypeEnum, parentNodeId?: string, nodeIndex?: number) => {
        const newNodeId = execute('addNodeByParentNodeId', {type, parentNodeId, nodeIndex});
        setTimeout(() => {
            setExpandedId(newNodeId);
        }, 0);
        return newNodeId;
    }, [editor.currentSceneStateSelect, editor.currentSceneSelect, setExpandedId]);

    const deleteNodeById = useCallback((nodeId) => {
        execute('deleteNodeById', {nodeId});
    }, [editor.currentSceneSelect, moduleState.scenes]);

    const currentSceneState = useMemo(() =>
        editor.currentSceneStateSelect
            && moduleState?.scenesStates[editor.currentSceneStateSelect.value],
    [editor.currentSceneStateSelect, moduleState?.scenesStates]) ;

    const currentSceneStateNodes = useMemo(() => getNodesWithStateParamsFromSceneState(
        moduleState.nodes,
        currentSceneState?.nodesStatesIds || {},
        moduleState.nodesStates,
        true
    ), [
        currentSceneState?.nodesStatesIds,
        moduleState?.nodesStates,
        moduleState?.nodes,
        moduleState?.scenesStates,
        moduleState.currentScenesIds,
        editor.currentSceneStateSelect
    ]);

    return <div
        className="content"
    >
        <div className="nodes-structure">
            <div className={classNames(
                'nodes-structure-inner', {
                    disabled: p.disabled,
                })}>
                {currentScene && currentSceneState &&
                    <NodeEditors
                        flattenNodes={flattenNodes}
                        nodes={currentSceneStateNodes}
                        expandedId={editor.expandedId}
                        setExpandedId={setExpandedId}
                        deleteNodeById={deleteNodeById}
                        currentSceneStateSelect={editor.currentSceneStateSelect}
                        nodeStructure={currentScene.nodeStructure}
                        addNode={addNode}
                        bottomOffset={nodeFormAvoidingOffset}
                    />
                }
                {flattenNodes.length <= 1 && <AddNodeBar
                    blocked={false}
                    isShown={true}
                    isRootMode={true}
                    addNode={(type) => addNode(type, 'root', 0)}
                    appendMode={AppendMode.SameLevel}
                    setAppendMode={() => false}
                    onSetVisibility={() => false}
                />}
            </div>
        </div>

        <div className='node-form'>
            <NodeForm
                node={currentSceneStateNodes[editor.expandedId!]}
                id={editor.expandedId}
                getSubstate={getSubstate}
                addValueToState={addValueToState}
                onNodeDataChange={onNodeDataChange}
                onNodeFormHeightChange={onNodeFormHeightChange}
            />
        </div>

        {/*<div className="nodes-structure-overlay"></div>*/}

        <div className="stages-nav no-left-action">
            <Creatable
                css={SelectStylesSideBarWithoutLeftAction}
                components={{Option: SceneOption}}
                onChange={(opt) => execute('setCurrentSceneSelectById', {
                    sceneId: opt.value,
                })}
                value={editor.currentSceneSelect}
                options={editor.availableScenesSelect}
                onCreateOption={(name) => execute('createScene', {name})}
                formatCreateLabel={(input) => `Создать новую сцену «${input}»`}
                classNamePrefix="input-select"
                isSearchable={true}
                placeholder="Название сцены"
            />
            <SideButton
                position={'right'}
                icon={'Params'}
            />
        </div>
        <div className="stages-sub-nav no-left-action">
            <Creatable
                css={SelectStylesSideBarWithoutLeftAction}
                components={{Option: SceneStateOption}}
                onChange={(opt) => execute('setCurrentSceneStateSelectById', {
                    sceneStateId: opt.value,
                })}
                value={editor.currentSceneStateSelect}
                options={editor.currentSceneStatesSelect}
                onCreateOption={(name) => execute('createCurrentSceneSceneState', {name})}
                formatCreateLabel={(input) => `Создать новое состояние «${input}»`}
                classNamePrefix="input-select"
                isSearchable={true}
                placeholder="Название состояния сцены"
            />
            <SideButton
                position={'right'}
                icon={'Params'}
            />
        </div>
    </div>;
};
