import styled from '@emotion/styled';
import {PAGE_WIDTH} from '@/const';

type LayerProps = {
    opacity?: number;
    filter?: string;
    transform?: string;
    width?: number;
    contentHeight?: number;
    contentWidth?: number;
};

export const Layer = styled.img<LayerProps>`
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

export const Wrapper = styled.div`
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;
