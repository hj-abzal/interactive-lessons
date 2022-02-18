import React from 'react';
import {css} from '@emotion/react';
import {SubMenu, MenuItem} from '@/components/nav-bar/sub-menu';
import {useConstructorStorage} from '@/context-providers/constructor-storage';
import {useRouterState} from '@/utils/routes';
import {appRouter, lessonsRouter} from '@/app/routes';

export const LessonsMenu = () => {
    const appRouterState = useRouterState(appRouter);
    const constructorStorage = useConstructorStorage();
    const packages = constructorStorage.getSberPackages();

    if (!constructorStorage.isInited) {
        return null;
    }

    return (
        <SubMenu
            css={css`
            overflow-y: auto;
                  height: 100vh;
                  width: 600px;
                  .nav-items {
                    margin-top: 16px;
                  }
                `}
        >
            {lessonsRouter.idsArr.map((routeId) => (
                <MenuItem
                    key={routeId}
                    title={lessonsRouter.routes[routeId]?.title}
                    onClick={() => {
                        appRouterState.toRoute({
                            id: 'iframeView',
                            params: {lessonId: routeId},
                        });
                    }}
                />
            ))}
            {packages.filter((pac) => pac.namespaceId).map((pac) => (
                <MenuItem
                    key={pac.id}
                    title={pac.name}
                    onClick={() => {
                        const params = constructorStorage.getPackageLinkParams({id: pac.id});

                        appRouterState.toRoute({
                            id: 'iframeConstructorView',
                            params: params,
                        });
                    }}
                />
            ))}
        </SubMenu>
    );
};
