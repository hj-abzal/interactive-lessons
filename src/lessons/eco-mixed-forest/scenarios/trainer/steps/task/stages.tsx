import React, {useEffect} from 'react';
import {useSleep} from '@/utils/sleep';
import {useChat} from '@/context-providers/chat';
import {useImmerState} from '@/utils/use-immer-state';
import {useStages} from '@/utils/use-stages';
import {simulationConfig} from '@/lessons/eco-mixed-forest/context/simulation-config';
import {usePopup} from '@/context-providers/popup';
import {useTrainer} from '@/lessons/eco-mixed-forest/scenarios/trainer/context';
import {useTranslation} from 'react-i18next';
import {SelectItem, SelectProps} from '@/components/select-input';
import {ButtonProps} from '@/components/button';
import {BiosphereType, RelationType} from '@/lessons/eco-mixed-forest/context/types';
import {getTexts2ByType} from '@/lessons/eco-mixed-forest/context/texts-2-forest';
import {ResultPopup} from '@/lessons/eco-mixed-forest/scenarios/trainer/steps/task/result-popup';
import {getBiosphereTypeByMemberType} from '@/lessons/eco-mixed-forest/context/utils';
import {getTexts2ByTypeOcean} from '@/lessons/eco-mixed-forest/context/texts-2-ocean';
import _ from 'lodash';
import {useSberclass} from '@/context-providers/sberclass';

export enum Stages {
    Welcome = 'Welcome',

    Onboarding = 'Onboarding',

    Task = 'Task',

    Answer = 'Answer',

    Check = 'Check',

    Error = 'Error',

    Correct = 'Correct',

    Next = 'Next',

    NavigateNext = 'NavigateNext',

    Result = 'Result',
}

export enum MessageTags {
    ActionCall = 'ActionCall'
}

export enum OnboardingStatus {
    None = 'None',
    Active = 'Active',
    Passed = 'Passed',
}

export type SelectorProps = SelectProps & {
    title?: string,
    hide: boolean,
}

export type NavButton = ButtonProps & {
    hide: boolean,
    title?: string,
    runStage?: Stages,
}

export type StageState = {
    title?: string,
    controlsOnboardingStatus: OnboardingStatus,
    firstSlider: {
        disabled: boolean,
    },
    secondSlider: {
        disabled: boolean,
    },
    selectedAnswer?: RelationType,
    controlsTouched: boolean,
    membersPopulation: {
        first: number,
        second: number,
    },
    selector: SelectorProps,
    navButton: NavButton,
}

export const useTrainerStages = () => {
    const sleep = useSleep();
    const chat = useChat();
    const popuper = usePopup();
    const sberclass = useSberclass();
    const {t} = useTranslation(['ekologiyaSoobshchestvIBiosfera', 'obshchee']);
    const trainer = useTrainer();

    const relationTypeOptions = _.uniqBy(trainer.tasks.map((t) => ({
        label: t.relationType,
        value: t.relationType,
    })), (opt) => opt.value);

    const {
        defaultPositions,
        simulationPositions,
    } = simulationConfig[trainer.currentTask.relationType];

    const membersPair = {
        first: trainer.currentTask.targetPair.first.memberType,
        second: trainer.currentTask.targetPair.second.memberType,
    };

    const [stageState, produceStageState] = useImmerState<StageState>({
        title: undefined,
        controlsOnboardingStatus: trainer.withOnboarding ? OnboardingStatus.None : OnboardingStatus.Passed,
        controlsTouched: false,
        firstSlider: {
            disabled: true,
        },
        selectedAnswer: undefined,
        secondSlider: {
            disabled: true,
        },
        selector: {
            hide: true,
            options: relationTypeOptions,
        },
        membersPopulation: {
            first: defaultPositions.first.value,
            second: defaultPositions.second.value,
        },
        navButton: {
            hide: true,
        },
    });

    const stager = useStages({
        async [Stages.Welcome]() {
            chat.setButtons([]);
            chat.clearMessages();
            popuper.hidePopup();

            produceStageState(() => {
                return {
                    title: undefined,
                    controlsOnboardingPassed: !trainer.withOnboarding,
                    controlsTouched: false,
                    firstSlider: {
                        disabled: true,
                    },
                    selectedAnswer: undefined,
                    secondSlider: {
                        disabled: true,
                    },
                    selector: {
                        hide: true,
                        placeholder: 'Выбери тип отношений',
                        options: relationTypeOptions,
                    },
                    membersPopulation: {
                        first: defaultPositions.first.value,
                        second: defaultPositions.second.value,
                    },
                    navButton: {
                        hide: true,
                    },
                };
            });

            if (trainer.currentTaskInd === 0) {
                await chat.typeMessage({
                    delay: 1000,
                    text: `
                       В этом тренажёре тебе предлагается определить типы отношений между организмами.
                    `,
                });

                await chat.typeMessage({
                    delay: 500,
                    text: `
                      Для определения необходимо будет анализировать влияние численностей организмов друг на друга.
                    `,
                });

                await chat.typeMessage({
                    tag: MessageTags.ActionCall,
                    delay: 3000,
                    text: 'Нажми **Далее**, чтобы продолжить.',
                    asMarkdown: true,
                });

                chat.setButtons([{
                    label: 'Далее',
                    onClick: () => {
                        stager.runStage(Stages.Onboarding);
                        chat.clearMessages(MessageTags.ActionCall);
                        chat.setButtons([]);
                    },
                }]);
            } else {
                return Stages.Onboarding;
            }
        },

        async [Stages.Onboarding]() {
            if (trainer.currentTaskInd === 0) {
                await chat.typeMessage({
                    delay: 1000,
                    text: t('ekologiyaSoobshchestvIBiosfera:replica6'),
                });

                await chat.typeMessage({
                    delay: 3000,
                    text: t('ekologiyaSoobshchestvIBiosfera:replica7'),
                });

                produceStageState((draft) => {
                    draft.controlsOnboardingStatus = OnboardingStatus.Active;
                    draft.firstSlider.disabled = false;
                    draft.secondSlider.disabled = false;
                });

                await sleep(3000);

                produceStageState((draft) => {
                    draft.controlsOnboardingStatus = OnboardingStatus.Passed;
                });
            }

            produceStageState((draft) => {
                draft.firstSlider.disabled = false;
                draft.secondSlider.disabled = false;
            });

            await chat.typeMessage({
                delay: 1000,
                asMarkdown: true,
                text: t('ekologiyaSoobshchestvIBiosfera:interaction14'),
            });

            return Stages.Task;
        },

        async [Stages.Task]() {
            return;
        },

        async [Stages.Answer]() {
            await chat.typeMessage({
                text: t('ekologiyaSoobshchestvIBiosfera:interaction16'),
                delay: 1000,
            });

            produceStageState((draft) => {
                draft.selector.hide = false;
            });

            return;
        },

        async [Stages.Check]() {
            produceStageState((draft) => {
                draft.navButton.hide = true;
                draft.selector.disabled = true;
            });

            if (stageState.selectedAnswer === trainer.currentTask.relationType) {
                return Stages.Correct;
            } else {
                return Stages.Error;
            }
        },

        async [Stages.Error]() {
            produceStageState((draft) => {
                draft.selector.isError = true;
            });

            const bioType = getBiosphereTypeByMemberType(trainer.currentTask.targetPair.first.memberType);

            trainer.addError();

            // eslint-disable-next-line
            const text = bioType === BiosphereType.Forest
                // eslint-disable-next-line max-len
                ? `Эта ситуация демонстрирует отношения **${getTexts2ByType(trainer.currentTask.relationType)['тип']}** .`
                // eslint-disable-next-line max-len
                : `Эта ситуация демонстрирует отношения **${getTexts2ByTypeOcean(trainer.currentTask.relationType)['тип']}** .`;

            await chat.typeMessage({
                delay: 1000,
                asMarkdown: true,
                text,
            });

            return Stages.Next;
        },

        async [Stages.Correct]() {
            trainer.addPassedCount();
            await chat.typeMessage({
                delay: 1000,
                text: 'Верно!',
            });

            return Stages.Next;
        },

        async [Stages.Next]() {
            await chat.typeMessage({
                delay: 1000,
                asMarkdown: true,
                text: 'Нажми **Далее**, чтобы продолжить.',
            });

            chat.setButtons([{
                label: 'Далее',
                rightIcon: 'ArrowChevronForward',
                onClick: () => stager.runStage(Stages.NavigateNext),
            }]);

            return Stages.Next;
        },

        async [Stages.NavigateNext]() {
            if (trainer.errorsCount >= 3) {
                popuper.addPopup({
                    id: 'results',
                    content: <ResultPopup
                        errorsCount={trainer.errorsCount}
                        tasksCount={trainer.tasks.length}
                        passedTasks={trainer.passedCount}
                        isPassed={false}
                        onRetry={() => {
                            trainer.reset();
                            stager.runStage(Stages.Welcome);
                        }}
                    />,
                });

                sberclass.sendTaskResultRequest('FAILED');
            } else if (trainer.currentTaskInd < (trainer.tasks.length - 1)) {
                trainer.startNextTask();

                return Stages.Welcome;
            } else {
                popuper.addPopup({
                    id: 'results',
                    content: <ResultPopup
                        isPassed={true}
                        errorsCount={trainer.errorsCount}
                        tasksCount={trainer.tasks.length}
                        passedTasks={trainer.passedCount}
                        onRetry={() => {
                            trainer.reset();
                            stager.runStage(Stages.Welcome);
                        }}
                    />,
                });

                sberclass.sendTaskResultRequest('ACCEPTED');
            }
        },
    }, Stages.Welcome);

    const setMembersPopulation = ({first, second}: {first?: number, second?: number}) => {
        if (!stageState.controlsTouched) {
            produceStageState((draft) => {
                draft.controlsTouched = true;
            });
        }

        produceStageState((draft) => {
            if (first) {
                if (first === simulationPositions.first['1'].value) {
                    draft.membersPopulation.first = simulationPositions.first['1'].value;
                    draft.membersPopulation.second = simulationPositions.first['1'].secondValue
                        || draft.membersPopulation.second;

                    return;
                }
                if (first === simulationPositions.first['2'].value) {
                    draft.membersPopulation.first = simulationPositions.first['2'].value;
                    draft.membersPopulation.second = simulationPositions.first['2'].secondValue
                        || draft.membersPopulation.second;

                    return;
                }
                if (first === simulationPositions.first['3'].value) {
                    draft.membersPopulation.first = simulationPositions.first['3'].value;
                    draft.membersPopulation.second = simulationPositions.first['3'].secondValue
                        || draft.membersPopulation.second;

                    return;
                }
            }

            if (second) {
                if (second === simulationPositions.second['1'].value) {
                    draft.membersPopulation.second = simulationPositions.second['1'].value;
                    draft.membersPopulation.first = simulationPositions.second['1'].firstValue
                        || draft.membersPopulation.first;

                    return;
                }

                if (second === simulationPositions.second['2'].value) {
                    draft.membersPopulation.second = simulationPositions.second['2'].value;
                    draft.membersPopulation.first = simulationPositions.second['2'].firstValue
                        || draft.membersPopulation.first;

                    return;
                }

                if (second === simulationPositions.second['3'].value) {
                    draft.membersPopulation.second = simulationPositions.second['3'].value;
                    draft.membersPopulation.first = simulationPositions.second['3'].firstValue
                        || draft.membersPopulation.first;

                    return;
                }
            }
        });
    };

    const onNavButtonClick = () => {
        if (stageState.navButton.runStage) {
            stager.runStage(stageState.navButton.runStage);
        }
    };

    const onSelectAnswer = (selectedItem: SelectItem) => {
        produceStageState((draft) => {
            draft.selectedAnswer = selectedItem.value as RelationType;
            draft.navButton = {
                hide: false,
                title: 'Проверить',
                runStage: Stages.Check,
            };
        });
    };

    useEffect(() => {
        if (stageState.controlsTouched && stager.is(Stages.Task)) {
            stager.runStage(Stages.Answer);
        }
    }, [stageState.controlsTouched, stager.currentStage]);

    return {
        stager,
        stageState,
        produceStageState,
        onSelectAnswer,
        setMembersPopulation,
        membersPair,
        onNavButtonClick,
        simulationPositions,
    };
};
