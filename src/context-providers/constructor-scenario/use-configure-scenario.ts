import {StateProducer} from '@/utils/use-immer-state';
import {useScriptBlocks} from '@/components/constructor/script-blocks';
import {useEffect} from 'react';
import {UtilityStages} from '@/components/constructor/script-blocks/types';
import {ConstructorScenarioState} from '@/context-providers/constructor-scenario/index';

const utilityStagesToMock = Object.values(UtilityStages);

const setupStageScriptBlocks = [
    'setTableData',
    'setStageParams'
];

export function useConfigureScenario(
    state: ConstructorScenarioState,
    produceState: StateProducer<ConstructorScenarioState>,
    runStage,
    addQueueTask
) {
    const {scriptBlocks, scriptModulesConfigs} = useScriptBlocks();

    useEffect(function launchEff() {
        if (state.constructor.isLaunched) {
            return;
        }

        produceState((draft) => {
            draft.availableScriptBlocks = scriptBlocks;
            draft.availableScriptModules = scriptModulesConfigs;
            draft.availableScriptModulesIds = Object.keys(scriptModulesConfigs);

            draft.availableScriptModulesIds.forEach((id) => {
                draft.scriptModulesStates[id] = scriptModulesConfigs[id].initialState || {};
            });

            utilityStagesToMock.forEach(((stage) => {
                if (!(stage in draft.stages)) {
                    draft.stages[stage] = [];
                }
            }));

            draft.constructor.isLaunched = true;
        });

        const requiredScriptTasks = Object.keys(state.stages).reduce((acc, stageId) => {
            const requiredBlocks = state.stages[stageId]
                .filter((block) => setupStageScriptBlocks.includes(block.scriptBlockId))
                .map((block) => ({data: block, stageId}));

            return acc.concat(requiredBlocks);
        }, [] as any[]);

        requiredScriptTasks.forEach((block) => {
            addQueueTask(block.stageId, block.data);
        });
    }, [
        state.constructor.isLaunched,
        scriptModulesConfigs,
        scriptBlocks
    ]);

    useEffect(function configureByStageEff() {
        if (!state.constructor.isLaunched) {
            return;
        }

        if (!state.constructor.isSettled) {
            if (
                !state.stages[UtilityStages.setup].length
                || state.queueStats.stagesHistory.includes(UtilityStages.setup)
            ) {
                produceState((draft) => {
                    draft.constructor.isSettled = true;
                });
            } else if (state.queueStats.runningStageId !== UtilityStages.setup) {
                runStage(UtilityStages.setup);
            }
        }
    },
    [
        state.queueStats.runningStageId,
        state.queueStats,
        state.constructor.isLaunched
    ]);
}
