import React, {ReactNode, useEffect, useMemo} from 'react';
import {useConstructorScenario} from '@/context-providers/constructor-scenario';
import {combineProviders} from '@/utils/combine-providers';
import {StyledContentRoot} from '@/components/constructor/scenario/css';

type AbstractContextProvider = React.ComponentType<unknown & {children: ReactNode}>;

type ScriptModuleComponent = {
    Component: React.ComponentType,
    stateKey: string,
}

const isValidComponent = (val: unknown): val is React.ComponentType =>
    typeof val === 'function';

export const ConstructorScenarioLayout = () => {
    const {state, produceState, runStage} = useConstructorScenario();

    const {
        ScenarioCombinedProvider,
        scenarioComponents,
    } = useMemo(() => {
        const scriptModulesProviders = state.availableScriptModulesIds
            .map((scriptModuleId) => state.availableScriptModules[scriptModuleId]?.ContextProvider)
            .filter(isValidComponent) as AbstractContextProvider[];

        const scriptModulesComponents = state.availableScriptModulesIds
            .map((scriptModuleId) => {
                return {
                    Component: state.availableScriptModules[scriptModuleId]?.Component,
                    stateKey: state.availableScriptModules[scriptModuleId].id,
                };
            }).filter((x) => isValidComponent(x.Component)) as ScriptModuleComponent[];

        return {
            ScenarioCombinedProvider: combineProviders(scriptModulesProviders),
            scenarioComponents: scriptModulesComponents,
        };
    }, [state.availableScriptModules]);

    const produceComponentState = (draftCb: (draft) => void, componentName) => {
        produceState((old) => {
            if (old.scriptModulesStates[componentName]) {
                draftCb(old.scriptModulesStates[componentName]);
            }
        });
    };

    useEffect(() => {
        produceState((draft) => {
            draft.constructor.isLaunched = true;
        });
    });

    return (
        <StyledContentRoot>
            <ScenarioCombinedProvider globalProps={{}}>
                {scenarioComponents.map(({
                    Component,
                    stateKey,
                }) => {
                    return (
                        <Component
                            key={stateKey}
                            {...state.scriptModulesStates[stateKey]}
                            produceState={(draftCB) => produceComponentState(draftCB, stateKey)}
                            globalState={state}
                            runStage={runStage}
                        />
                    );
                })}
            </ScenarioCombinedProvider>
        </StyledContentRoot>
    );
};
