import {useRouterState} from '@/utils/routes';
import {appRouter} from '@/app/routes';
import {useConstructorStorage} from '@/context-providers/constructor-storage';
import React, {useEffect} from 'react';
import {ShortcutsWrapper} from '@/components/constructor/scenario/shortcuts-wrapper';
import {SideBar} from '@/components/constructor/side-bar';
import {NavBar} from '@/components/nav-bar';
import {EditorNavBar} from '@/components/constructor/nav-bar';
import {LessonLayout} from '@/components/lesson-container';
import {ConstructorScenarioLayout} from '@/components/constructor/scenario/layout';
import {useConstructorScenario} from '@/context-providers/constructor-scenario';
import {StagesFlowEditor} from '../stages-flow-editor';

export const ConstructorScenarioEditor = () => {
    const appRouterState = useRouterState(appRouter);
    const constructorStorage = useConstructorStorage();
    const {state} = useConstructorScenario();

    useEffect(function locationChangeEff() {
        if (appRouterState.match?.is('constructor') && constructorStorage.isInited) {
            const {namespaceSlug, scenarioSlug} = appRouterState.match?.params || {};

            if ((namespaceSlug !== constructorStorage?.namespace?.slug)) {
                constructorStorage.selectNamespace({slug: String(namespaceSlug)});
            } else if (
                scenarioSlug !== constructorStorage?.scenario?.slug
                || !constructorStorage?.namespace?.scenariosIds?.includes(constructorStorage?.scenario?.id)
            ) {
                constructorStorage.selectScenario({slug: String(scenarioSlug)});
            }
        }
    }, [appRouterState.match, constructorStorage.isInited, constructorStorage.scenario, constructorStorage.namespace]);

    return (
        <ShortcutsWrapper>
            <>
                {/* TODO: remove <PopupProvider> from here */}
                <SideBar/>
                <NavBar
                    MiddleContent={EditorNavBar}
                />
                <div className="lesson">
                    {state.constructor.isFlowEditorMode
                        ? <StagesFlowEditor/>
                        : <LessonLayout>
                            <ConstructorScenarioLayout/>
                        </LessonLayout>}
                </div>
            </>
        </ShortcutsWrapper>
    );
};
