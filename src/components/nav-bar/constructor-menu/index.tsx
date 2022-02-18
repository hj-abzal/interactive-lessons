import React from 'react';
import {css, useTheme} from '@emotion/react';
import {SubMenu, MenuItem} from '@/components/nav-bar/sub-menu';
import {useRouterState} from '@/utils/routes';
import {appRouter} from '@/app/routes';
import {useConstructorStorage} from '@/context-providers/constructor-storage';
import {usePopup} from '@/context-providers/popup';
import {CreateNamespacePopup} from '@/components/nav-bar/constructor-menu/create-namespace-popup';
import {DangerActionPopup} from '@/components/nav-bar/constructor-menu/danger-action-popup';
import {SberPackagePopup} from '@/components/nav-bar/constructor-menu/sber-package-popup';

export const ConstructorMenu = () => {
    const constructorStorage = useConstructorStorage();
    const appRouterState = useRouterState(appRouter);
    const popupper = usePopup();
    const theme = useTheme();

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
            <MenuItem
                title="Темы"
                expand
                actions={[
                    {
                        icon: 'ActionsPlus',
                        iconColor: theme.colors.success.default,
                        onClick: () => popupper.addPopup({
                            id: 'create-namespace',
                            content: <CreateNamespacePopup
                                popupId="create-namespace"
                                onSubmit={(data) => {
                                    constructorStorage.createNamespace(data);
                                }}
                            />,
                            canClose: true,
                        }),
                    }
                ]}
            >
                {constructorStorage.namespaces.map((namespace) => (
                    <MenuItem
                        key={namespace.slug}
                        title={namespace.name}
                        depth={1}
                        actions={[
                            {
                                icon: 'ActionsPlus',
                                iconColor: theme.colors.success.default,
                                onClick: () => popupper.addPopup({
                                    id: 'create-scenario',
                                    content: <CreateNamespacePopup
                                        popupId='create-scenario'
                                        onSubmit={(data) => {
                                            constructorStorage.createScenario({...data, namespaceId: namespace.id});
                                        }}
                                    />,
                                    canClose: true,
                                }),
                            },
                            {
                                icon: 'Lessons',
                                iconColor: theme.colors.tiger.default,
                                onClick: () => popupper.addPopup({
                                    id: 'edit-namespace',
                                    content: <CreateNamespacePopup
                                        popupId='edit-namespace'
                                        data={namespace}
                                        onSubmit={(data) => {
                                            constructorStorage.editNamespace({...data, id: namespace.id});
                                        }}
                                    />,
                                    canClose: true,
                                }),
                            },
                            {
                                icon: 'Delete',
                                iconColor: theme.colors.error.default,
                                onClick: () => popupper.addPopup({
                                    id: 'delete-namespace',
                                    content: <DangerActionPopup
                                        popupId="delete-namespace"
                                        title={`Удалить тему ${namespace.name}?`}
                                        onAccept={() => {
                                            constructorStorage.deleteNamespace({id: namespace.id});
                                        }}
                                    />,
                                    canClose: true,
                                }),
                            }
                        ]}
                    >
                        {constructorStorage.getScenariosByNamespaceId(namespace.id).map((scen) => (
                            <MenuItem
                                key={scen.slug}
                                title={scen.name}
                                depth={2}
                                actions={[
                                    {
                                        icon: 'Lessons',
                                        iconColor: theme.colors.tiger.default,
                                        onClick: () => popupper.addPopup({
                                            id: 'edit-scenario',
                                            content: <CreateNamespacePopup
                                                popupId='edit-scenario'
                                                data={scen}
                                                onSubmit={(data) => {
                                                    constructorStorage.editScenario({...data, id: scen.id});
                                                }}
                                            />,
                                            canClose: true,
                                        }),
                                    },
                                    {
                                        icon: 'Delete',
                                        iconColor: theme.colors.error.default,
                                        onClick: () => popupper.addPopup({
                                            id: 'delete-scenario',
                                            content: <DangerActionPopup
                                                popupId="delete-scenario"
                                                title={`Удалить сценарий ${scen.name}?`}
                                                onAccept={() => {
                                                    constructorStorage.deleteScenario({id: scen.id});
                                                }}
                                            />,
                                            canClose: true,
                                        }),
                                    }
                                ]}
                                onClick={() => {
                                    appRouterState.toRoute({
                                        id: 'constructor',
                                        params: {
                                            namespaceSlug: namespace.slug,
                                            scenarioSlug: scen.slug,
                                        },
                                    });
                                }}
                            />
                        ))}
                    </MenuItem>
                ))}
            </MenuItem>

            <MenuItem
                title={`Пакеты (версия ${constructorStorage.zipsVersion || ''})`}
                actions={[
                    {
                        icon: 'ActionsPlus',
                        iconColor: theme.colors.success.default,
                        onClick: () => popupper.addPopup({
                            priority: 1,
                            id: 'add-package',
                            content: <SberPackagePopup
                                popupId='add-package'
                                namespaces={constructorStorage.namespaces}
                                getScenariosByNamespaceId={constructorStorage.getScenariosByNamespaceId}
                                onSubmit={constructorStorage.createSberPackage}
                            />,
                            canClose: true,
                        }),
                    }
                ]}
            >
                {packages.map((pac) => (
                    <div key={pac.id} className="package-item">
                        <MenuItem
                            title={pac.name}
                            onClick={() => {
                                window.open(constructorStorage.getPackageLink({id: pac.id}) || '', '_blank');
                            }}
                            actions={[
                                {
                                    icon: 'Images',
                                    iconColor: theme.colors.primary.default,
                                    onClick: () => {
                                        window.location.href = constructorStorage
                                            .getPackageLink({id: pac.id, download: true}) || '';
                                    },
                                },
                                {
                                    icon: 'Lessons',
                                    iconColor: theme.colors.tiger.default,
                                    onClick: () => popupper.addPopup({
                                        id: 'edit-package',
                                        content: <SberPackagePopup
                                            popupId='edit-package'
                                            data={pac}
                                            namespaces={constructorStorage.namespaces}
                                            getScenariosByNamespaceId={constructorStorage.getScenariosByNamespaceId}
                                            onSubmit={(data) => {
                                                constructorStorage.editSberPackage({...data, id: pac.id});
                                            }}
                                        />,
                                        canClose: true,
                                    }),
                                },
                                {
                                    icon: 'Delete',
                                    iconColor: theme.colors.error.default,
                                    onClick: () => popupper.addPopup({
                                        id: 'delete-package',
                                        content: <DangerActionPopup
                                            popupId="delete-package"
                                            title={`Удалить пакет ${pac.name}?`}
                                            onAccept={() => {
                                                constructorStorage.deleteSberPackage({id: pac.id});
                                            }}
                                        />,
                                        canClose: true,
                                    }),
                                }
                            ]}
                        />
                    </div>
                ))}
            </MenuItem>

        </SubMenu>
    );
};
