import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {css, useTheme} from '@emotion/react';
import {scriptBlockStyles} from '@/components/constructor/side-bar/script-block';
import {ScriptBlockInputs} from '@/components/constructor/side-bar/script-block/inputs';
import {
    iconGlyphByType,
    inputs,
    uneditableInputsByType
} from '@/components/constructor/side-bar/scenes-editor/nodes-editors/node-inputs';
import {DEFAULT_SCENE_STATE_NAME} from '@/components/constructor/side-bar/scenes-editor/actions';
import {commonNodesStatesIds, NodeTypeEnum, NodeWithStateType} from '@/components/scenes-manager/types';
import {SelectItemType} from '@/components/constructor/side-bar/scenes-editor';
import {BoundStageParamsData} from '@/components/constructor/script-blocks/types';
import {StageParam} from '@/components/constructor/script-blocks/control-logic';
import {Inputs} from '@/components/constructor/side-bar/script-block/widget';
import _ from 'lodash';
import Icon from '@/components/icon';

export type Props = {
    id?: string;
    node?: NodeWithStateType;
    isExpanded?: boolean;
    currentSceneStateSelect?: SelectItemType;
    getSubstate: (fieldPath: string[]) => any;
    boundStageParams?: BoundStageParamsData;
    availableParamsToBind?: {
        [name: string]: StageParam,
    };
    bindInputToStageParam?: (params: {inputName: string, paramName?: string, tableItemPath?: string}) => void;
    addValueToState: (path: string, value: any) => void;
    onNodeDataChange: (nodeId, newData, oldData) => void;
    onNodeFormHeightChange: (height: number) => void,
}

const MIN_MENU_HEIGTH = 50;

const getInputs = (
    inputs: Record<string, Inputs>,
    nodeType: NodeTypeEnum,
    isDefaultState?: boolean,
    isCommonState?: boolean
) => {
    if (isDefaultState) {
        return inputs[nodeType];
    } else {
        const newInputs = {};
        Object.keys(inputs[nodeType]).forEach((inputName) => {
            const inputData = inputs[nodeType][inputName];
            const inputsConditions = uneditableInputsByType[nodeType];

            if (!inputsConditions.removedOnOverride.includes(inputName)) {
                const isDisabled = (isCommonState && !['currentStateName'].includes(inputName))
                    || inputsConditions.disabledOnOverride.includes(inputName);

                newInputs[inputName] = {
                    ...inputData,
                    ...(!inputData.isHidden ? {isHidden: inputsConditions.hidden.includes(inputName)} : {}),
                    ...(!inputData.isDisabled ? {
                        isDisabled,
                    } : {}),
                };
            }
        });

        return newInputs;
    }
};

export const NodeForm = (p: Props) => {
    const theme = useTheme();
    const headerRef = useRef(null);
    const [height, setHeight] = useState(300);
    const [isDragging, setIsDragging] = useState(false);

    const onHeaderMouseDown = useCallback(() => {
        if (!isDragging) {
            setIsDragging(true);
        }
    }, [isDragging]);

    const onChange = useMemo(() => {
        function changeFn(newData) {
            p.onNodeDataChange(p.id, newData, p.node);
        }

        return _.debounce(changeFn, 500);
    }, [p.onNodeDataChange, p.id, p.node]);

    useEffect(() => {
        const onMouseUp = () => {
            setIsDragging(false);
        };

        const onMouseMove = (e) => {
            if (isDragging) {
                setHeight((old) => Math.max(old - e.movementY, MIN_MENU_HEIGTH));
            }
        };

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);

        return () => {
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
        };
    }, [isDragging]);

    const isShown = Boolean(p.node);

    useEffect(function syncHeight() {
        p.onNodeFormHeightChange(height);
    }, [height, p.onNodeFormHeightChange]);

    useEffect(function showMinimalHeight() {
        if (isShown && height < 100) {
            setHeight(300);
        }
    }, [p.node?.id]);

    const isDefaultState = p.node?.currentStateName === DEFAULT_SCENE_STATE_NAME;
    const isCommonState = commonNodesStatesIds.includes(p.node?.currentStateId || '');

    return (
        <div
            css={css`
            position: relative;
            display: block;
            overflow-y: hidden;
            overflow-x: hidden;
            height: ${height || 300}px;
            transition: transform .3s ease-in-out;
            
            ${isShown && css`
                transform: translateY(0);
                pointer-events: all !important;
            `}
                    
            ${!isShown && css`
                transform: translateY(1000px);
                pointer-events: none !important;
                visibility: hidden;
            `}
            
            padding-top: 4px;
            padding-bottom: 8px;
            filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.05));
        `}
        >
            <div
                css={css`
                    ${scriptBlockStyles};
                    overflow-y: hidden;
                    padding: 6px 6px 4px 6px;
                    transition: 0.3s ease;
                    border: 2px solid transparent;
                    border-radius: 16px;
                    height: 100%;
                  
                    hr {
                        border: none;
                        color: ${theme.colors.grayscale.input};
                        background-color: ${theme.colors.grayscale.input};
                        height: 2px;
                        margin: 0 8px 2px 8px;
                    }
                    
                    .menu-content {
                      padding-top: 12px;
                      height: 100%;
                      overflow-y: auto;
                      overflow-x: hidden;
                      padding-bottom: 60px;
                    }

                    .scrollable-menu-content {
                        position: relative;
                    }
                    
                    .menu-header {
                      user-select: none;
                      position: absolute;
                      top: 2px;
                      left: 0;
                      right: 0;
                      z-index: 600000;
                      height: 20px;
                      cursor: ${isDragging ? 'grabbing' : 'grab'};
                      display: flex;
                      justify-content: center;
                      background: linear-gradient(to bottom, #ffffff 30%, #ffffff00 100%);

                      .pill {
                        content: "";
                        display: inline-block;
                        width: 40px;
                        min-width: 40px;
                        height: 3px;
                        border-radius: 1.5px;
                        background: ${theme.colors.grayscale.line};
                        margin: 4px 8px;
                        transition: .1s ease-in-out;
                      }

                      .header-title {
                        font-size: 12px;
                        color: ${theme.colors.grayscale.label};
                        width: calc(50% - 28px);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        &.left {
                            text-align: right;
                            margin-left: 16px;
                        }
                        &.right {
                            text-align: left;
                            margin-right: 16px;
                        }
                      }

                      &:hover {
                        .pill {
                            background: ${theme.colors.grayscale.placeholder};
                        }
                      }
                      &:active {
                        .pill {
                            background: ${theme.colors.grayscale.label};
                        }
                      }

                      //&::after {
                      //  content: '';
                      //  margin: 0 auto;
                      //  position: absolute;
                      //  left: calc(50% - 30px);
                      //  height: 3px;
                      //  width: 60px;
                      //  background-color: #ddd;
                      //}
                    }

                    .node-icon {
                      position: absolute;
                      top: 10px;
                      left: 9px;
                    }
        `}
            >
                <div
                    ref={headerRef}
                    className='menu-header'
                    onMouseDown={onHeaderMouseDown}
                >
                    <span className='header-title left'>
                        {p.node?.name}
                    </span>
                    <span className="pill"></span>
                    <span className='header-title right'>
                        {p.node?.currentStateName}
                    </span>
                </div>

                <div className='menu-content'>
                    {(p.node) && <div className='scrollable-menu-content'>
                        <ScriptBlockInputs
                            key={`${p.id}-${p.node.currentStateId}`}
                            inputs={getInputs(inputs, p.node.type, isDefaultState, isCommonState)}
                            bindInputToStageParam={p.bindInputToStageParam}
                            availableParamsToBind={p.availableParamsToBind}
                            boundStageParams={p.boundStageParams}
                            inputValues={p.node}
                            getSubstate={p.getSubstate}
                            addValueToState={p.addValueToState}
                            onChange={onChange}
                        />
                        <Icon
                            className='node-icon'
                            size={16}
                            glyph={iconGlyphByType[p.node.type]}
                            color={
                                p.isExpanded
                                    ? theme.colors.primary.default
                                    : theme.colors.grayscale.label
                            }
                        />
                    </div>}

                </div>
            </div>
        </div>
    );
};
