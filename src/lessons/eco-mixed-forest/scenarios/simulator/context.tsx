import React, {ReactNode, useContext, useEffect, useState} from 'react';
import {BiosphereType, EducationTask, MemberType, RelationType} from '@/lessons/eco-mixed-forest/context/types';
import {useScenario} from '@/lessons/eco-mixed-forest/context/scenario-context';
import {useDevtools} from '@/context-providers/devtools';
import {useQueryParams} from '@/utils/use-query-params';
import {ecoMixedBiosphereRouter} from '@/lessons/eco-mixed-forest/routes';
import {useHistory, useLocation} from 'react-router-dom';
import {useSberclass} from '@/context-providers/sberclass';

const queryParamsIds = ecoMixedBiosphereRouter.routes.simulator.queryParams;

export type SimulatorContextType = {
    state: {
        biosphereType: BiosphereType
        currentPairTask: EducationTask,
        currentRelationType: RelationType,
        currentRelationTypeInd: number,
        allTasks: EducationTask[],
        relationPairTasks: EducationTask[],
        relevantMemberPairs: {
            first: MemberType,
            second: MemberType,
        }[],
        withOnboarding: boolean,
        isLastTask: boolean,
    },
    actions: {
        nextRelationType: () => void,
        setCurrentPairTask: (task: EducationTask) => void,
    },
};

export const Context = React.createContext<SimulatorContextType | undefined>(undefined);

export const useSimulator = () => {
    return useContext(Context) as SimulatorContextType;
};

const relationTypeTasksQueueForest = [
    RelationType.Competition,
    RelationType.PredatorPrey,
    RelationType.ParasiteOwner,
    RelationType.Commensalism,
    RelationType.Mutualism,
    RelationType.Amensalism,
    RelationType.Neutralism
];

const relationTypeTasksQueueOcean = [
    RelationType.Competition,
    RelationType.PredatorPrey,
    RelationType.ParasiteOwner,
    RelationType.Commensalism,
    RelationType.Protocooperation,
    RelationType.Neutralism
];

export const SimulatorProvider = ({children}: {children: ReactNode}) => {
    const devtools = useDevtools();
    const {resetSessionId} = useSberclass();
    const history = useHistory();
    const location = useLocation();
    const queryParams = useQueryParams();
    const scenario = useScenario();
    const [biosphere, setBiosphere] = useState(queryParams.get('biosphere'));

    const [withOnboarding, setWithOnboarding] = useState(
        Boolean(Number(queryParams.get(queryParamsIds.withOnboarding)))
    );

    const [currentRelationTypeInd, setCurrentRelationTypeInd] = useState(
        Number(queryParams.get(queryParamsIds.relationTypeInd) || 0)
    );

    const relationTypeTasksQueue = biosphere === BiosphereType.Forest
        ? relationTypeTasksQueueForest
        : relationTypeTasksQueueOcean;

    const isLastTask = BiosphereType.Ocean
        && currentRelationTypeInd === relationTypeTasksQueue.length - 1;

    const nextRelationType = () => {
        const newInd = currentRelationTypeInd < (relationTypeTasksQueue.length - 1) ? (currentRelationTypeInd + 1) : 0;

        const shouldChangeToOcean = biosphere === BiosphereType.Forest
            && currentRelationTypeInd === relationTypeTasksQueue.length - 1;

        const shouldChangeToForest = biosphere === BiosphereType.Ocean
            && currentRelationTypeInd === relationTypeTasksQueue.length - 1;

        let route;

        if (shouldChangeToOcean) {
            route = ecoMixedBiosphereRouter
                .build('simulatorForest', {}, {
                    [queryParamsIds.relationTypeInd]: 0,
                    [queryParamsIds.withOnboarding]: 1,
                    [queryParamsIds.biosphere]: BiosphereType.Ocean,
                });

            history.push(route);
            window.location.reload();

            return;
        }

        // it's end
        if (shouldChangeToForest) {
            route = ecoMixedBiosphereRouter
                .build('simulatorForest', {}, {
                    [queryParamsIds.relationTypeInd]: 0,
                    [queryParamsIds.withOnboarding]: 1,
                    [queryParamsIds.biosphere]: BiosphereType.Forest,
                });

            history.push(route);
            window.location.reload();
            return;
        }

        if (biosphere === BiosphereType.Ocean) {
            route = ecoMixedBiosphereRouter
                .build('simulatorForest', {}, {
                    [queryParamsIds.relationTypeInd]: newInd,
                    [queryParamsIds.withOnboarding]: 0,
                    [queryParamsIds.biosphere]: BiosphereType.Ocean,
                });
        } else {
            route = ecoMixedBiosphereRouter
                .build('simulatorForest', {}, {
                    [queryParamsIds.relationTypeInd]: newInd,
                    [queryParamsIds.withOnboarding]: 0,
                    [queryParamsIds.biosphere]: BiosphereType.Forest,
                });
        }

        history.push(route);
        window.location.reload();
    };

    const currentRelationType = relationTypeTasksQueue[currentRelationTypeInd];
    const biosphereType = biosphere === BiosphereType.Ocean ? BiosphereType.Ocean : BiosphereType.Forest;
    const relationPairTasks = scenario.state.tasksConfig.biospheresRelations[biosphereType]
        .filter((task) => task.relationType === currentRelationType);

    const allTasks = scenario.state.tasksConfig.biospheresRelations[biosphereType];

    const relevantMemberPairs = relationPairTasks.map((task) => ({
        first: task.targetPair.first.memberType,
        second: task.targetPair.second.memberType,
    }));

    const [currentPairTask, setCurrentPairTask] = useState<EducationTask>(relationPairTasks[0]);

    useEffect(() => {
        setCurrentRelationTypeInd(Number(queryParams.get(queryParamsIds.relationTypeInd) || 0));
        setWithOnboarding(Boolean(Number(queryParams.get(queryParamsIds.withOnboarding))));
        setBiosphere(queryParams.get('biosphere'));
    }, [location.pathname, location.search]);

    useEffect(() => {
        devtools.setCustomContent({
            sectionName: 'Симулятор',
            content: [
                {
                    text: 'Forest',
                    onClick: () => {
                        const route = ecoMixedBiosphereRouter
                            .build('simulatorForest', {}, {
                                [queryParamsIds.biosphere]: 'Forest',
                            });
                        resetSessionId();
                        history.push(route);
                        window.location.reload();
                    },
                },
                {
                    text: 'Ocean',
                    onClick: () => {
                        const route = ecoMixedBiosphereRouter
                            .build('simulatorForest', {}, {
                                [queryParamsIds.biosphere]: 'Ocean',
                            });
                        resetSessionId();
                        history.push(route);
                        window.location.reload();
                    },
                },
                {
                    text: 'simulatorRelationship Ocean',
                    onClick: () => {
                        const route = ecoMixedBiosphereRouter
                            .build('simulatorRelationship', {}, {
                                [queryParamsIds.biosphere]: 'Ocean',
                            });
                        resetSessionId();
                        history.push(route);
                        window.location.reload();
                    },
                },
                {
                    text: 'simulatorSimulation Ocean',
                    onClick: () => {
                        const route = ecoMixedBiosphereRouter
                            .build('simulatorSimulation', {}, {
                                [queryParamsIds.biosphere]: 'Ocean',
                            });
                        resetSessionId();
                        history.push(route);
                        window.location.reload();
                    },
                },
                {text: 'Настройка диффуров', onClick: () => {
                    history.push(ecoMixedBiosphereRouter.build('setupCoeffs'));
                }},
                {
                    text: withOnboarding ? 'Выключить онбординг' : 'Включить онбординг',
                    onClick: () => {
                        const route = ecoMixedBiosphereRouter
                            .build('simulatorForest', {}, {
                                [queryParamsIds.relationTypeInd]: currentRelationTypeInd,
                                [queryParamsIds.withOnboarding]: withOnboarding ? 0 : 1,
                            });

                        resetSessionId();
                        history.push(route);
                        window.location.reload();
                    },
                },
                {text: `Тип отношений: ${currentRelationType}`},
                {
                    text: `Подходящие пары: ${
                        relationPairTasks.map((pair) =>
                            `(${pair.targetPair.first.memberType})-(${pair.targetPair.second.memberType})`
                        ).join(', ')
                    }`,
                },
                {text: 'Другие типы:'},
                ...relationTypeTasksQueue.map((type) => ({
                    text: type,
                    onClick: () => {
                        const ind = relationTypeTasksQueue.indexOf(type);

                        const route = ecoMixedBiosphereRouter
                            .build('simulatorForest', {}, {
                                [queryParamsIds.relationTypeInd]: ind,
                            });

                        // resetSessionId();
                        history.push(route);

                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    },
                }))
            ],
        });
    }, [currentRelationType, withOnboarding]);

    if (!currentRelationType) {
        return null;
    }

    const exportContext: SimulatorContextType = {
        state: {
            isLastTask,
            biosphereType,
            currentRelationType,
            currentPairTask,
            relationPairTasks,
            relevantMemberPairs,
            allTasks: allTasks,
            withOnboarding,
            currentRelationTypeInd,
        },
        actions: {
            nextRelationType,
            setCurrentPairTask,
        },
    };

    return (
        <Context.Provider value={exportContext}>
            {children}
        </Context.Provider>
    );
};
