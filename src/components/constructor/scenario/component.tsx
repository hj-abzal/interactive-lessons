import {useConstructorStorage} from '@/context-providers/constructor-storage';
import {useConstructorScenario} from '@/context-providers/constructor-scenario';
import React, {useEffect} from 'react';
import {UtilityStages} from '@/components/constructor/script-blocks/types';
import {ConstructorScenarioLayout} from '@/components/constructor/scenario/layout';

export type Props = {
    namespaceSlug: string,
    scenarioSlug: string
}

export const ConstructorScenarioComponent = ({
    namespaceSlug,
    scenarioSlug,
}: Props) => {
    const constructorStorage = useConstructorStorage();
    const constructorScenario = useConstructorScenario();

    useEffect(function initEff() {
        if (
            constructorStorage.isInited
            && namespaceSlug !== constructorStorage.namespace?.slug
            || scenarioSlug !== constructorStorage.scenario?.slug
        ) {
            constructorStorage.selectNamespace({slug: namespaceSlug});
            constructorStorage.selectScenario({slug: scenarioSlug, nsSlug: namespaceSlug});

            return;
        }
    }, [
        namespaceSlug,
        scenarioSlug,
        constructorStorage.isInited
    ]);

    useEffect(function run() {
        if (constructorScenario.state?.constructor.isSettled) {
            constructorScenario.runStage(UtilityStages.start);
        }
    }, [constructorScenario.state.constructor.isSettled]);

    return (
        <ConstructorScenarioLayout/>
    );
};
