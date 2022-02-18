import {useState, useEffect} from 'react';

export type StagesIds<TStages> = {
    [key in keyof TStages]: keyof TStages;
}

export type Stages = {
    [key: string]: (
        params: {
            currentStage: string | number,
            stagesIds: StagesIds<any>,
            runStage: (stageName: any) => void,
            is: (stageName: any) => boolean,
            was: (stageName: any) => boolean,
            stagesHistory: (string | number)[],
        }
    ) => Promise<void | string> | string | void;
}

export const sleep = async (timeout) => {
    await new Promise((resolve) => setTimeout(resolve, timeout || 0));
};

export function useStages<
    TStages extends Stages,
    TStageIds extends StagesIds<TStages>,
    TStageId extends keyof Stages
>(
    stages: TStages,
    defaultStage?: keyof Stages
) {
    const [stagesIds, setStagesIds] = useState<TStageIds>({} as TStageIds);
    const [currentStage, runStage] = useState<TStageId | undefined>(defaultStage as TStageId);
    const [stagesHistory, setStagesHistory] = useState<TStageId[]>([]);

    const is = (stageId: TStageId): boolean => currentStage === stageId;
    const was = (stageId: TStageId): boolean => stagesHistory.includes(stageId);

    useEffect(() => {
        const _stagesIds: TStageIds = Object.keys(stages).reduce((acc, id) => {
            acc[id] = id;
            return acc;
        }, {}) as TStageIds;
        setStagesIds(_stagesIds);
    }, []);

    useEffect(() => {
        if (currentStage) {
            const execStage = async () => {
                const nextStage = await stages[currentStage]({
                    currentStage,
                    runStage,
                    is,
                    was,
                    stagesHistory,
                    stagesIds,
                });

                if (nextStage) {
                    if (!stages[nextStage]) {
                        throw new Error(`stage ${nextStage} is not exist on stages: ${stagesIds}`);
                    }

                    runStage(nextStage as TStageId);
                }

                setStagesHistory((old) => old.concat(currentStage));
            };

            execStage();
        }
    }, [currentStage]);

    return {
        stagesIds,
        currentStage,
        stagesHistory,
        runStage,
        is,
        was,
        setStagesHistory,
    };
}
