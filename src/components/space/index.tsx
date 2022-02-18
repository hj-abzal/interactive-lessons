import React from 'react';
import {css} from '@emotion/react';

export interface SpaceProps {
  className?: string;
  size: 2 | 4 | 8 | 12 | 16 | 24 | 32 | 48 | 56 | 64 | 96 | 128 | 160 | number;
  isInline?: boolean;
}

const Space = ({size, isInline, className}: SpaceProps) => {
    return (
        <div
            className={className}
            css={css`
              width: ${size}px;
              height: ${size}px;
              display: ${isInline ? 'inline-block' : 'block'};
            `}
        />
    );
};

export default Space;
