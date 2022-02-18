import React, {useEffect} from 'react';
import {useRef, useState} from 'react';
import {components} from 'react-select';
import classNames from 'classnames';
import {Clickable} from '@/components/clickable';
import Icon from '@/components/icon';
import {css, useTheme} from '@emotion/react';
import {ConstructorScenarioState} from '@/context-providers/constructor-scenario';
import {ID} from '@/utils/generate-id';
// import scrollIntoView from 'scroll-into-view';

import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import mergeRefs from '@/utils/merge-refs';
import {connectFullScript} from '../../script-blocks/lib';
import {InputTypeType} from '../script-block/widget/types';
import ReactTooltip from 'react-tooltip';
import {StyledOption} from '@/components/select-input/option-with-menu';
import {generateCopyName} from '@/utils/generate-copy-name';

export const OptionStage = (p: {
    value: string;
    isSelected: boolean;
    onStageOperation: (o)=>void;
    options: {label:string; value: string;}[];
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: p.value});
    const ref = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);
    const theme = useTheme();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    useEffect(() => {
        setIndex(p.options.map((option) => option.value).indexOf(p.value));
    }, [p.options]);

    // useEffect(() => {
    //     if (p.isSelected) {
    //         scrollIntoView(ref.current, {
    //             time: 0,
    //             validTarget: function (target, parentsScrolled) {
    //                 return (
    //                     parentsScrolled < 2 &&
    //                     target !== window &&
    //                     target.matches('.input-select__menu-list')
    //                 );
    //             },
    //         });
    //     }
    // }, []);

    return (
        <StyledOption
            ref={mergeRefs([setNodeRef, ref]) }
            style={style as React.CSSProperties}
            className={classNames({
                // 'is-menu-open': isMenuOpen,
                'is-selected': p.isSelected,
                'is-dragging': isDragging,
                'with-left-indent': true,
            })}
        >
            <components.Option {...p} />

            <Clickable
                data-tip={p.value}
                data-for={'stage-menu'}
            >
                <Icon
                    glyph='More'
                    color={
                        p.isSelected
                            ? theme.colors.grayscale.offWhite
                            : theme.colors.grayscale.offBlack
                    }/>
            </Clickable>
            {index === p.options.length - 1
                && <ReactTooltip
                    className='more-stage-menu-list'
                    effect='solid'
                    event='click'
                    // isCapture={true}
                    clickable={true}
                    type='light'
                    place='bottom'
                    multiline={true}
                    id='stage-menu'
                    backgroundColor={theme.colors.grayscale.white}
                    getContent={(dataTip) => <>
                        <Clickable onClick={() => p.onStageOperation({
                            stageName: dataTip,
                            action: 'dublicate',
                        })}>Дублировать</Clickable>

                        <Clickable onClick={() => {
                        // eslint-disable-next-line no-alert
                            const newName = window.prompt('Enter new name: ');
                            p.onStageOperation({
                                stageName: dataTip,
                                newStageName: newName,
                                action: 'rename',
                            });
                        }}>Переименовать</Clickable>

                        <Clickable onClick={() => p.onStageOperation({
                            stageName: dataTip,
                            action: 'delete',
                        })}>Удалить</Clickable>
                    </>
                    }

                />}

            <Clickable
                {...attributes}
                {...listeners}
                className='drag-handle'>
                <Icon
                    glyph='Handle'
                    size={16}
                    color={
                        p.isSelected
                            ? theme.colors.grayscale.offWhite
                            : theme.colors.grayscale.body
                    }/>
            </Clickable>
        </StyledOption>
    );
};

export const onStageOperation = (p, produceState, setCurrentStage) => {
    switch (p.action) {
        case 'dublicate':
            produceState((draft: ConstructorScenarioState) => {
                const keyValues = Object.entries(draft.stages);
                const keys = Object.keys(draft.stages);
                const index = keys.indexOf(p.stageName);
                const newNameKey = generateCopyName(p.stageName, keys);
                keyValues.splice(index + 1, 0, [
                    newNameKey,
                    JSON.parse(JSON.stringify(draft.stages[p.stageName]))
                ]);
                // @ts-ignore
                draft.stages = Object.fromEntries(keyValues);
                draft.stages[newNameKey].forEach((dataBlock) => {
                    dataBlock.dataId = ID();
                });
            });
            break;
        case 'rename':
            produceState((draft: ConstructorScenarioState) => {
                const keys = Object.keys(draft.stages);
                const newObj = keys.reduce((acc, val) => {
                    if (val === p.stageName) {
                        acc[p.newStageName] = draft.stages[p.stageName];
                    } else {
                        acc[val] = draft.stages[val];
                    }
                    return acc;
                }, {});

                keys.forEach((stageId) => {
                    draft.stages[stageId].forEach((blockData, blockIndex) => {
                        const fullScript = connectFullScript(blockData, draft.availableScriptBlocks);
                        if (fullScript.inputs) {
                            Object.keys(fullScript.inputs).forEach((inputName) => {
                                if (fullScript.inputs[inputName].type === InputTypeType.stage) {
                                    const inputValue = blockData.inputValues[inputName];
                                    if (inputValue === p.stageName) {
                                        draft.stages[stageId][blockIndex].inputValues[inputName] = p.newStageName;
                                    }
                                }
                            });
                        }
                    });
                });

                draft.stages = newObj;
            });
            setCurrentStage(p.newStageName);
            break;

        case 'delete':
            produceState((draft) => {
                delete draft.stages[p.stageName];
            });
            break;

        default:
            break;
    }
};

export const OptionThumb = (p) => {
    const theme = useTheme();
    return <StyledOption
        className={classNames({
            'is-selected': p.isSelected,
            'with-left-indent': true,
            'is-dragging': true,
        })}
        css={css`
            opacity: 0;
        `}
        // style={{backgroundColor: p.isFocused ? 'yellow' : 'inherit'}}

        {...p.innerProps}
        ref={p.innerRef}
    >
        <div className="input-select__option">{p.label}</div>

        <Clickable
            data-tip={p.value}
            data-for={'stage-menu'}
        >
            <Icon
                glyph='More'
                color={
                    p.isSelected
                        ? theme.colors.grayscale.offWhite
                        : theme.colors.grayscale.offBlack
                }/>
        </Clickable>
        <Clickable
            className='drag-handle'>
            <Icon
                glyph='Handle'
                size={16}
                color={
                    p.isSelected
                        ? theme.colors.grayscale.offWhite
                        : theme.colors.grayscale.body
                }/>
        </Clickable>
    </StyledOption>;
};
