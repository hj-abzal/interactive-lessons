import {ScriptBlockData} from '@/components/constructor/script-blocks/types';

export type ConstructorScenarioSchema = {
    [stageId: string]: ScriptBlockData[]
}

export type ConstructorConfig = {
    [scenarioName: string]: ConstructorScenarioSchema
}
