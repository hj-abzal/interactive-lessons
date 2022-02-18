import React, {useMemo} from 'react';
import {css} from '@emotion/react';
import {NodeTextType, TextAlignEnum, WithChildren} from '../types';
import Markdown from 'markdown-to-jsx';
import {getCoordsStyles} from './node-object';

const NodeText = ({
    isHidden,
    filter,
    transform,
    coords,
    align,
    text,
    color,
    children,
    getCurrentInteractionListeners,
}: WithChildren<NodeTextType>) => {
    const interactionListeners = useMemo(() =>
        getCurrentInteractionListeners(), [getCurrentInteractionListeners]);

    return (
        <div
            {...interactionListeners}
            css={css`
              position: absolute;
              text-align: ${{
            [TextAlignEnum.Center]: 'center',
            [TextAlignEnum.Left]: 'left',
            [TextAlignEnum.Right]: 'right',
        }[align] || 'left'};
              ${getCoordsStyles(coords)}
              width: auto;
              height: auto;
              pointer-events: ${isHidden ? 'none' : 'all'};
              opacity: ${isHidden ? 0 : 1};
              transform: ${`translateX(${{
            [TextAlignEnum.Center]: '-50%',
            [TextAlignEnum.Left]: '0%',
            [TextAlignEnum.Right]: '-100%',
        }[align]}) ${transform ? transform : ''}`};
              transform-style: preserve-3d;
              transition: 0.2s ease, top 0s, left 0s;
              filter: ${filter || 'none'};
              user-select: none;
              * {
                white-space: nowrap;
                color: ${color ? `${color} !important` : 'inherit'};
              }
              
              em {
                font-style: italic;
              }
            `}>
            <Markdown options={{
                forceBlock: true,
            }}>{text || ''}</Markdown>
            {children}
        </div>
    );
};

export default NodeText;
