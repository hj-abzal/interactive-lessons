import {useImmerState} from '@/utils/use-immer-state';
import {
    Namespace, SberPackage,
    Scenario,
    ScenarioSchemaRevision
} from '@/context-providers/constructor-storage/types';
import {useMemo} from 'react';
import {selectByKeys, selectByValues} from '@/utils/data-utils';
import {createContextProvider} from '@/utils/create-safe-context';
import {logger} from '@/utils/logger';
import dayjs from 'dayjs';
import {ConstructorScenarioSchema} from '@/components/constructor/types';
import {
    archivesHost,
    packagesHost,
    useConfigRequests,
    useCreateNamespaceReq,
    useCreatePackageReq,
    useCreateRevisionRequest,
    useCreateScenarioReq,
    useDeleteNamespaceReq,
    useDeletePackageReq,
    useDeleteRevisionReq,
    useDeleteScenarioReq,
    usePublishRevisionRequest,
    useRevisionRequests,
    useScenarioRevisionsRequest,
    useUpdateNamespaceReq,
    useUpdatePackageReq,
    useUpdateScenarioReq,
    useZipsVersionRequest
} from '@/context-providers/constructor-storage/requests';
import {ID} from '@/utils/generate-id';
import {translite} from '@/utils/translite';

export type ScenarioStorageState = {
    namespaceId?: string,
    scenarioId?: string,
    currentRevisionId?: string,
}

export type ConstructorStorageContextType = {
    namespace?: Namespace<any, any>,
    scenario?: Scenario<any, any>,
    currentRevision?: ScenarioSchemaRevision<any>,
    revisions?: ScenarioSchemaRevision<any>[],
    scenarios: Scenario<any, any>[],
    namespaces: Namespace<any, any>[],

    isSyncLoading: boolean,
    syncError?: string,
    syncDone: boolean,
    forceSync: () => void,
    isInited?: boolean,
    zipsVersion: string | null;
    isRevisionPublished: (id: string) => boolean,
    getScenariosByNamespaceId: (id: string) => Scenario<any, any>[],
    selectScenario: (params: {id?: string, slug?: string, nsSlug?: string}) => void,
    selectNamespace: (params: {id?: string, slug?: string}) => void,
    setCurrentRevision: (id: string) => void,
    publishRevision: (id: string) => void,
    createRevision: (params: {name?: string, copyFromId?: string}) => void,
    createNamespace: (params: {name: string}) => void,
    deleteNamespace: (params: {id: string}) => void,
    createSberPackage: (params: Omit<SberPackage, 'id'>) => void,
    deleteSberPackage: (params: {id: string}) => void,
    editSberPackage: (params: SberPackage) => void,
    getSberPackages: () => SberPackage[],
    getPackageLink: (params: {id: string, download?: boolean}) => string | undefined,
    getPackageLinkParams: (params: {id: string}) => {namespaceSlug: string, scenarioSlug: string} | undefined,
    getSberPackage: (params: {id: string}) => SberPackage,
    editNamespace: (params: {name: string, id: string}) => void,
    deleteScenario: (params: {id: string}) => void,
    createScenario: (params: {name: string, namespaceId: string}) => void,
    editScenario: (params: {name: string, id: string}) => void,
    deleteRevision: (id: string) => void,
    updateRevision: (params: {id: string, schema: ConstructorScenarioSchema}) => void,
};

export const [
    ConstructorStorageContext,
    ConstructorStorageProvider,
    useConstructorStorage
] = createContextProvider<ConstructorStorageContextType>(
    'ScenarioStorage',
    () => {
        const [state, produceState] = useImmerState<ScenarioStorageState>({
            namespaceId: undefined,
            scenarioId: undefined,
            currentRevisionId: undefined,
        }, 'scenario-constructor-storage');

        const {result: config, ...configReq} = useConfigRequests();

        const namespace = (config?.namespaces || {})[state.namespaceId!];
        const scenario = (config?.scenarios || {})[state.scenarioId!];

        const createNamespaceReq = useCreateNamespaceReq();
        const updateNamespaceReq = useUpdateNamespaceReq();
        const deleteNamespaceReq = useDeleteNamespaceReq();

        const createScenarioReq = useCreateScenarioReq();
        const updateScenarioReq = useUpdateScenarioReq();
        const deleteScenarioReq = useDeleteScenarioReq();

        const createPackageReq = useCreatePackageReq();
        const updatePackageReq = useUpdatePackageReq();
        const deletePackageReq = useDeletePackageReq();

        const publishRevisionReq = usePublishRevisionRequest();
        const deleteRevisionReq = useDeleteRevisionReq();

        const currentRevisionReq = useRevisionRequests({
            revisionId: state.currentRevisionId,
            isPublished: state.currentRevisionId === scenario?.publishedRevisionId,
        });

        const scenarioRevisionsReq = useScenarioRevisionsRequest({
            scenarioId: state.scenarioId,
            config,
        });

        const createRevisionReq = useCreateRevisionRequest();
        const zipsVersion = useZipsVersionRequest();

        const isInited = Boolean(config);

        const namespaces = Object.values(config?.namespaces || {}).filter(Boolean) as Namespace<any, any>[];

        const scenarios = useMemo(() => {
            const ids = (config?.namespaces || {})[state.namespaceId!]?.scenariosIds || [];

            return selectByKeys(config?.scenarios || {}, ids) as Scenario<any, any>[];
        }, [
            (config?.namespaces || {})[state.namespaceId!]?.scenariosIds,
            config?.namespaces,
            config?.scenarios
        ]);

        const revisions = useMemo(() => {
            if (!scenarioRevisionsReq.result) {
                return [];
            }

            return Object.values(scenarioRevisionsReq.result)
                .sort((a, b) =>
                    dayjs(b.created).millisecond() - dayjs(a.created).millisecond()
                );
        }, [
            (config?.scenarios || {})[state.scenarioId!]?.revisionIds,
            scenarioRevisionsReq.result,
            config
        ]);

        function getScenariosByNamespaceId(id: string): Scenario<any, any>[] {
            return selectByKeys(config?.scenarios || {}, config?.namespaces[id]?.scenariosIds || []);
        }

        function selectScenario({id, slug, nsSlug}: {id?: string, slug?: string, nsSlug?: string}) {
            if ((!id && !slug) || !config?.scenarios) {
                return;
            }

            const _namespace = nsSlug
                ? Object.values(config?.namespaces || {}).find((ns) => ns.slug === nsSlug)
                : namespace;

            const namespaceScenarios = _namespace?.scenariosIds.map((id) => config?.scenarios[id]) || [];

            const scenario = namespaceScenarios.find((scen) => scen.slug === slug || scen.id === id);

            if (!scenario) {
                logger.error(`no such scenario ${id || slug}`);
                return;
            }

            produceState((draft) => {
                draft.scenarioId = scenario.id;

                if (!config?.scenarios[draft.scenarioId!].revisionIds.includes(draft.currentRevisionId!)) {
                    draft.currentRevisionId = scenario.publishedRevisionId || scenario.revisionIds[0];
                }
            });
        }

        function selectNamespace({id, slug}: {id?: string, slug?: string}) {
            if (!id && !slug) {
                return;
            }

            const ns = id
                ? config?.namespaces[id]
                : selectByValues(config?.namespaces || {}, {slug: slug!})[0];

            if (!ns) {
                // logger.error(`no such ns ${id || slug}`);
                return;
            }

            const shouldSwitchScenario = !ns.scenariosIds.includes(state.scenarioId);

            produceState((draft) => {
                draft.namespaceId = ns.id;
            });

            if (shouldSwitchScenario) {
                selectScenario(ns.scenariosIds[0]);
            }
        }

        function setCurrentRevision(id) {
            produceState((draft) => {
                draft.currentRevisionId = id;
            });
        }

        function publishRevision(id) {
            if (!config?.scenarios[state.scenarioId!]) {
                return;
            }

            publishRevisionReq.update({
                revisionId: id,
                scenarioId: state.scenarioId!,
            }).then(() => {
                configReq.retry();
            });
        }

        async function createRevision({
            name,
            copyFromId,
        }: {name?: string, copyFromId?: string}) {
            if (!scenario?.id) {
                return;
            }

            const newRevision = await createRevisionReq.createFrom({
                name,
                copyFromId,
                scenarioId: state.scenarioId!,
                revisions: scenarioRevisionsReq.result || {}}
            ).promise;

            configReq.retry();

            produceState((draft) => {
                draft.currentRevisionId = newRevision.id;
            });
        }

        function createNamespace({name}: {name: string}) {
            const newNamespace: Namespace<any, any> = {
                id: ID(),
                slug: translite(name).split(' ').join('-'),
                name: name,
                scenariosIds: [],
            };

            createNamespaceReq.update({namespaceId: newNamespace.id, data: newNamespace})
                .then(() => configReq.retry());
        }

        function deleteNamespace({id}: {id: string}) {
            deleteNamespaceReq.update({namespaceId: id})
                .then(() => configReq.retry());
        }

        function editNamespace({id, name}: {id: string, name: string}) {
            const namespace = config?.namespaces[id];

            if (!namespace) {
                return;
            }

            const newNs = {
                ...namespace,
                name,
                slug: translite(name).split(' ').join('-'),
            };

            updateNamespaceReq.update({namespaceId: id, data: newNs})
                .then(() => configReq.retry());
        }

        function getSberPackages() {
            return Object.values(config?.packages || {}).filter(Boolean);
        }

        function getSberPackage({id}: {id: string}) {
            return selectByKeys(config?.packages || {}, [id])[0];
        }

        function createSberPackage({
            name,
            namespaceId,
            scenarioId,
            lessonPath,
            meta,
        }: Omit<SberPackage, 'id'>) {
            const newPackage: SberPackage = {
                id: ID(),
                name,
                scenarioId,
                namespaceId,
                lessonPath,
                meta,
            };

            createPackageReq.update({packageId: newPackage.id, data: newPackage})
                .then(() => configReq.retry());
        }

        function editSberPackage({id, name, namespaceId, scenarioId, lessonPath, meta}: SberPackage) {
            configReq.produce((draft) => {
                draft.packages[id] = {
                    ...draft.packages[id],
                    name,
                    scenarioId,
                    namespaceId,
                    lessonPath,
                    meta,
                };
            });

            updatePackageReq.update({
                packageId: id,
                data: {
                    ...config!.packages[id],
                    name,
                    scenarioId,
                    namespaceId,
                    lessonPath,
                    meta,
                },
            })
                .then(() => configReq.retry());
        }

        function deleteSberPackage({id}: {id: string}) {
            deletePackageReq.update({packageId: id})
                .then(() => configReq.retry());
        }

        function createScenario({name, namespaceId}: {name: string, namespaceId: string}) {
            const newScenario: Scenario<any, any> = {
                id: ID(),
                slug: translite(name).split(' ').join('-'),
                name: name,
                revisionIds: [],
            };

            createScenarioReq.update({namespaceId, scenarioId: newScenario.id, data: newScenario})
                .then(() => configReq.retry());
        }

        function editScenario({id, name}: {id: string, name: string}) {
            const scenario = config?.scenarios[id];

            if (!scenario) {
                return;
            }

            const newScenario = {
                ...scenario,
                name,
                slug: translite(name).split(' ').join('-'),
            };

            updateScenarioReq.update({scenarioId: id, data: newScenario})
                .then(() => configReq.retry());
        }

        function deleteScenario({id}: {id: string}) {
            deleteScenarioReq.update({scenarioId: id})
                .then(() => configReq.retry());
        }

        function getPackageLink({id, download}: {id: string, download?: boolean}) {
            const pac = config?.packages[id];

            if (!pac) {
                return '';
            }

            const ext = download ? '.zip' : '';

            if (pac?.lessonPath) {
                return `${download ? archivesHost : packagesHost}/${pac.lessonPath}${ext}`;
            }

            const scenario = config?.scenarios[pac.scenarioId!];
            const namespace = config?.namespaces[pac.namespaceId!];

            if (!scenario || !namespace) {
                return '';
            }

            return `${download ? archivesHost : packagesHost}/${namespace.slug}-${scenario.slug}${ext}`;
        }

        function getPackageLinkParams({id}: {id: string}) {
            const pac = config?.packages[id];

            if (!pac) {
                return;
            }

            const scenario = config?.scenarios[pac.scenarioId!];
            const namespace = config?.namespaces[pac.namespaceId!];

            if (!scenario || !namespace) {
                return;
            }

            return {
                namespaceSlug: namespace.slug,
                scenarioSlug: scenario.slug,
            };
        }

        function deleteRevision(id) {
            deleteRevisionReq.update({revisionId: id, scenarioId: state.scenarioId!})
                .then(() => configReq.retry());
        }

        function updateRevision({schema}) {
            if (!currentRevisionReq.result || currentRevisionReq.isLoading) {
                return;
            }

            currentRevisionReq.produce((draft) => {
                draft.schema = schema;
            });
        }

        function isRevisionPublished(id: string) {
            if (!config) {
                return false;
            }

            return config.scenarios[state.scenarioId!].publishedRevisionId === id;
        }

        const isSyncLoading = configReq.isLoading
            || scenarioRevisionsReq.isLoading
            || createRevisionReq.isLoading
            || currentRevisionReq.isLoading;

        const syncError = configReq.error
            || scenarioRevisionsReq.error
            || createRevisionReq.error
            || currentRevisionReq.error;

        const syncDone = Boolean(config
            && scenarioRevisionsReq.result
            && currentRevisionReq.result
        );

        function forceSync() {
            configReq.retry();
            scenarioRevisionsReq.retry();
            currentRevisionReq.retry();
        }

        const currentRevision = useMemo(() => {
            if (!currentRevisionReq.result) {
                return undefined;
            }
            const schema = {};

            // Фикс одинаковых id
            Object.keys(currentRevisionReq.result.schema).forEach((stageId) => {
                schema[stageId] = currentRevisionReq.result?.schema[stageId].map((block) => {
                    if (block?.dataId.includes('fixed')) {
                        return block;
                    }

                    return {
                        ...block,
                        dataId: block?.dataId + currentRevisionReq.result?.id + 'fixed',
                    };
                });
            });

            return {
                ...currentRevisionReq.result,
                schema,
            };
        }, [currentRevisionReq.result?.id]);

        return {
            isInited,
            revisions,
            namespace,
            scenario,
            currentRevision,
            namespaces,
            scenarios,
            isSyncLoading,
            syncError,
            syncDone,
            forceSync,
            createNamespace,
            deleteNamespace,
            editNamespace,
            createScenario,
            deleteScenario,
            editScenario,
            getSberPackages,
            getSberPackage,
            createSberPackage,
            editSberPackage,
            deleteSberPackage,
            getPackageLink,
            getPackageLinkParams,
            zipsVersion,

            getScenariosByNamespaceId,
            setCurrentRevision,
            createRevision,
            isRevisionPublished,
            publishRevision,
            updateRevision,
            selectNamespace,
            selectScenario,
            deleteRevision,
        };
    }
);
