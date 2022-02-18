import {css} from '@emotion/react';
import styled from '@emotion/styled';
import {PAGE_WIDTH} from '@/const';

export const Layer = styled.img<{
        opacity?: number;
        filter?: string;
        transform?: string;
        width?: number;
        contentHeight?: number;
        contentWidth?: number;
    }>`
  position: relative;
  height: ${(p) => p.contentHeight + 'px' || '100%'};
  width: ${(p) => p.width ? ((p.contentHeight || 1) * 1.777777778 * p.width / PAGE_WIDTH) + 'px' : 'auto'};
  max-width: none;
  opacity: ${(p) => p.opacity || 1};
  transform: ${(p) => p.transform || 'none'};
  filter: ${(p) => p.filter || 'none'};
  -webkit-filter: ${(p) => p.filter || 'none'};
  transition: filter 2s ease;
  -webkit-transition: -webkit-filter 2s ease;
  user-select: none;
`;

export const ClickableObject = styled.img`
  height: 100%;
  max-width: none;
`;

export const Wrapper = styled.div<{
        screenWidth: number;
        transform?: string;
        filter?: string;
        isHidden?: boolean;
    }>`
    ${(p) => p.isHidden && css`
        visibility: hidden;
    `}
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    
    transition: filter 2s ease;
    -webkit-transition: -webkit-filter 2s ease;
    filter: ${(p) => p.filter || 'none'};
    -webkit-filter: ${(p) => p.filter || 'none'};
    ${(p) => p.transform && css`
        > div {
            transform: ${p.transform};
            transition: 1s ease;
        }
    `}
`;

export const outerStyle = {
    position: 'relative',
    // bottom: 0,
    // left: 0,
    overflow: 'hidden',
    minWidth: '100%',
    minHeight: '100%',
    backgroundColor: '#5ab1ae',
    pointerEvents: 'none',
};

export const getParallaxProps = (defaultLayerWidth: number, realScreenWidth: number, parallaxFactor?: number) => {
    const defaultScreenWidth = PAGE_WIDTH;
    const realLayerWidth = realScreenWidth / defaultScreenWidth * defaultLayerWidth;

    return {
        layerStyle: {
            position: 'absolute',
            height: '100%',
            transform: `translateX(${-(realLayerWidth - realScreenWidth) / 2}px)`,
        },
        config: {
            xFactor: ((realLayerWidth / realScreenWidth) - 1) *
            ((parallaxFactor !== undefined) ? parallaxFactor : 1),
            yFactor: 0,
            springSettings: {
                stiffness: 150,
                damping: 25,
            },
        }};
};
