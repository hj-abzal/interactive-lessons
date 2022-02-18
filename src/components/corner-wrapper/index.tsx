import React from 'react';
import styled from '@emotion/styled';

import {
    LEFT_PADDING,
    RIGHT_PADDING,
    TOP_PADDING,
    BOTTOM_PADDING
} from '@/const';

const Wrapper = styled.div`
  position: absolute;
  z-index: 10;
  &.top-left {
    top: ${TOP_PADDING}px;
    left: ${LEFT_PADDING}px;
  }
  &.top-center {
    top: ${TOP_PADDING}px;
    left: 50%;
    transform: translateX(-50%);
  }
  &.top-right {
    top: ${TOP_PADDING}px;
    right: ${RIGHT_PADDING}px;
  }
  &.center-left {
    top: 50%;
    transform: translateY(-50%);
    left: ${LEFT_PADDING}px;
  }
  &.center-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &.center-right {
    top: 50%;
    transform: translateY(-50%);
    right: ${RIGHT_PADDING}px;
  }
  &.bottom-left {
    bottom: ${BOTTOM_PADDING}px;
    left: ${LEFT_PADDING}px;
  }
  &.bottom-center {
    bottom: ${BOTTOM_PADDING}px;
    left: 50%;
    transform: translateX(-50%);
  }
  &.bottom-right {
    bottom: ${BOTTOM_PADDING}px;
    right: ${RIGHT_PADDING}px;
  }
`;

export type CornerWrapperProps = {
  onClick?: any;
  onMouseOver?: any;
  onMouseLeave?: any;
  style?: any;
  children: React.ReactNode;
  className?: string,
  position:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center-center'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
};

const CornerWrapper = (props:CornerWrapperProps) => {
    return (
        <Wrapper {...props} className={[props.className, props.position].join(' ')}>
            {props.children}
        </Wrapper>
    );
};

export default CornerWrapper;
