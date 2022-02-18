import React, {useEffect, useMemo, useState} from 'react';
import Logo from './logo';
import NavItem, {NavItemProps} from './nav-item';
import {Wrapper} from './css';
import SmartFlowLogo from './smart-flow-logo';
import Slash from './slash';
import {useRouterState} from '@/utils/routes';
import {appRouter, lessonsRouter} from '@/app/routes';
import {useConstructorStorage} from '@/context-providers/constructor-storage';
import {ConstructorMenu} from '@/components/nav-bar/constructor-menu';
import {LessonsMenu} from '@/components/nav-bar/lessons-menu';

type Props = {
    MiddleContent?: React.ComponentType,
}

export const NavBar = ({
    MiddleContent,
}: Props) => {
    const appRouterState = useRouterState(appRouter);
    const constructorStorage = useConstructorStorage();
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

    useEffect(function setBradcrumbsEff() {
        const appRouterMatch = appRouterState.match;

        if (appRouterMatch?.is(appRouterState.ids.iframeView)) {
            const {lessonId} = appRouterMatch?.params || {};

            setBreadcrumbs(['Интерактивы', lessonsRouter.routes[lessonId].title]);

            return;
        }

        if (appRouterMatch?.is(appRouterState.ids.iframeConstructorView)) {
            setBreadcrumbs([
                'Интерактивы',
                appRouterMatch?.params?.namespaceSlug as string,
                appRouterMatch?.params?.scenarioSlug as string
            ]);

            return;
        }

        if (appRouterMatch?.is('constructor')
            && constructorStorage.scenario
            && constructorStorage.namespace
        ) {
            setBreadcrumbs([constructorStorage.namespace.name, constructorStorage.scenario.name]);
        }
    }, [appRouterState.match, constructorStorage.namespace, constructorStorage.scenario]);

    const menuItems: NavItemProps[] = useMemo(() => [
        {
            icon: 'Lessons',
            label: 'Интерактивы',
            onHoverMenuContent: <LessonsMenu />,
        },
        {
            icon: 'Constructor',
            label: 'Конструктор',
            to: '/constructor',
            onHoverMenuContent: <ConstructorMenu />,
        }
        // {
        //     icon: 'Replicas',
        //     label: 'Replicas',
        //     to: '/replicas',
        // },
        // {
        //     icon: 'Images',
        //     label: 'Images',
        //     to: '/images',
        // },
        // {
        //     icon: 'WorkFlower',
        //     label: 'WorkFlower',
        //     to: '/work-flower',
        //     // onHoverMenuContent: <p>anything</p>
        // }
    ], []);

    return <Wrapper className="nav-bar">
        <div className="breadcrumbs">
            <Logo />
            <SmartFlowLogo />

            {breadcrumbs?.map((breadcrumb) => <React.Fragment key={breadcrumb}>
                <Slash/>
                <p>{breadcrumb}</p>
            </React.Fragment>)}

            {MiddleContent && <MiddleContent />}
        </div>
        <div className="nav-icons">
            {menuItems.map((item) => <NavItem key={item.label} {...item} />)}
        </div>
    </Wrapper>;
};
