import React, {useRef} from 'react';
import Button from '@/components/button';
import {Clickable} from '@/components/clickable';
import Icon from '@/components/icon';
import {ID} from '@/utils/generate-id';
import {useClickOutside} from '@/utils/use-click-outside';
import {css, useTheme} from '@emotion/react';
import cn from 'classnames';
import {useForm} from 'react-hook-form';
import {scriptModulesPreviews} from '../../stages-editor/script-blocks-editor';
import {AddBlockWrapper} from './css';
import {ScriptBlockFull, UtilityStages} from '@/components/constructor/script-blocks/types';

export type AddBlockProps = {
    onOpen: () => void;
    onClose: () => void;
    onAdd: () => void;
    setCurrentScriptModule: (p: string) => void;
    currentScriptModule: keyof typeof scriptModulesPreviews;
    availableScriptBlocks: { [key: string]: ScriptBlockFull },
    isOpen: boolean;
    produceState: any,
    currentStage: string;
    index: number;
    isFullWidth?: boolean;
    isFullHeight?: boolean;
};

const checkIsShown = (
    p: AddBlockProps,
    block: ScriptBlockFull,
    searchQuery: any,
    searchMatchIndex: number,
    currentStage
) => {
    return (p.currentScriptModule === 'all' ||
        block.moduleId === p.currentScriptModule)
        && (!searchQuery || searchMatchIndex !== -1)
        && !block.isBlocked
        && (!block.isOnlyOnSetup || currentStage === UtilityStages.setup);
};

const getSearchMatchIndex = (block: ScriptBlockFull, searchQuery: any) => {
    return block?.title?.toLowerCase().indexOf((searchQuery || '').toLowerCase());
};

export function addBlock({block, produceState, currentStage, index}) {
    produceState((draft) => {
        draft.stages[currentStage].splice(index, 0, {
            ...block.data,
            dataId: ID(),
        });
    });
}

export const AddBlockBar = (p: AddBlockProps) => {
    const theme = useTheme();
    const addBlockRef = useRef<HTMLDivElement>(null);

    const form = useForm({
        mode: 'onChange',
    });
    const {produceState, currentStage, index, onAdd, onClose} = p;

    const searchQuery = form.watch('search', false);

    const addBlockSimply = (block) => {
        addBlock({
            block,
            produceState,
            currentStage,
            index,
        });
        onAdd();
        onClose();
    };

    const onSubmit = (formData) => {
        if (formData.search) {
            const filteredBlock = Object.keys(p.availableScriptBlocks).map((blockId) => {
                const block = p.availableScriptBlocks[blockId];

                if (block && checkIsShown(
                    p,
                    block,
                    formData.search, getSearchMatchIndex(block, formData.search),
                    p.currentStage
                )) {
                    return block;
                }

                return null;
            }).filter(Boolean);
            if (filteredBlock.length > 0) {
                addBlockSimply(filteredBlock[0]);
                form.reset({search: ''});
            }
        }
    };

    useClickOutside(addBlockRef, () => p.isOpen && p.onClose());
    return (
        <AddBlockWrapper
            ref={addBlockRef}
            className={cn({
                'is-open': p.isOpen,
                'is-full-width': p.isFullWidth,
                'is-full-height': p.isFullHeight,
            })}>
            {p.isOpen ? <>
                <div className="add-block_header">

                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <input
                            autoFocus
                            type="search"
                            autoComplete="off"
                            placeholder="Поиск" {...form.register('search')}
                        />
                    </form>
                    {Object.keys(scriptModulesPreviews).map((scriptModuleId) => {
                        const scriptModule = scriptModulesPreviews[scriptModuleId];

                        return (
                            <Clickable
                                key={scriptModuleId}
                                onClick={() => p.setCurrentScriptModule(scriptModuleId)}
                            >
                                <div
                                    className={cn({
                                        'scriptModule-tab': true,
                                        active: scriptModuleId === p.currentScriptModule,
                                    })}
                                    css={css`
                                        &.active {
                                            background-color: ${scriptModule.color ||
                                            theme.colors.primary.default} !important;
                                            > span {
                                                color: ${theme.colors.grayscale.white} !important;
                                            }
                                        }
                                `}>
                                    {scriptModule.icon &&
                                        <Icon
                                            size={16}
                                            glyph={scriptModule.icon}
                                            color={
                                                scriptModuleId === p.currentScriptModule
                                                    ? theme.colors.grayscale.white
                                                    : (scriptModule.color || theme.colors.primary.default)
                                            }
                                        />
                                    }
                                    <span>{scriptModule.name}</span>
                                </div>

                            </Clickable>);
                    })
                    }
                </div>
                <div className="add-block_content">
                    {Object.keys(p.availableScriptBlocks).map((blockId) => {
                        const block = p.availableScriptBlocks[blockId];

                        const searchMatchIndex = getSearchMatchIndex(block, searchQuery);

                        let finalTitle = <>{block.title}</>;

                        if (searchMatchIndex !== -1 && searchQuery) {
                            const title = String(block.title);
                            finalTitle = <>
                                {title.substring(0, searchMatchIndex)}
                                <b>
                                    {title.substring(searchMatchIndex, searchMatchIndex + searchQuery.length)}
                                </b>
                                {title.substring(searchMatchIndex + searchQuery.length, title.length)}
                            </>;
                        }

                        return checkIsShown(p, block, searchQuery, searchMatchIndex, p.currentStage)
                            && <div key={blockId} onClick={() => addBlockSimply(block)}>
                                <Clickable>
                                    <div className="item-icon" css={css`
                                    background-color: ${block.color || theme.colors.primary.default};
                                `}>
                                        {block.icon && <Icon
                                            size={16}
                                            glyph={block.icon}
                                            color={theme.colors.grayscale.white}
                                        />}
                                    </div>
                                    <span>{finalTitle}</span>
                                </Clickable>
                            </div>;
                    })}
                </div>
            </>
                : p.isFullWidth ?
                    <div className="full-button">
                        <Button
                            leftIcon='ActionsPlus'
                            isFullWidth
                            keyListener="Enter"
                            onClick={p.onOpen}
                        >Добавить блок</Button>
                    </div>
                    : <div
                        className='plus-button'
                        onClick={p.onOpen}
                    >
                        <Clickable className='button'>
                            <Icon glyph='ActionsPlus' color={theme.colors.grayscale.white} />
                        </Clickable>
                    </div>}
        </AddBlockWrapper>
    );
};
