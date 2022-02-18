import React from 'react';
import {default as SliderComponent} from 'react-input-slider';
import {css, useTheme} from '@emotion/react';

export type SliderProps = {
  onChange: (val: number)=>void;
  value: number;
  color?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const Slider = ({
    onChange,
    value,
    color,
    min,
    max,
    step,
    disabled,
}: SliderProps) => {
    const theme = useTheme();

    return (
        <SliderComponent
            disabled={disabled}
            axis="x"
            x={value}
            onChange={({x}) => onChange(x)}
            xmin={min}
            xmax={max}
            xstep={step}
            styles={{
                track: {
                    backgroundColor: theme.colors.grayscale.input,
                    height: 12,
                    width: '100%',
                },
                active: {
                    backgroundColor: color || theme.colors.primary.default,
                },
                thumb: css`
                    border: 2px solid ${color || theme.colors.primary.default};
                    position: relative;
                    display: block;
                    content: "|";
                    width: 32px;
                    height: 32px;
                    background-color: #fff;
                    border-radius: 50%;
                    /* box-shadow: 0 1px 1px rgb(0 0 0 / 50%); */
                    user-select: none;
                    cursor: pointer;
                    box-sizing: border-box;
                    &::after {
                      content: "";
                      position: absolute;
                      top: 9px;
                      bottom: 9px;
                      background-color: ${color || theme.colors.primary.default};
                      width: 2px;
                      left: calc(50% - 1px);
                      border-radius: 1px;
                    }
                `,
                disabled: {
                    opacity: 0.5,
                },
            }}
        />);
};
export default Slider;
