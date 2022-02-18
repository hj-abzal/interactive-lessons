import React, {useState} from 'react';
import {css, useTheme} from '@emotion/react';

export interface LayerObjectType {
  name?: string;
  src: string;
  x: number;
  y: number;
  w?: number;
  className?: string;
  filter?: string;
  transform?: string;
  onClick?: () => void;
  isActive?: boolean;
  isHidden?: boolean;
  isError?: boolean,
  isUnclickable?: boolean;
  isHighlighted?: boolean;
  isSetStylesOnMask?: boolean;
  ClickableMaskSVG?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  isSmallObject?: boolean;
  styles?: {
    default?: any;
    onHover?: any;
    onActive?: any;
    onError?: any,
    onMouseDown?: any;
  }
}

const LayerObject = ({
    src,
    x,
    y,
    w,
    onClick,
    isActive,
    isHidden,
    isError,
    isUnclickable,
    isSetStylesOnMask,
    filter,
    transform,
    className,
    ClickableMaskSVG,
    isSmallObject,
    styles,
}: LayerObjectType) => {
    const theme = useTheme();
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isMouseOver, setIsMouseOver] = useState(false);

    const defaultStyles = {
        onHover: css`
          cursor: pointer;
          transition: filter 0.1s ease;
          filter: drop-shadow(0px 0px 27px #FFFF00)  ${!isSmallObject || 'brightness(1.5)'};
        `,
        onActive: css`
          cursor: pointer;
          transition: filter 0.1s ease;
          filter: drop-shadow(0px 0px 16px #FFFF00)  ${!isSmallObject || 'brightness(1.5)'};
        `,
        onError: css`
          cursor: pointer;
          filter: ${isSmallObject
        ? `drop-shadow(0px 0px 3px ${theme.colors.error.default})  brightness(1.5)`
        : `drop-shadow(0px 0px 16px ${theme.colors.error.default})`};
        `,
        onMouseDown: css`
          cursor: pointer;
          filter: drop-shadow(0px 0px 16px #FFFF00);
        `,
    };

    return (
        <div
            onClick={!ClickableMaskSVG ? onClick : undefined}
            onMouseDown={!ClickableMaskSVG ? () => setIsMouseDown(true) : undefined}
            onMouseUp={!ClickableMaskSVG ? () => setIsMouseDown(false) : undefined}
            onMouseOver={!ClickableMaskSVG ? () => setIsMouseOver(true) : undefined}
            onMouseLeave={!ClickableMaskSVG ? () => setIsMouseOver(false) : undefined}
            className={className}
            css={css`
              position: absolute;
              left: ${x}%;
              top: ${y}%;
              width: ${w ? w + '%' : 'auto'};
              height: auto;
              pointer-events: ${isUnclickable || isHidden || ClickableMaskSVG ? 'none' : 'all'};
              opacity: ${isHidden ? 0 : 1};
              transform: ${transform ? transform : 'none'};
              transform-style: preserve-3d;
              transition: 
                filter 1s ease, 
                opacity 0.2s ease, 
                transform 0.5s ease, 
                left 1s ease, 
                top 1s ease;
              -webkit-transition: 
                -webkit-filter 1s ease, 
                opacity 0.2s ease, 
                transform 0.5s ease, 
                left 1s ease, 
                top 1s ease;
              filter: ${filter || 'none'};
              -webkit-filter: ${filter || 'none'};
              user-select: none;
              ${styles?.default}
              ${!isSetStylesOnMask && isActive && (styles?.onActive || defaultStyles.onActive)}
              ${!isSetStylesOnMask && (isMouseOver && !isActive) && (styles?.onHover || defaultStyles.onHover)}
              ${!isSetStylesOnMask && isMouseDown && (styles?.onMouseDown || defaultStyles.onMouseDown)}
              ${!isSetStylesOnMask && isError && (styles?.onError || defaultStyles.onError)}

              & > img {
                width: 100%;
                position: relative;
              }
            `}>
            {ClickableMaskSVG &&
            <ClickableMaskSVG
                css={css`
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  opacity: 1;
                  svg {
                    pointer-events: none;
                  }
                  path {
                    pointer-events: auto;
                    pointer-events: ${isUnclickable || isHidden ? 'none' : 'all'};
                    user-select: none;
                    opacity: 1;
                    fill: ${isSetStylesOnMask ? '#777' : 'transparent'};
                  }
                  ${isSetStylesOnMask && isActive && (styles?.onActive || defaultStyles.onActive)}
                  ${isSetStylesOnMask && isMouseOver && (styles?.onHover || defaultStyles.onHover)}
                  ${isSetStylesOnMask && isMouseDown && (styles?.onMouseDown || defaultStyles.onMouseDown)}
                  ${isSetStylesOnMask && isError && (styles?.onError || defaultStyles.onError)}
                `}
                onClick={onClick}
                onMouseDown={() => setIsMouseDown(true)}
                onMouseUp={() => setIsMouseDown(false)}
                onMouseOver={() => setIsMouseOver(true)}
                onMouseLeave={() => setIsMouseOver(false)}
            />}
            <img src={src} />
        </div>
    );
};

export default LayerObject;
