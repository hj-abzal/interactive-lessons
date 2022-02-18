import React from 'react';
import styled from '@emotion/styled';

export type CardProps = {
  children: React.ReactNode;
  onboarding?: boolean;
  padding?: string | number;
  width?: string | number;
  borderColor?: string;
}

const Card = styled.div<CardProps>`
    position: relative;
    display: inline-block;
    padding: ${(p) => p.padding !== undefined
        ? (typeof p.padding === 'string'
            ? p.padding
            : `${p.padding}px`)
        : '20px'};
    width: ${(p) => p.width
        ? (typeof p.width === 'string'
            ? p.width
            : `${p.width}px`)
        : 'auto'};
    border-radius: 31px;
    background-color: ${(p) => p.theme.colors.grayscale.white};
    box-sizing: border-box;
    border: 0;
    
    transition: 0.3s ease-in-out box-shadow;

    ${(p) => p.onboarding ? p.theme.shadows.onboarding : p.theme.shadows.medium};



    &::before {
      content: "";
      pointer-events: none;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: 31px;
      transition: 0.2s ease-in-out border;
      border: 4px solid ${(p) => p.style?.borderColor || p.borderColor || 'transparent'};
      ${(p) => p.onboarding && `
        border: 4px solid rgba(255, 255, 0, 0.8);
      `}
    }
`;

export default Card;
