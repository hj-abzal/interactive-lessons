import React, {ReactNode, useContext} from 'react';
import {BiosphereType, ScenarioType} from '@/lessons/eco-mixed-forest/context/types';
import {TasksConfig} from '@/lessons/eco-mixed-forest/context/types';
import {tasksConfig} from '@/lessons/eco-mixed-forest/context/tasks-config';
import {RelationType} from '@/lessons/eco-mixed-forest/context/types';

export type ScenarioContextType = {
    state: {
        scenarioType: ScenarioType,
        biosphereType: BiosphereType,
        tasksConfig: TasksConfig,
        allRelationTypes: RelationType[],
    },
};

export const ScenarioContext = React.createContext<ScenarioContextType | undefined>(undefined);

export const useScenario = () => {
    return useContext(ScenarioContext) as ScenarioContextType;
};

export const ScenarioProvider = ({children}: {children: ReactNode}) => {
    const exportContext: ScenarioContextType = {
        state: {
            scenarioType: ScenarioType.Simulator,
            biosphereType: BiosphereType.Forest,
            tasksConfig: tasksConfig,
            allRelationTypes: Object.values(RelationType),
        },
    };
    return (
        <ScenarioContext.Provider value={exportContext}>
            {children}
        </ScenarioContext.Provider>
    );
};
