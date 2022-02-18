import React, {useCallback, useEffect} from 'react';
import {Forest} from '@/lessons/eco-mixed-forest/components/forest';
import {css} from '@emotion/react';
import {useSimulator} from '@/lessons/eco-mixed-forest/scenarios/simulator/context';
import {
    MessagesTags,
    Stages,
    useForestStages
} from '@/lessons/eco-mixed-forest/scenarios/simulator/steps/forest/stages';
import {BiosphereType, MemberType} from '@/lessons/eco-mixed-forest/context/types';
import {useChat} from '@/context-providers/chat';
import {Ocean} from '@/lessons/eco-mixed-forest/components/ocean';

export const ForestStep = () => {
    const simulator = useSimulator();
    const {currentPairTask, biosphereType} = simulator.state;

    const chat = useChat();

    const {stager, stageState, produceStageState} = useForestStages();

    const targetMembers = {
        [currentPairTask.targetPair.first.memberType]: true,
        [currentPairTask.targetPair.second.memberType]: true,
    };

    const onButtonClick = () => {
        if (stageState.navButton.runStage) {
            stager.runStage(stageState.navButton.runStage);
        }
    };

    const onMemberSelect = useCallback((type: MemberType) => {
        if (!stageState.isSelectionAvailable) {
            return;
        }

        if (stageState.selectedMembers.includes(type)) {
            produceStageState((draft) => {
                draft.selectedMembers = draft.selectedMembers
                    .filter((t) => t !== type);
            });
            return;
        }

        if (stageState.selectedMembers.length === 0) {
            if (!chat.hasTag(MessagesTags.ClickObjectOnboarding)) {
                chat.sendMessage({
                    tag: MessagesTags.ClickObjectOnboarding,
                    text: 'Если захочешь отменить свой выбор, то нажми на организм еще раз.',
                });
            }

            produceStageState((draft) => {
                draft.selectedMembers[0] = type;
            });

            return;
        }

        if (stageState.selectedMembers.length >= 1) {
            produceStageState((draft) => {
                draft.selectedMembers[1] = type;
            });

            stager.runStage(Stages.ReadyToCheck);

            return;
        }
    }, [stager.currentStage, stageState]);

    useEffect(() => {
        if (
            stageState.navButton
            && stageState.navButton.title
            && !stageState.navButton.hide
        ) {
            chat.setButtons([{
                label: stageState.navButton.title,
                onClick: onButtonClick,
                ...stageState.navButton,
            }]);
        } else if (
            !stageState.navButton
            || !stageState.navButton.title
            || stageState.navButton.hide
        ) {
            chat.setButtons([]);
        }
    }, [stageState.navButton]);
    if (biosphereType === BiosphereType.Ocean) {
        return <div
            css={css`
              display: flex;
              width: 100%;
              height: 100%;
              position: relative;
            `}>
            <Ocean
                isClickable={stageState.isSelectionAvailable}
                isSelectionHighlighted={stageState.isSelectionHighlighted}
                selectedMembers={stageState.selectedMembers}
                onMemberClick={onMemberSelect}
                availableMembersMap={currentPairTask.members}
                targetMembers={targetMembers}
                showSelectionError={stageState.showSelectionError}
            />
        </div>;
    }
    return (
        <div
            css={css`
              display: flex;
              width: 100%;
              height: 100%;
              position: relative;
            `}
        >
            <Forest
                isClickable={stageState.isSelectionAvailable}
                isSelectionHighlighted={stageState.isSelectionHighlighted}
                selectedMembers={stageState.selectedMembers}
                onMemberClick={onMemberSelect}
                availableMembersMap={currentPairTask.members}
                targetMembers={targetMembers}
                showSelectionError={stageState.showSelectionError}
            />
        </div>
    );
};
