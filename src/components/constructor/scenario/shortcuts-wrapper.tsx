import React, {useCallback, useEffect} from 'react';

import {connectFullScript} from '../script-blocks/lib';
import {addBlock} from '../side-bar/script-block/add-block';
import {useConstructorScenario} from '@/context-providers/constructor-scenario';
import {StyledEditorRoot} from './css';
import {TabsEnum} from '@/components/constructor/side-bar/types';

export const useShortcuts = () => {
    const {state, produceState} = useConstructorScenario();
    const currentEditorStage = state.constructor.currentStage;

    const setCurrentTab = (tab:TabsEnum) => produceState((draft) => {
        draft.constructor.currentTab = tab;
    });

    const setModifierKeys = (event: KeyboardEvent) => {
        if (event.key === 'Alt'
            || event.key === 'Control'
            || event.key === 'Meta'
            || event.key === 'Shift'
            || event.key === 'Tab'
        ) {
            produceState((draft) => {
                draft.constructor.modifierKeys = {
                    altKey: event.altKey,
                    ctrlKey: event.ctrlKey,
                    metaKey: event.metaKey,
                    shiftKey: event.shiftKey,
                    tabKey: event.key === 'Tab',
                };
            });
        }
    };

    const unselectAll = () => {
        produceState((draft) => {
            draft.constructor.currentStageSelectedBlocksIds = [];
        });
    };

    const deleteSelectedBlocks = useCallback(() => {
        if (currentEditorStage && state.constructor.currentStageSelectedBlocksIds.length > 0) {
            produceState((draft) => {
                draft.constructor.currentStageSelectedBlocksIds.forEach((blockId) => {
                    const index = draft.stages[currentEditorStage].findIndex((data) => data.dataId === blockId);
                    draft.stages[currentEditorStage].splice(index, 1);
                });
            });
            unselectAll();
        }
    }, [
        produceState,
        currentEditorStage,
        state.stages[currentEditorStage!],
        state.constructor.currentStageSelectedBlocksIds
    ]);

    const getLastIndex = useCallback(() => {
        if (currentEditorStage && state.constructor.currentStageSelectedBlocksIds.length > 0) {
            const lastIndex = state.constructor.currentStageSelectedBlocksIds
                .map((id) => state.stages[currentEditorStage]
                    .findIndex((data) => data.dataId === id))
                .sort()
                .reverse()[0] + 1 || 0;
            return lastIndex;
        }
        return 0;
    }, [
        produceState,
        currentEditorStage,
        state.stages[currentEditorStage!],
        state.constructor.currentStageSelectedBlocksIds
    ]);

    const duplicateSelectedBlocks = useCallback(() => {
        if (currentEditorStage && state.constructor.currentStageSelectedBlocksIds.length > 0) {
            state.stages[currentEditorStage].filter((blockData) =>
                state.constructor.currentStageSelectedBlocksIds.includes(blockData.dataId))
                .forEach((blockData) => {
                    const fullScript = connectFullScript(blockData, state.availableScriptBlocks);
                    addBlock({
                        block: fullScript,
                        produceState,
                        currentStage: currentEditorStage,
                        index: getLastIndex(),
                    });
                });
            unselectAll();
        }
    }, [
        produceState,
        currentEditorStage,
        state.stages[currentEditorStage!],
        state.constructor.currentStageSelectedBlocksIds
    ]);

    const onPaste = useCallback((event: ClipboardEvent) => {
        const clipboard = JSON.parse(event.clipboardData?.getData('application/json') || '');
        if (
            typeof clipboard === 'object'
            && clipboard.type === 'blocks'
            && currentEditorStage
        ) {
            clipboard.data.reverse().forEach((blockData) => {
                const fullScript = connectFullScript(blockData, state.availableScriptBlocks);
                addBlock({
                    block: fullScript,
                    produceState,
                    currentStage: currentEditorStage,
                    index: getLastIndex(),
                });
            });
            unselectAll();
        }
    }, [
        currentEditorStage,
        state.availableScriptBlocks,
        state.constructor.currentStageSelectedBlocksIds
    ]);

    const onCopy = useCallback((event: ClipboardEvent) => {
        if (currentEditorStage && state.constructor.currentStageSelectedBlocksIds.length > 0) {
            const data = {
                type: 'blocks',
                data: state.stages[currentEditorStage].filter((blockData) =>
                    state.constructor.currentStageSelectedBlocksIds.includes(blockData.dataId)),
            };

            const clipboard = JSON.stringify(data);
            event.clipboardData?.setData('application/json', clipboard);
            event.preventDefault();
        }
    }, [
        currentEditorStage,
        state.stages[currentEditorStage!],
        state.constructor.currentStageSelectedBlocksIds
    ]);

    const onCut = useCallback((event: ClipboardEvent) => {
        onCopy(event);
        deleteSelectedBlocks();
    }, [
        onCopy,
        deleteSelectedBlocks
    ]);

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        setModifierKeys(event);
        if (
            event.ctrlKey
        ) {
            if (event.code === 'Digit1') {
                setCurrentTab(TabsEnum.stages);
            }
            if (event.code === 'Digit2') {
                setCurrentTab(TabsEnum.scenes);
            }
            if (event.code === 'Digit3') {
                setCurrentTab(TabsEnum.data);
            }
        }
        if (event.code === 'Delete') {
            deleteSelectedBlocks();
        }
        if ((event.metaKey || event.ctrlKey) && event.code === 'KeyD') {
            duplicateSelectedBlocks();
            event.preventDefault();
        }
    }, [deleteSelectedBlocks]);

    const onScrollInputNumber = function () { // @ts-ignore
        if (document?.activeElement?.type === 'number') { // @ts-ignore
            const input = document.activeElement; // @ts-ignore
            input.blur();
        }
    };

    const onKeyUp = (event: KeyboardEvent) => {
        setModifierKeys(event);
    };

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        document.addEventListener('wheel', onScrollInputNumber);
        // @ts-ignore
        document.addEventListener('copy', onCopy);
        document.addEventListener('cut', onCut);
        // @ts-ignore
        document.addEventListener('paste', onPaste);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);

            // @ts-ignore
            document.removeEventListener('copy', onCopy);
            // @ts-ignore
            document.removeEventListener('cut', onCut);
            // @ts-ignore
            document.removeEventListener('paste', onPaste);

            document.removeEventListener('wheel', onScrollInputNumber);
        };
    }, [state.constructor.currentStage, onCopy, onCut, onPaste]);

    return {onCopy, onPaste, onCut};
};

export const ShortcutsWrapper = ({children}: {children: React.ReactElement}) => {
    useShortcuts();
    return <StyledEditorRoot >
        {children}
    </StyledEditorRoot>;
};
