import React, {useEffect} from 'react';
import {css} from '@emotion/react';
import {useSimulator} from '@/lessons/eco-mixed-forest/scenarios/simulator/context';
import {Relationship} from '@/lessons/eco-mixed-forest/components/relationship';
import {useChat} from '@/context-providers/chat';
import {ecoMixedBiosphereRouter} from '@/lessons/eco-mixed-forest/routes';
import {
    MessagesTags,
    useRelationshipStages
} from '@/lessons/eco-mixed-forest/scenarios/simulator/steps/relations/stages';
import {useHistory} from 'react-router-dom';
import {BiosphereType} from '@/lessons/eco-mixed-forest/context/types';

const queryParamsIds = ecoMixedBiosphereRouter.routes.simulator.queryParams;

export const RelationsStep = () => {
    const chat = useChat();
    const simulator = useSimulator();

    const {biosphereType, currentPairTask} = simulator.state;
    const history = useHistory();

    const {stageState, runStage, produceStageState} = useRelationshipStages();

    const {
        topSelector,
        bottomSelector,
        actionButton,
    } = {
        topSelector: {
            ...stageState.topSelector,
            onChange: (option) => {
                produceStageState((draft2) => {
                    draft2.topSelector.value = {...option};
                });
            },
        },
        bottomSelector: {
            ...stageState.bottomSelector,
            onChange: (option) => {
                produceStageState((draft2) => {
                    draft2.bottomSelector.value = {...option};
                });
            },
        },
        actionButton: stageState.actionButton.hide
            ? undefined
            : {
                ...stageState.actionButton,
                onClick: () => {
                    if (stageState.actionButton.stageToRun) {
                        runStage(stageState.actionButton.stageToRun);
                        chat.clearMessages(MessagesTags.ActionCall);
                    }
                },
            },
    };

    useEffect(() => {
        if (
            stageState.navButton
            && !stageState.navButton.hide
            && (!chat.buttons?.length || chat?.buttons?.length === 0)
        ) {
            chat.setButtons([{
                label: 'Далее',
                onClick: () => {
                    let route;
                    if (biosphereType === BiosphereType.Ocean) {
                        route = ecoMixedBiosphereRouter.build('simulatorSimulation',
                            {},
                            {
                                relationTypeInd: String(simulator.state.currentRelationTypeInd),
                                [queryParamsIds.withOnboarding]: simulator.state.withOnboarding ? 1 : 0,
                                [queryParamsIds.biosphere]: BiosphereType.Ocean,
                            });
                    } else {
                        route = ecoMixedBiosphereRouter.build('simulatorSimulation',
                            {},
                            {
                                relationTypeInd: String(simulator.state.currentRelationTypeInd),
                                [queryParamsIds.withOnboarding]: simulator.state.withOnboarding ? 1 : 0,
                                [queryParamsIds.biosphere]: BiosphereType.Forest,
                            });
                    }

                    history.push(route!);
                },
                ...stageState.navButton,
            }]);
        } else if (
            !stageState.navButton
            || stageState.navButton.hide
        ) {
            chat.setButtons([]);
        }
    }, [stageState.navButton, simulator.state]);

    return (
        <div
            css={css`
              display: flex;
              width: 100%;
              height: 100%;
              position: relative;
            `}
        >
            <Relationship
                title={stageState.title}
                subtitle={stageState.subtitle}
                leftMember={currentPairTask.targetPair.first.memberType}
                rightMember={currentPairTask.targetPair.second.memberType}
                topSelector={topSelector}
                bottomSelector={bottomSelector}
                actionButtonProps={actionButton}
            />

            {/*{!stageState.navButton.hide &&*/}
            {/*    <CornerWrapper position={'bottom-right'} >*/}
            {/*        <Button*/}
            {/*            css={css`*/}
            {/*                    position: absolute;*/}
            {/*                    right: 30px;*/}
            {/*                    bottom: 30px;*/}
            {/*                `}*/}
            {/*            rightIcon={'ArrowChevronForward'}*/}
            {/*            link={ecoMixedBiosphereRouter.build('simulatorSimulation')}*/}
            {/*        >*/}
            {/*            Далее*/}
            {/*        </Button>*/}
            {/*    </CornerWrapper>*/}
            {/*}*/}
        </div>
    );
};
