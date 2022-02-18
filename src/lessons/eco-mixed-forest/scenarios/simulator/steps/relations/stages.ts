/* eslint-disable max-len */
import {ActionButtonProps, SelectorProps} from '@/lessons/eco-mixed-forest/components/relationship';
import {useImmerState} from '@/utils/use-immer-state';
import {BiosphereType, RoleMark} from '@/lessons/eco-mixed-forest/context/types';
import {useSimulator} from '@/lessons/eco-mixed-forest/scenarios/simulator/context';
import {useChat} from '@/context-providers/chat';
import {useStages} from '@/utils/use-stages';
import {relationTypeText} from '@/lessons/eco-mixed-forest/context/texts-1-forest';
import {relationTypeText as relationTypeTextOcean} from '@/lessons/eco-mixed-forest/context/texts-1-ocean';
import {getTexts2ByPair} from '@/lessons/eco-mixed-forest/context/texts-2-forest';
import {getTexts2ByPairOcean} from '@/lessons/eco-mixed-forest/context/texts-2-ocean';
import {useEffect} from 'react';
import {useSmartViewportWrapper} from '@/context-providers/smart-viewport-wrapper';

enum Stages {
    Welcome = 'welcome',

    CheckRoleMarkAnswer = 'checkRoleMarkAnswer',
    ErrorRoleMarkAnswer = 'ErrorRoleMarkAnswer',
    CorrectRoleMarkAnswer = 'CorrectRoleMarkAnswer',
    FixAnswer = 'FixAnswer',

    Done = 'Done',
}

export type StageState = {
    completedStage?: Stages,
    subtitle: string,
    title: string,
    topSelector: SelectorProps,
    bottomSelector: SelectorProps,
    actionButton: ActionButtonProps & {
        stageToRun?: Stages,
        hide?: boolean,
    },
    navButton: {
        hide: boolean,
    }
}

export const roleMarkMap = {
    [RoleMark.Minus]: 'отрицательный',
    [RoleMark.Plus]: 'положительный',
    [RoleMark.Zero]: 'нейтральный',
};

export enum MessagesTags {
    CheckRoleStep = 'checkRoleStep',
    ActionCall = 'actionCall',
}

export const useRelationshipStages = () => {
    const chat = useChat();
    const simulator = useSimulator();
    const wrapper = useSmartViewportWrapper();

    const {currentPairTask, biosphereType} = simulator.state;

    const [stageState, produceStageState] = useImmerState<StageState>({
        title: `
                Как думаешь, если ${currentPairTask.targetPair.first.memberType} 
                и ${currentPairTask.targetPair.second.memberType} взаимодействуют,
                то какие эффекты эти организмы оказывают друг на друга?
        `,
        subtitle: `Тип отношений "${currentPairTask.relationType}"`,
        topSelector: {
            options: [],
            value: undefined,
            title: undefined,
            onChange: () => null,
            hidden: false,
        },
        bottomSelector: {
            options: [],
            value: undefined,
            title: undefined,
            onChange: () => null,
            hidden: false,
        },
        actionButton: {
            title: 'welcome',
            hide: false,
        },
        navButton: {
            hide: true,
        },
    });

    const stager = useStages({
        [Stages.Welcome]() {
            chat.clearMessages();
            wrapper.setBgColor();

            produceStageState((draft) => {
                const selectorOptions = Object.keys(roleMarkMap).map((key) => ({
                    label: roleMarkMap[key],
                    value: key,
                }));

                draft.topSelector = {
                    ...draft.topSelector,
                    options: selectorOptions,
                    placeholder: 'Выбери эффект.',
                };

                draft.bottomSelector = {
                    ...draft.bottomSelector,
                    options: selectorOptions,
                    placeholder: 'Выбери эффект.',
                };

                draft.actionButton.title = 'Проверить';
                draft.actionButton.disabled = true;
                draft.actionButton.stageToRun = Stages.CheckRoleMarkAnswer;
            });
        },

        [Stages.CheckRoleMarkAnswer]() {
            produceStageState((draft) => {
                draft.topSelector.disabled = true;
                draft.bottomSelector.disabled = true;
                draft.actionButton.disabled = true;
            });

            const isFirstCorrect = stageState.topSelector.value?.value
                === currentPairTask.targetPair.first.roleMark;

            const isSecondCorrect = stageState.bottomSelector.value?.value
                === currentPairTask.targetPair.second.roleMark;

            if (isFirstCorrect && isSecondCorrect) {
                return Stages.CorrectRoleMarkAnswer;
            }
            return Stages.ErrorRoleMarkAnswer;
        },

        async [Stages.ErrorRoleMarkAnswer]() {
            produceStageState((draft) => {
                draft.topSelector.isError = true;
                draft.bottomSelector.isError = true;
                draft.actionButton.disabled = true;
            });
            if (biosphereType === BiosphereType.Ocean) {
                await chat.typeMessage({
                    delay: 1500,
                    asMarkdown: true,
                    text: relationTypeTextOcean(currentPairTask.relationType).effect, //ocean
                });
            } else {
                await chat.typeMessage({
                    delay: 1500,
                    asMarkdown: true,
                    text: relationTypeText(currentPairTask.relationType).effect,
                });
            }

            await chat.typeMessage({
                delay: 3000,
                asMarkdown: true,
                tag: MessagesTags.ActionCall,
                text: 'Нажми **Исправить**, чтобы продолжить.',
            });

            produceStageState((draft) => {
                draft.actionButton = {
                    ...draft.actionButton,
                    title: 'Исправить',
                    disabled: false,
                    stageToRun: Stages.FixAnswer,
                };
            });
        },

        async [Stages.FixAnswer]() {
            produceStageState((draft) => {
                draft.topSelector = {
                    ...draft.topSelector,
                    isError: false,
                    value: {
                        value: currentPairTask.targetPair.first.roleMark,
                        label: roleMarkMap[currentPairTask.targetPair.first.roleMark],
                    },
                };

                draft.bottomSelector = {
                    ...draft.bottomSelector,
                    isError: false,
                    value: {
                        value: currentPairTask.targetPair.second.roleMark,
                        label: roleMarkMap[currentPairTask.targetPair.second.roleMark],
                    },
                };

                draft.actionButton.disabled = true;
            });

            await chat.typeMessage({
                delay: 1500,
                asMarkdown: true,
                tag: MessagesTags.ActionCall,
                text: 'Нажми **Далее**, чтобы продолжить.',
            });

            produceStageState((draft) => {
                draft.actionButton = {
                    ...draft.actionButton,
                    title: 'Далее',
                    disabled: false,
                    stageToRun: Stages.Done,
                };
            });
        },

        async [Stages.CorrectRoleMarkAnswer]() {
            let correctText;

            if (biosphereType === BiosphereType.Ocean) {
                correctText = 'Верно! ' + getTexts2ByPairOcean( //ocean
                    currentPairTask.relationType,
                    currentPairTask.name
                )['отношения'];
            } else {
                correctText = 'Верно! ' + getTexts2ByPair(
                    currentPairTask.relationType,
                    currentPairTask.name
                )['отношения'];
            }

            produceStageState((draft) => {
                draft.actionButton = {
                    ...draft.actionButton,
                    title: 'Далее',
                    disabled: true,
                    stageToRun: Stages.Done,
                };
            });

            await chat.typeMessage({
                delay: 1500,
                text: correctText,
            });

            await chat.typeMessage({
                delay: 1500,
                asMarkdown: true,
                tag: MessagesTags.ActionCall,
                text: 'Нажми **Далее**, чтобы продолжить.',
            });

            produceStageState((draft) => {
                draft.actionButton.disabled = false;
            });

            return;
        },

        async [Stages.Done]() {
            produceStageState((draft) => {
                if (biosphereType === BiosphereType.Ocean) {
                    draft.topSelector.title = getTexts2ByPairOcean(currentPairTask.relationType, currentPairTask.name)['над стрелкой0']; // тут не очень правильно написано внутри или в логике
                    draft.topSelector.hidden = true;
                    draft.bottomSelector.title = getTexts2ByPairOcean(currentPairTask.relationType, currentPairTask.name)['под стрелкой 0'];
                    draft.bottomSelector.hidden = true;
                } else {
                    draft.topSelector.title = getTexts2ByPair(currentPairTask.relationType, currentPairTask.name).z9;
                    draft.topSelector.hidden = true;
                    draft.bottomSelector.title = getTexts2ByPair(currentPairTask.relationType, currentPairTask.name).z10;
                    draft.bottomSelector.hidden = true;
                }

                draft.actionButton.hide = true;
            });

            let texts;
            if (biosphereType === BiosphereType.Ocean) {
                texts = getTexts2ByPairOcean(currentPairTask.relationType, currentPairTask.name);
            } else {
                texts = getTexts2ByPair(currentPairTask.relationType, currentPairTask.name);
            }
            await chat.typeMessage({
                asMarkdown: true,
                delay: 1000,
                text: `Тип отношений **${texts['тип']}** обозначается **${texts['тип0']}**`,
            });

            await chat.typeMessage({
                delay: 1500,
                asMarkdown: true,
                text: 'Давай посмотрим, как взаимосвязаны популяции этих организмов. Нажми **Далее**, чтобы продолжить.',
            });

            produceStageState((draft) => {
                draft.navButton.hide = false;
            });
        },
    }, Stages.Welcome);

    useEffect(() => {
        if (
            stageState.topSelector.value
            && stageState.bottomSelector.value
            && !stager.is(Stages.ErrorRoleMarkAnswer)
        ) {
            produceStageState((draft) => {
                draft.actionButton.disabled = false;
            });

            if (stager.is(Stages.Welcome) && !chat.hasTag(MessagesTags.ActionCall)) {
                chat.sendMessage({
                    tag: MessagesTags.ActionCall,
                    asMarkdown: true,
                    text: 'Нажми **Проверить**, если подтверждаешь свой выбор.',
                });
            }
        }
    }, [
        stageState.topSelector.value,
        stageState.bottomSelector.value,
        stager.currentStage
    ]);

    return {
        ...stager,
        produceStageState,
        stageState,
    };
};
