import React, {useEffect} from 'react';
import {css} from '@emotion/react';
import {Simulation} from '@/lessons/eco-mixed-forest/components/simulation';
import {OnboardingStatus, useTrainerStages} from '@/lessons/eco-mixed-forest/scenarios/trainer/steps/task/stages';
import Button from '@/components/button';
import CornerWrapper from '@/components/corner-wrapper';
import {useSmartViewportWrapper} from '@/context-providers/smart-viewport-wrapper';

export const Task = () => {
    const {handlerResize} = useSmartViewportWrapper();

    const {
        stageState,
        setMembersPopulation,
        simulationPositions,
        onNavButtonClick,
        onSelectAnswer,
        membersPair,
    } = useTrainerStages();

    useEffect(() => {
        handlerResize();
    }, []);

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
                onSelectAnswer={onSelectAnswer}
                membersPopulation={stageState.membersPopulation}
                membersPair={membersPair}
                selector={!stageState.selector.hide ? stageState.selector : undefined}
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
