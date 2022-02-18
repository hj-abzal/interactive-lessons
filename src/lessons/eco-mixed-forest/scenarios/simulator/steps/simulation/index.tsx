import {css} from '@emotion/react';
import React from 'react';
import {Simulation} from '@/lessons/eco-mixed-forest/components/simulation';
import {useSimulator} from '@/lessons/eco-mixed-forest/scenarios/simulator/context';
import {
    OnboardingStatus,
    useSimulationStages
} from '@/lessons/eco-mixed-forest/scenarios/simulator/steps/simulation/stages';
import CornerWrapper from '@/components/corner-wrapper';
import Button from '@/components/button';

export const SimulationStep = () => {
    const simulator = useSimulator();
    const {currentPairTask} = simulator.state;

    const membersPair = {
        first: currentPairTask.targetPair.first.memberType,
        second: currentPairTask.targetPair.second.memberType,
    };

    const {
        stageState,
        setMembersPopulation,
        simulationPositions,
        onNavButtonClick,
    } = useSimulationStages();

    return (
        <div
            css={css`
              display: flex;
              width: 100%;
              height: 100%;
              position: relative;
            `}
        >

            <Simulation
                title={stageState.title}
                setMembersPopulation={setMembersPopulation}
                simulationPositions={simulationPositions}
                membersPopulation={stageState.membersPopulation}
                membersPair={membersPair}
                firstSlider={stageState.firstSlider}
                secondSlider={stageState.secondSlider}
                controlsOnboarding={stageState.controlsOnboardingStatus === OnboardingStatus.Active}
            />

            <CornerWrapper position={'bottom-right'} >
                {!stageState.navButton.hide &&
                    <Button
                        onClick={onNavButtonClick}
                        rightIcon={stageState.navButton.rightIcon}
                    >
                        {stageState.navButton.title}
                    </Button>
                }
            </CornerWrapper>

        </div>
    );
};
