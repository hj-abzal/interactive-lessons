import React, {useMemo} from 'react';
import {useRouterState} from '@/utils/routes';
import {appRouter} from '@/app/routes';
import {ConstructorScenarioComponent} from '@/components/constructor/scenario/component';
import {createLesson} from '@/components/lesson-container';

export const ConstructorViewPage = () => {
    const appRouterState = useRouterState(appRouter);

    const match = appRouterState.match;

    const {namespaceSlug, scenarioSlug} = match?.params || {};

    const Lesson = useMemo(() =>
        createLesson(() => (
            <ConstructorScenarioComponent
                namespaceSlug={namespaceSlug as string}
                scenarioSlug={scenarioSlug as string}
            />
        ), `${namespaceSlug}-${scenarioSlug}`),
    [namespaceSlug, scenarioSlug]);

    return <Lesson />;
};
