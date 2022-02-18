import React from 'react';
import {css, useTheme} from '@emotion/react';
export interface ProgressBarProps {
  value?: number;
  color?: string;
  label?: string;
}

const ProgressBar = ({value, color, label}: ProgressBarProps) => {
    const theme = useTheme();
    return (
        <div>
            {label && <div css={css`
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-bottom: 8px;
              .value {
                min-width: 40px;
                text-align: right;
              }
              > p {
                line-height: 20px;
              }
            `}>
                <p className='small'>{label}</p>
                <p className='small value'>{value?.toFixed() || 0}%</p>
            </div>}
            <div css={css`
              height: 12px;
              width: 100%;
              background: ${theme.colors.grayscale.input};
              border-radius: 6px;
              position: relative;
              margin-bottom: 16px;
              overflow: hidden;
              &::after {
                position: absolute;
                content: '';
                height: 100%;
                top: 0;
                left: 0;
                border-radius: 6px;
                transition: 0.5s ease;
                background-color: ${color || theme.colors.primary.default};
                width: ${value || 0}%;
              }
            `} />
        </div>
    );
};

export default ProgressBar;
