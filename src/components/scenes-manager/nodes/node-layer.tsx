import React from 'react';
import {css} from '@emotion/react';
import {getImage} from '@/codgen/all-images';
import {NodeLayerType, WithChildren} from '../types';

const NodeLayer = ({
    src,
    isHidden,
    filter,
    transform,
    transition,
    children,
    isUnclickable,
}: WithChildren<NodeLayerType>) => {
    return (
        <div
            css={css`
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              height: auto;
              background-image: url(${getImage(src) || src});
              background-position: center center;
              background-size: cover;
              pointer-events: ${isUnclickable || isHidden ? 'none' : 'all'};
              opacity: ${isHidden ? 0 : 1};
              transform: ${transform ? transform : 'none'};
              transition: ${transition ? transition : '0.5s ease'};
              filter: ${filter ? filter : 'none'};
              user-select: none;
            `}>
            {children}
        </div>
    );
};

export default NodeLayer;
