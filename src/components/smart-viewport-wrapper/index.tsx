import React, {useEffect} from 'react';
import styled from '@emotion/styled';
import {defaultTheme} from '@/context-providers/theme/themes';
import {useSmartViewportWrapper} from '@/context-providers/smart-viewport-wrapper';

interface IStyledWrapperChildren {
    wrapperWidth: number;
    wrapperHeight: number;
    windowWidth: number;
    windowHeight: number;
    zoom: number;
  }

const StyledScreenWrapper = styled.div<{bgColor: string}>`
    position: absolute;
    background: ${({bgColor}) => bgColor};
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transition: background-color 0.5s ease;
`;

const StyledWrapperChildren = styled.div<IStyledWrapperChildren>`
  position: absolute;
  top: ${({wrapperHeight, windowHeight, zoom}) => (windowHeight - wrapperHeight) / zoom / 2}px;
  left: ${({wrapperWidth, windowWidth, zoom}) => (windowWidth - wrapperWidth) / zoom / 2}px;
  width: ${({wrapperWidth, zoom}) => (wrapperWidth / zoom)}px;
  height: ${({wrapperHeight, zoom}) => (wrapperHeight / zoom)}px;
  overflow: visible;
  zoom: ${({zoom}) => zoom};
  -moz-transform: scale(${({zoom}) => zoom});
`;

export interface Props {
  children?: React.ReactNode;
}

export const SmartViewportWrapper = ({children}: Props) => {
    const {
        windowWidth,
        windowHeight,
        wrapperWidth,
        wrapperHeight,
        zoom,
        bgColor,
        disabledAspectRationWrapper,
        frameRef,
        inited,
        setInited,
    } = useSmartViewportWrapper();

    useEffect(() => {
        if (!inited && frameRef?.current) {
            setInited(true);
        }
    }, [frameRef?.current]);

    if (disabledAspectRationWrapper) {
        return (
            <>
                {children}
            </>
        );
    }

    return (
        <StyledScreenWrapper
            ref={frameRef}
            id="wrapper-16-9"
            bgColor={bgColor || defaultTheme.colors.grayscale.background}
        >
            <StyledWrapperChildren
                wrapperWidth={wrapperWidth}
                wrapperHeight={wrapperHeight}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
                zoom={zoom}
                id="content-16-9"
            >
                {children}
            </StyledWrapperChildren>
        </StyledScreenWrapper>
    );
};
