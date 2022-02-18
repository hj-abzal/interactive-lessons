import Slider, {SliderProps} from '@/components/slider';
import Card from '@/components/card';
import React from 'react';
import {css} from '@emotion/react';

export type SliderConfig = SliderProps & {
    shouldShowTitle?: boolean,
    name?: string,
    leftLegend?: string,
    rightLegend?: string,
}

export type Props = {
    shouldShowTitle?: boolean,
    isHidden?: boolean,
    coords?: {
        x: number,
        y: number,
    },
    sliders?: SliderConfig[],
    name?: string,
    onSliderChange?: (sliderName: string, value: number) => void,
}

export const SlidersCard = (p: Props) => {
    return (
        <div css={css`
            display: ${p.isHidden ? 'none' : 'block'};
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            
            .sl-card-content {
                pointer-events: all;
                position: absolute;
                left: ${p.coords?.x}%;
                top: ${p.coords?.y}%;
            }

            .sliders-card-slider {
               margin-bottom: 18px;
            }
            
            .slider-legend {
              display: flex;
              justify-content: space-between;
              margin-top: 8px;
            }
            
            .sliders-container {
              width: 400px;
            }
        `}>
            <div className="sl-card-content">
                <Card>
                    {p.shouldShowTitle && <h3>{p.name}</h3>}

                    <div className='sliders-container'>
                        {p.sliders?.map((slider, ind) => (
                            <div key={`${slider.name}-${ind}`} className='sliders-card-slider'>
                                {(slider.name && slider.shouldShowTitle) && <h5>{slider.name}</h5>}

                                <div className="slider-component">
                                    <Slider
                                        min={Number(slider.min)}
                                        max={Number(slider.max)}
                                        value={Number(slider.value)}
                                        step={Number(slider.step)}
                                        color={slider.color}
                                        disabled={slider.disabled}
                                        onChange={(val) => p.onSliderChange?.call(null, slider.name!, Number(val))}
                                    />
                                </div>

                                {(slider.leftLegend || slider.rightLegend) &&
                                <div className="slider-legend">
                                    {slider.leftLegend && <span>{slider.leftLegend}</span> }
                                    {slider.rightLegend && <span>{slider.rightLegend}</span> }
                                </div>
                                }
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};
