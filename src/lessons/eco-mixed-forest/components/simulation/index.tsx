import React from 'react';
import {css, useTheme} from '@emotion/react';
import Card from '@/components/card';
import Space from '@/components/space';
import {SimulationLand} from '@/lessons/eco-mixed-forest/components/simulation-land';
import {MemberType} from '@/lessons/eco-mixed-forest/context/types';
import {SelectInput, SelectItem} from '@/components/select-input';
import Slider from '@/components/slider';
import {SimulationPositions} from '@/lessons/eco-mixed-forest/context/simulation-config';
import {SelectProps} from '@/components/select-input';

export type Props = {
    title?: string,
    membersPair: {
        first: MemberType,
        second: MemberType,
    },
    setMembersPopulation: (params: {first?: number, second?: number}) => void,
    onSelectAnswer?: (val: SelectItem) => void,
    membersPopulation: {
        first: number,
        second: number,
    },
    firstSlider: {
        disabled: boolean,
    },
    selector?: SelectProps,
    secondSlider: {
        disabled: boolean,
    }
    simulationPositions: SimulationPositions,
    controlsOnboarding?: boolean,
}

export const Simulation = ({
    title,
    membersPair,
    selector,
    membersPopulation,
    controlsOnboarding,
    onSelectAnswer,
    simulationPositions,
    setMembersPopulation,
    firstSlider,
    secondSlider,
}: Props) => {
    const theme = useTheme();

    return (
        <div
            css={css`
                display: flex;
                justify-content: center;
                padding: 30px 40px;
                width: 100%;
                
                .simulation-title {
                  text-transform: capitalize;
                }

                .simulation-controls {
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      width: 350px;
                      margin-top: ${selector ? '-200px' : '-40px'};
                }
                
                .simulation-slider {
                  margin-top: 18px;
                }

                .simulation-land {
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      height: 100%;
                      margin-right: 150px;
                }

                .simulation-population-plot {
                  margin-top: 12px;
                }
                
                .simulation-slider-legend {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 8px;
                }
                
                .simulation-population-control {
                      &.second {
                         margin-top: 18px;
                      }
                }
                
                .simulation-selector {
                  margin-top: 16px;
                }
            `}
        >

            <div className="simulation-layer simulation-land">
                {title &&
                    <h5 className="simulation-title">{title}</h5>
                }

                <SimulationLand
                    membersPopulation={membersPopulation}
                    membersPair={membersPair}
                />
            </div>

            <div className="simulation-layer simulation-controls">
                <Space size={14} />

                <Card onboarding={controlsOnboarding}>
                    <div className='simulation-population-control'>

                        <h5>{membersPair.first}</h5>

                        <div className='simulation-slider'>
                            <Slider
                                min={simulationPositions.first['1'].value}
                                max={simulationPositions.first['3'].value}
                                value={membersPopulation.first}
                                step={simulationPositions.first['3'].value - simulationPositions.first['2'].value}
                                color={theme.colors.primary.default}
                                disabled={firstSlider.disabled}
                                onChange={(value) =>
                                    setMembersPopulation({
                                        first: value,
                                    })}
                            />
                            <div className="simulation-slider-legend">
                                <span>меньше</span>
                                <span>больше</span>
                            </div>
                        </div>
                    </div>

                    <div className='simulation-population-control second'>

                        <h5>{membersPair.second}</h5>

                        <div className='simulation-slider'>
                            <Slider
                                min={simulationPositions.second['1'].value}
                                max={simulationPositions.second['3'].value}
                                value={membersPopulation.second}
                                step={simulationPositions.second['3'].value - simulationPositions.second['2'].value}
                                color={theme.colors.tiger.default}
                                disabled={secondSlider.disabled}
                                onChange={(value) =>
                                    setMembersPopulation({
                                        second: value,
                                    })}
                            />
                            <div className="simulation-slider-legend">
                                <span>меньше</span>
                                <span>больше</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {selector &&
                    <div className='simulation-selector'>
                        <SelectInput
                            disabled={selector.disabled}
                            isError={selector.isError}
                            options={selector.options}
                            onChange={onSelectAnswer}
                            value={selector.value}
                            placeholder={selector.placeholder}
                        />
                    </div>
                }
            </div>
        </div>
    );
};
