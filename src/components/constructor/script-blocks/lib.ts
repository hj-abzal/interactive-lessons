import {
    ScriptBlockBaseTypeGeneric,
    ScriptBlockData,
    ScriptBlockFull,
    ScriptModule, ScriptModuleConfig
} from '@/components/constructor/script-blocks/types';
import {Inputs} from '../side-bar/script-block/widget';

export const scriptBlock
    // TODO: fix inputs typification not working when providing TState
    : <TState extends any = any, IT extends Inputs = any>(base: ScriptBlockBaseTypeGeneric<IT, TState>) =>
        ScriptBlockBaseTypeGeneric<IT, TState>
            = (base) => base;

export const inputsToArgs = (inputs) => {
    const args = {};
    Object.keys(inputs).forEach((inputName) => {
        const input = inputs[inputName];
        args[inputName] = input.value;
    });
    return args;
};

export const inputsToDefaultValuesData = (inputs) => {
    const data = {};
    Object.keys(inputs).forEach((inputName) => {
        const input = inputs[inputName];
        data[inputName] = input.defaultValue;
    });
    return data;
};

export const connectFullScript = (
    scriptBlockData: ScriptBlockData,
    availableScriptBlocks: { [key: string]: ScriptBlockFull }
): ScriptBlockFull => {
    const script = availableScriptBlocks[scriptBlockData.scriptBlockId];
    const fullScript: ScriptBlockFull = {
        ...script,
        data: scriptBlockData,
    };

    return fullScript;
};

export const produceScriptModuleState = (produceState: (draft) => void, draftCb: (draft) => void, moduleName) => {
    produceState((old) => {
        if (old.scriptModulesStates[moduleName]) {
            draftCb(old.scriptModulesStates[moduleName]);
        }
    });
};

type ScriptBlocksConfigs = {
    [scriptBlockName: string]: ScriptBlockFull
}

type ScriptModulesConfigs = {
    [scriptModuleId: string]: ScriptModuleConfig,
}

type CombinedScriptModulesHook = () => {
    scriptBlocks: ScriptBlocksConfigs,
    scriptModulesConfigs: ScriptModulesConfigs
}

export const combineScriptBlocks = (scriptModules: ScriptModule[]): CombinedScriptModulesHook => () => {
    const scriptBlocks: ScriptBlocksConfigs = {};
    const scriptModulesConfigs: ScriptModulesConfigs = {};

    scriptModules.forEach((scriptModule) => {
        const {hook, ...scriptModuleConfig} = scriptModule;

        scriptModulesConfigs[scriptModuleConfig.id] = scriptModuleConfig;

        const useScripts = hook();

        const blocks = useScripts.blocks;

        Object.keys(blocks).forEach((blockKey) => {
            scriptBlocks[blockKey] = {
                ...scriptModuleConfig,
                ...blocks[blockKey],
                moduleId: scriptModuleConfig.id,
                data: {
                    dataId: 'initial',
                    scriptBlockId: blockKey,
                    inputValues: inputsToDefaultValuesData(blocks[blockKey].inputs),
                    boundStageParams: {},
                },
            };
        });
    });

    return {
        scriptBlocks,
        scriptModulesConfigs,
    };
};
