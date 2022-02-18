import {useSleep} from '@/utils/sleep';
import {useChat} from '@/context-providers/chat';
import {useSimulator} from '@/lessons/eco-mixed-forest/scenarios/simulator/context';
import {useImmerState} from '@/utils/use-immer-state';
import {useStages} from '@/utils/use-stages';
import {ButtonProps} from '@/components/button';
import {useHistory} from 'react-router-dom';
import {relationTypeText} from '@/lessons/eco-mixed-forest/context/texts-1-forest';
import {relationTypeText as relationTypeTextOcean} from '@/lessons/eco-mixed-forest/context/texts-1-ocean';
import {
    BiosphereType,
    EducationTask,
    ForestMemberType,
    MemberType,
    OceanMemberType,
    RelationType
} from '@/lessons/eco-mixed-forest/context/types';
import {ecoMixedBiosphereRouter} from '@/lessons/eco-mixed-forest/routes';
import {useEffect} from 'react';
import {createNeutralismTask, isMemberTypeRelevant} from '@/lessons/eco-mixed-forest/context/utils';
import {useTranslation} from 'react-i18next';

export enum Stages {
    Welcome = 'Welcome',
    SelectPair = 'SelectPair',

    ReadyToCheck = 'ReadyToCheck',
    CheckAnswer = 'CheckAnswer',

    ShowHint = 'ShowHint',

    Error = 'Error',
    Done = 'Done',

    GoNext = 'GoNext',
}
const queryParamsIds = ecoMixedBiosphereRouter.routes.simulator.queryParams;

type NavButtonProps = ButtonProps & {
    hide?: boolean,
    title?: string,
    runStage?: Stages,
}

export type StageState = {
    completedStage?: Stages,
    title: string,
    navButton: NavButtonProps,
    isSelectionAvailable: boolean,
    isSelectionHighlighted: boolean,
    showSelectionError: boolean,
    selectedMembers: MemberType[],
}

export enum MessagesTags {
    ActionCall = 'actionCall',
    Onboarding = 'Onboarding',
    Hint = 'Hint',

    ClickObjectOnboarding = 'ClickObjectOnboarding',
}

export const useForestStages = () => {
    const sleep = useSleep();
    const chat = useChat();
    const simulator = useSimulator();
    const history = useHistory();

    const {t} = useTranslation(['ekologiyaSoobshchestvIBiosfera', 'obshchee']);

    const {currentRelationType, relationPairTasks, withOnboarding, biosphereType, allTasks} = simulator.state;

    const {setCurrentPairTask} = simulator.actions;

    const [stageState, produceStageState] = useImmerState<StageState>({
        title: '',
        isSelectionAvailable: false,
        isSelectionHighlighted: false,
        showSelectionError: false,
        navButton: {
            hide: true,
        },
        selectedMembers: [],
    });

    const stager = useStages({
        async [Stages.Welcome]() {
            chat.clearMessages();
            chat.setButtons([]);

            await sleep(1000);

            if (!withOnboarding) {
                return Stages.SelectPair;
            }
            if (biosphereType === BiosphereType.Ocean) {
                await chat.typeMessage({
                    tag: MessagesTags.Onboarding,
                    delay: 1000,
                    text: t('ekologiyaSoobshchestvIBiosfera:replica22'),
                });
            } else {
                await chat.typeMessage({
                    tag: MessagesTags.Onboarding,
                    delay: 1000,
                    asMarkdown: true,
                    text: t('ekologiyaSoobshchestvIBiosfera:replica1'),
                });
            }

            await sleep(1500);

            await chat.typeMessage({
                tag: MessagesTags.Onboarding,
                delay: 1000,
                asMarkdown: true,
                text: t('ekologiyaSoobshchestvIBiosfera:replica2'),
            });

            await chat.typeMessage({
                tag: MessagesTags.ActionCall,
                asMarkdown: true,
                delay: 1500,
                text: 'Нажми **Далее**, чтобы продолжить.',
            });

            produceStageState((draft) => {
                draft.navButton = {
                    title: t('obshchee:dalee'),
                    hide: false,
                    runStage: Stages.SelectPair,
                };
            });
        },

        async [Stages.SelectPair]() {
            produceStageState((draft) => {
                draft.navButton.hide = true;
                draft.isSelectionAvailable = true;
            });

            chat.clearMessages();
            if (biosphereType === BiosphereType.Ocean) {
                await chat.typeMessage({
                    delay: 1000,
                    asMarkdown: true,
                    text: relationTypeTextOcean(currentRelationType).task1, //add ocean
                });
            } else {
                await chat.typeMessage({
                    delay: 1000,
                    asMarkdown: true,
                    text: relationTypeText(currentRelationType).task1,
                });
            }

            await chat.typeMessage({
                tag: MessagesTags.ActionCall,
                delay: 1000,
                asMarkdown: true,
                text: t('ekologiyaSoobshchestvIBiosfera:interaction19'),
            });
        },

        async [Stages.ReadyToCheck]() {
            produceStageState(((draft) => {
                draft.navButton = {
                    title: t('obshchee:dalee'),
                    hide: false,
                    runStage: Stages.CheckAnswer,
                };
            }));
        },

        async [Stages.CheckAnswer]() {
            chat.clearMessages(MessagesTags.ClickObjectOnboarding);
            chat.clearMessages(MessagesTags.ActionCall);

            produceStageState((draft) => {
                draft.isSelectionAvailable = false;
                draft.isSelectionHighlighted = true;
                draft.navButton.hide = true;
            });

            const isNeutralism = currentRelationType === RelationType.Neutralism;

            let relevantPairTask;

            if (!isNeutralism) {
                relevantPairTask = relationPairTasks.find((task) => {
                    return stageState.selectedMembers.some((type) => isMemberTypeRelevant(type, task.targetPair.first))
                        && stageState
                            .selectedMembers.some((type) => isMemberTypeRelevant(type, task.targetPair.second));
                });
            } else {
                relevantPairTask = allTasks.find((task) => {
                    return task.relationType !== RelationType.Neutralism
                        && stageState.selectedMembers.some((type) => isMemberTypeRelevant(type, task.targetPair.first))
                        && stageState.selectedMembers
                            .some((type) => isMemberTypeRelevant(type, task.targetPair.second));
                });
            }

            if (!isNeutralism && relevantPairTask) {
                setCurrentPairTask(relevantPairTask);

                return Stages.Done;
            } else if (isNeutralism && !relevantPairTask) {
                const task: EducationTask =
                    createNeutralismTask(stageState.selectedMembers[0], stageState.selectedMembers[1]);

                setCurrentPairTask(task);

                return Stages.Done;
            } else {
                return Stages.Error;
            }
        },

        async [Stages.Error]() {
            produceStageState((draft) => {
                draft.navButton = {
                    hide: true,
                };
                draft.showSelectionError = true;
            });

            chat.clearMessages(MessagesTags.ClickObjectOnboarding);

            let text;

            if (biosphereType === BiosphereType.Forest) {
                text = relationTypeText(currentRelationType).mistake;
            } else {
                text = relationTypeTextOcean(currentRelationType).mistake;
            }

            await chat.typeMessage({
                delay: 1000,
                text,
            });

            await chat.typeMessage({
                tag: MessagesTags.Hint,
                delay: 1000,
                asMarkdown: true,
                text: t('ekologiyaSoobshchestvIBiosfera:interaction17'),
            });

            produceStageState((draft) => {
                draft.navButton = {
                    hide: false,
                    title: t('ekologiyaSoobshchestvIBiosfera:action17'),
                    runStage: Stages.ShowHint,
                };
            });
        },

        async [Stages.ShowHint]() {
            produceStageState((draft) => {
                draft.navButton.hide = true;
            });

            chat.clearMessages(MessagesTags.Hint);
            chat.clearMessages(MessagesTags.ActionCall);

            let help ;
            let helpTypes;

            if (biosphereType === BiosphereType.Ocean) {
                help = relationTypeTextOcean(currentRelationType).help;// ocean
                helpTypes = relationTypeTextOcean(currentRelationType).helpTypes;// ocean
            } else {
                help = relationTypeText(currentRelationType).help;
                helpTypes = relationTypeText(currentRelationType).helpTypes;
            }

            const pairTask = relationPairTasks.find((task) => {
                if (biosphereType === BiosphereType.Ocean) {
                    return helpTypes.includes(task.targetPair.first.memberType as OceanMemberType); // ocean
                } else {
                    return helpTypes.includes(task.targetPair.first.memberType as ForestMemberType);
                }
            }) || relationPairTasks[0];

            setCurrentPairTask(pairTask);

            let firstMemberType = pairTask.targetPair.first.memberType;
            let secondMemberType = pairTask.targetPair.second.memberType;

            if (
                pairTask.targetPair.first.memberType === ForestMemberType.Birch
                && pairTask.targetPair.first.memberTypeVariants?.includes(ForestMemberType.BirchBig)
            ) {
                firstMemberType = ForestMemberType.BirchBig;
            }

            if (
                pairTask.targetPair.second.memberType === ForestMemberType.Birch
                && pairTask.targetPair.second.memberTypeVariants?.includes(ForestMemberType.BirchBig)
            ) {
                secondMemberType = ForestMemberType.BirchBig;
            }

            produceStageState((draft) => {
                draft.selectedMembers = [
                    firstMemberType,
                    secondMemberType
                ];

                draft.showSelectionError = false;
                draft.isSelectionHighlighted = true;
            });

            await chat.typeMessage({
                text: help,
                delay: 1000,
                asMarkdown: true,
            });

            return Stages.Done;
        },

        async [Stages.Done]({was}) {
            chat.clearMessages(MessagesTags.ActionCall);

            if (!was(Stages.Error)) {
                await chat.typeMessage({
                    asMarkdown: true,
                    delay: 1000,
                    text: 'Верно! Нажми **Далее**, чтобы продолжить.',
                });
            } else {
                await chat.typeMessage({
                    asMarkdown: true,
                    delay: 3000,
                    text: 'Нажми **Далее**, чтобы перейти к следующему шагу.',
                });
            }

            produceStageState((draft) => {
                draft.navButton = {
                    hide: false,
                    title: 'Далее',
                    runStage: Stages.GoNext,
                };
            });
        },

        [Stages.GoNext]() {
            if (biosphereType === BiosphereType.Ocean) {
                history.push(ecoMixedBiosphereRouter.build('simulatorRelationship', {}, {
                    [queryParamsIds.biosphere]: BiosphereType.Ocean,
                    [queryParamsIds.relationTypeInd]: simulator.state.currentRelationTypeInd,
                }));
            } else {
                history.push(ecoMixedBiosphereRouter.build('simulatorRelationship', {}, {
                    [queryParamsIds.biosphere]: BiosphereType.Forest,
                    [queryParamsIds.relationTypeInd]: simulator.state.currentRelationTypeInd,
                }));
            }
        },
    }, Stages.Welcome);

    useEffect(() => {
        if (stager.is(Stages.ReadyToCheck)) {
            if (stageState.selectedMembers.length < 2) {
                chat.clearMessages(MessagesTags.ActionCall);

                produceStageState(((draft) => {
                    draft.navButton.hide = true;
                }));
            } else {
                if (!chat.hasTag(MessagesTags.ActionCall)) {
                    chat.sendMessage({
                        tag: MessagesTags.ActionCall,
                        asMarkdown: true,
                        text: t('ekologiyaSoobshchestvIBiosfera:interaction6'),
                    });
                }

                produceStageState(((draft) => {
                    draft.navButton.hide = false;
                }));
            }
        }
    }, [stageState.selectedMembers, stager.currentStage]);

    return {
        stager,
        stageState,
        produceStageState,
    };
};
