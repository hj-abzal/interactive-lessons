import React, {useState} from 'react';
import {Translate, useDraggable} from '@dnd-kit/core';
import {StageNodeWrapper} from './css';
import mergeRefs from '@/utils/merge-refs';
import classNames from 'classnames';
import Icon from '@/components/icon';

export type ActionType = {
    id: string;
    name: string;
    isMulti?: boolean;
    isActive?: boolean;
    isConnected?: boolean;
};

export type StageNodeType = {
    id: string;
    name: string;
    isActive?: boolean;
    isConnected?: boolean;
    isCurrent?: boolean;
    translate?: Translate;
    initialTranslate?: Translate
    actions?: ActionType[];
};

export type StageNodeProps = StageNodeType & {
    onHoverAction: (actionId: string, isHovered: boolean) => void;
    setCurrentEditorStage: (stageId: string) => void;
    onClickAction: (actionId: string) => void;
}

export const StageNode = React.forwardRef(
    function StageNode(p: StageNodeProps, ref) {
        const [isExpanded, setIsExpanded] = useState(false);
        const {attributes, listeners, isDragging, setNodeRef} = useDraggable({
            id: p.id,
        });

        return <StageNodeWrapper
            ref={mergeRefs([ref, setNodeRef])}
            translateXY={p.translate}
            isDragging={isDragging}
            isCurrent={p.isCurrent}
            {...listeners}
            {...attributes}
        >
            <div
                className={classNames('header action', {
                    active: p.isActive,
                })}
                onMouseEnter={() => p.onHoverAction(p.id, true)}
                onMouseLeave={() => p.onHoverAction(p.id, false)}
                onClick={() => p.setCurrentEditorStage(p.id)}
            >
                {p.name}
                <div
                    id={p.id}
                    className={classNames('connector connector-left', {
                        connected: p.isConnected,
                    })}
                />
                <div className="connector connector-right">

                    <Icon size={16} glyph='ArrowExternal' />
                </div>
            </div>
            {p.actions?.filter((action) => (!isExpanded ? action.isConnected : true)).map((action) => {
                const id = `${p.id}-${action.id}`;
                return <div
                    key={id}
                    className={classNames('action', {
                        active: action.isActive,
                    })}
                    onMouseEnter={() => p.onHoverAction(id, true)}
                    onMouseLeave={() => p.onHoverAction(id, false)}
                    onClick={() => p.onClickAction(id)}
                >
                    {action.name}
                    <div
                        id={id}
                        className={classNames('connector connector-right', {
                            connected: action.isConnected,
                        })}
                    />
                </div>;
            })}
            {!p.actions?.every((a) => a.isConnected) && <div
                className="action expand"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? 'Показать меньше' : 'Показать больше'}
                <Icon size={16} glyph={isExpanded ? 'ArrowChevronUp' : 'ArrowChevronDown'} />
            </div>}
        </StageNodeWrapper>;
    });
