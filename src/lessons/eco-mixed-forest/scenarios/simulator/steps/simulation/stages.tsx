import {useSleep} from '@/utils/sleep';
import {useChat} from '@/context-providers/chat';
import {useSimulator} from '@/lessons/eco-mixed-forest/scenarios/simulator/context';
import {useImmerState} from '@/utils/use-immer-state';
import {useStages} from '@/utils/use-stages';
import {ButtonProps} from '@/components/button';
import {getTexts2ByPair} from '@/lessons/eco-mixed-forest/context/texts-2-forest';
import React, {useEffect} from 'react';
import {simulationConfig} from '@/lessons/eco-mixed-forest/context/simulation-config';
import {usePopup} from '@/context-providers/popup';
import {BiosphereType, RelationType} from '@/lessons/eco-mixed-forest/context/types';
import {AddtitionalInfoPopup} from './addtitional-info-popup';
import {getTexts2ByPairOcean} from '@/lessons/eco-mixed-forest/context/texts-2-ocean';
import {useSberclass} from '@/context-providers/sberclass';

export enum Stages {
    Welcome = 'Welcome',

    Onboarding = 'Onboarding',

    Simulation = 'Simulation',

    Done = 'Done',

    GoToStart = 'GoToStart'
}

type NavButtonProps = ButtonProps & {
    hide?: boolean,
    title?: string,
    runStage?: Stages,
}

export enum OnboardingStatus {
    None = 'None',
    Active = 'Active',
    Passed = 'Passed',
}

export enum PopupIds {
    Info = 'Info'
}

export type StageState = {
    title: string,
    navButton: NavButtonProps,
    graphOnboardingStatus: OnboardingStatus,
    controlsOnboardingStatus: OnboardingStatus,
    firstSlider: {
        disabled: boolean,
    },
    secondSlider: {
        disabled: boolean,
    },
    controlsTouched: boolean,
    membersPopulation: {
        first: number,
        second: number,
    },
    membersPositionsText?: string,
}

export const useSimulationStages = () => {
    const sleep = useSleep();
    const chat = useChat();
    const popuper = usePopup();
    const simulator = useSimulator();
    const sberclass = useSberclass();
    const {currentPairTask, withOnboarding, biosphereType} = simulator.state;
    const isOceanBiosphere = biosphereType === BiosphereType.Ocean;
    const {
        defaultPositions,
        simulationPositions,
    } = simulationConfig[currentPairTask.relationType];

    const [stageState, produceStageState] = useImmerState<StageState>({
        title: currentPairTask.relationType,
        navButton: {
            hide: true,
        },
        firstSlider: {
            disabled: true,
        },
        secondSlider: {
            disabled: true,
        },
        controlsTouched: false,
        controlsOnboardingStatus: OnboardingStatus.None,
        graphOnboardingStatus: OnboardingStatus.None,
        membersPopulation: {
            first: defaultPositions.first.value,
            second: defaultPositions.second.value,
        },
        membersPositionsText: undefined,
    });

    const stager = useStages({
        async [Stages.Welcome]() {
            chat.clearMessages();
            chat.setButtons([]);

            produceStageState(() => ({
                title: currentPairTask.relationType,
                navButton: {
                    hide: true,
                },
                firstSlider: {
                    disabled: true,
                    position: defaultPositions.first.position,
                },
                secondSlider: {
                    disabled: true,
                    position: defaultPositions.second.position,
                },
                controlsTouched: false,
                controlsOnboardingStatus: OnboardingStatus.None,
                graphOnboardingStatus: OnboardingStatus.None,
                membersPopulation: {
                    first: defaultPositions.first.value,
                    second: defaultPositions.second.value,
                },
            }));

            produceStageState(((draft) => {
                let texts;
                if (isOceanBiosphere) {
                    texts = getTexts2ByPairOcean(currentPairTask.relationType, currentPairTask.name); //add ocean
                } else {
                    texts = getTexts2ByPair(currentPairTask.relationType, currentPairTask.name); //add ocean
                }
                const text = `
                        ${texts['тип']} ${texts['тип0']}
                    `;

                draft.title = text;
            }));

            await chat.typeMessage({
                text: `
                        Перед тобой популяции выбранных организмов. Сейчас они уравновешены, 
                        но если изменить численность одних, 
                        то это также может отразиться и на численности других.
                      `,
            });

            if (!withOnboarding) {
                produceStageState((draft) => {
                    draft.graphOnboardingStatus = OnboardingStatus.Passed;
                    draft.controlsOnboardingStatus = OnboardingStatus.Passed;
                });
            }

            return Stages.Onboarding;
        },

        async [Stages.Onboarding]() {
            if (stageState.controlsOnboardingStatus === OnboardingStatus.Passed) {
                return Stages.Simulation;
            }

            await chat.typeMessage({
                delay: 2000,
                text: `
                        Ты можешь изменить численности организмов и увидеть изменения.
                      `,
            });

            produceStageState(((draft) => {
                draft.controlsOnboardingStatus = OnboardingStatus.Active;
            }));

            await sleep(2000);

            produceStageState(((draft) => {
                draft.controlsOnboardingStatus = OnboardingStatus.Passed;
            }));

            return Stages.Simulation;
        },

        async [Stages.Simulation]() {
            produceStageState((draft) => {
                draft.firstSlider.disabled = false;
                draft.secondSlider.disabled = false;
            });

            if ([RelationType.PredatorPrey, RelationType.ParasiteOwner]
                .includes(currentPairTask.relationType)
            ) {
                popuper.addPopup({
                    id: PopupIds.Info,
                    content: <AddtitionalInfoPopup relationType={currentPairTask.relationType} />,
                    shouldShow: false,
                    canClose: true,
                });

                chat.setButtons([{
                    label: 'Дополнительный материал',
                    theme: 'secondary',
                    onClick: () => popuper.showPopup(PopupIds.Info),
                }]);
            }
        },

        async [Stages.Done]() {
            if (isOceanBiosphere) {
                chat.sendMessage({
                    text: 'Нажми **Продолжить**, для перехода к следующему шагу.',
                    asMarkdown: true,
                });

                produceStageState(((draft) => {
                    draft.navButton = {
                        title: 'Продолжить',
                        hide: false,
                        runStage: Stages.GoToStart,
                    };
                }));
            } else {
                chat.sendMessage({
                    text: 'Нажми **Продолжить**, для перехода к следующему шагу.',
                    asMarkdown: true,
                });
                produceStageState(((draft) => {
                    draft.navButton = {
                        title: 'Продолжить',
                        hide: false,
                        runStage: Stages.GoToStart,
                    };
                }));
            }
        },

        [Stages.GoToStart]() {
            simulator.actions.nextRelationType();

            if (simulator.state.isLastTask) {
                sberclass.sendTaskResultRequest('ACCEPTED');
            }
        },
    }, Stages.Welcome);

    const setMembersPopulation = ({first, second}: { first?: number, second?: number }) => {
        const memberId = first ? 'first' : 'second';
        const oppositeMemberId = first ? 'second' : 'first';
        const oppositeMemberConfigKey = first ? 'secondValue' : 'firstValue';

        const value = first || second;

        const positionsConfig = Object
            .values(simulationPositions[memberId]).find((pos) => pos.value === value);

        produceStageState((draft) => {
            if (!stageState.controlsTouched) {
                draft.controlsTouched = true;
            }

            draft.membersPopulation[memberId] = positionsConfig.value;
            draft.membersPopulation[oppositeMemberId] = positionsConfig[oppositeMemberConfigKey]
                || draft.membersPopulation[oppositeMemberId];

            if (positionsConfig.text && !chat.hasTag(positionsConfig.text)) {
                draft.membersPositionsText = positionsConfig.text;
            }
        });
    };

    useEffect(() => {
        if (stageState.membersPositionsText && !chat.hasTag(stageState.membersPositionsText)) {
            chat.sendMessage({
                tag: stageState.membersPositionsText,
                text: stageState.membersPositionsText,
            });
        }
    }, [stageState.membersPositionsText]);

    const onNavButtonClick = () => {
        if (stageState.navButton.runStage) {
            stager.runStage(stageState.navButton.runStage);
        }
    };

    useEffect(() => {
        async function done() {
            if (stageState.controlsTouched && stager.is(Stages.Simulation)) {
                await sleep(5000);
                stager.runStage(Stages.Done);
            }
        }

        done();
    }, [stageState.controlsTouched]);

    return {
        stager,
        stageState,
        produceStageState,
        onNavButtonClick,
        setMembersPopulation,
        simulationPositions,
    };
};
