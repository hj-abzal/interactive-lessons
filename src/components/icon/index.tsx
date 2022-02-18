import React from 'react';
import glyphs from './glyphs';
import {css} from '@emotion/react';
import {GlyphType} from '@/components/icon/glyphs';

export interface IconProps {
  glyph: GlyphType;
  color?: string;
  size?: number;
  className?: string;
}

function Icon({glyph, color, size, className}: IconProps) {
    const IconItem = glyphs[glyph];

    if (!IconItem) {
        return null;
    }

    return (
        <IconItem
            className={className}
            css={css`
              fill: ${color || 'currentColor'};
              width: ${size || 24}px;
              height: ${size || 24}px;
              display: block;
            `}
        />
    );
}

export default Icon;
