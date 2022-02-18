import {request, useMutateRequest, useRequest, useSyncRequest} from '@/utils/http';
import {useEffect, useState} from 'react';
import {migrate} from '@/context-providers/constructor-storage/migrate';
import {KeyMap, ScenarioSchemaRevision, ScenarioStorageConfig} from '@/context-providers/constructor-storage/types';
import {logger} from '@/utils/logger';
import {generateCopyName} from '@/utils/generate-copy-name';
import {ID} from '@/utils/generate-id';
import {isProduction} from '@/utils/env';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';

dayjs.extend(utc);

const local = false;

export const apiHost = local
    ? 'http://localhost:3333/wf/v1'
    : 'https://auto.maging.studio/wf/v1';

export const archivesHost = 'https://zips.maging.studio';
export const packagesHost = 'http://packages.maging.studio';

export const useZipsVersionRequest = () => {
    const [version, setVersion] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            request(`${archivesHost}/version.json`, {method: 'GET'})
                .then((data) => {
                    // Костыль из-за другой таймзоны на сервере
                    setVersion(dayjs(data).utc(true).format('DD-MM hh:mm:ss'));
                });
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return version;
};

export const useRevisionRequests = ({revisionId, isPublished}: {revisionId?: string, isPublished: boolean}) => {
    const [loadedResult, setLoadedResult] = useState();

    const req = useSyncRequest<ScenarioSchemaRevision<any>>({
        fetchUrl: `${apiHost}/constructor/revisions/${revisionId}`,
        updateUrl: `${apiHost}/constructor/revisions/${revisionId}`,
        updateMethod: 'PUT',
        debounce: 500,
        skip: !revisionId || isProduction,
        disableUpdate: isPublished,
    });

    useEffect(function loadProduction() {
        if (isProduction && revisionId) {
            import(`@/codgen/constructor/revisions/${revisionId}.json`).then((data) => setLoadedResult(data));
        }
    }, [isProduction, revisionId]);

    return {
        ...req,
        result: isProduction ? loadedResult : req.result,
    };
};

export const useScenarioRevisionsRequest = (
    {
        scenarioId,
        config,
    }: {
        scenarioId?: string,
        config?: ScenarioStorageConfig
    }) => {
    const req = useRequest<KeyMap<ScenarioSchemaRevision<any>>>(
        `${apiHost}/constructor/scenarios/${scenarioId}/revisions`,
        {method: 'GET', skip: !scenarioId || isProduction}
    );

    useEffect(function retryOnRevisionIdsChangedEff() {
        if (!scenarioId || isProduction) {
            return;
        }

        req.retry();
    }, [config?.scenarios[scenarioId!]?.revisionIds]);

    return req;
};

export const useConfigRequests = () => {
    const [loadedResult, setLoadedResult] = useState<ScenarioStorageConfig | undefined>();

    const req = useSyncRequest<ScenarioStorageConfig>({
        fetchUrl: `${apiHost}/constructor/config`,
        updateUrl: `${apiHost}/constructor/config`,
        updateMethod: 'PUT',
        debounce: 500,
        skip: isProduction,
    });

    useEffect(function migrateEff() {
        migrate(apiHost).catch((e) => {
            logger.error(e);
        });
    }, []);

    useEffect(function loadProduction() {
        if (isProduction) {
            // @ts-ignore
            import('@/codgen/constructor/config.json').then((data) => setLoadedResult(data));
        }
    }, [isProduction]);

    return {
        ...req,
        result: isProduction ? loadedResult : req.result,
    };
};

type CreateNamespaceReq = {
    namespaceId: string,
    data: any,
}

export const useCreateNamespaceReq = () => {
    const req = useMutateRequest<CreateNamespaceReq>(
        `${apiHost}/constructor/namespace-create`,
        {method: 'PUT'}
    );

    return req;
};

type UpdateNamespaceReq = {
    namespaceId: string,
    data: any,
}

export const useUpdateNamespaceReq = () => {
    const req = useMutateRequest<UpdateNamespaceReq>(
        `${apiHost}/constructor/namespace-update`,
        {method: 'PUT'}
    );

    return req;
};

type DeleteNamespaceReq = {
    namespaceId: string,
}

export const useDeleteNamespaceReq = () => {
    const req = useMutateRequest<DeleteNamespaceReq>(
        `${apiHost}/constructor/namespace-delete`,
        {method: 'PUT'}
    );

    return req;
};

type CreateScenarioReq = {
    namespaceId: string,
    scenarioId: string,
    data: any,
}

export const useCreateScenarioReq = () => {
    const req = useMutateRequest<CreateScenarioReq>(
        `${apiHost}/constructor/scenario-create`,
        {method: 'PUT'}
    );

    return req;
};

type UpdateScenarioReq = {
    scenarioId: string,
    data: any,
}

export const useUpdateScenarioReq = () => {
    const req = useMutateRequest<UpdateScenarioReq>(
        `${apiHost}/constructor/scenario-update`,
        {method: 'PUT'}
    );

    return req;
};

type DeleteScenarioReq = {
    scenarioId: string,
}

export const useDeleteScenarioReq = () => {
    const req = useMutateRequest<DeleteScenarioReq>(
        `${apiHost}/constructor/scenario-delete`,
        {method: 'PUT'}
    );

    return req;
};

type CreatePackageReq = {
    packageId: string,
    data: any,
}

export const useCreatePackageReq = () => {
    const req = useMutateRequest<CreatePackageReq>(
        `${apiHost}/constructor/package-create`,
        {method: 'PUT'}
    );

    return req;
};

type UpdatePackageReq = {
    packageId: string,
    data: any,
}

export const useUpdatePackageReq = () => {
    const req = useMutateRequest<UpdatePackageReq>(
        `${apiHost}/constructor/package-update`,
        {method: 'PUT'}
    );

    return req;
};

type DeletePackageReq = {
    packageId: string,
}

export const useDeletePackageReq = () => {
    const req = useMutateRequest<DeletePackageReq>(
        `${apiHost}/constructor/package-delete`,
        {method: 'PUT'}
    );

    return req;
};

type PublishRevisionReq = {
    revisionId: string,
    scenarioId: string,
}

export const usePublishRevisionRequest = () => {
    const req = useMutateRequest<PublishRevisionReq>(
        `${apiHost}/constructor/revision-publish`,
        {method: 'PUT'}
    );

    return req;
};

type DeleteRevisionReq = {
    revisionId: string,
    scenarioId: string,
}

export const useDeleteRevisionReq = () => {
    const req = useMutateRequest<DeleteRevisionReq>(
        `${apiHost}/constructor/revision-delete`,
        {method: 'PUT'}
    );

    return req;
};

type CreateRevisionReq = {
    revisionId: string,
    scenarioId: string,
    data: ScenarioSchemaRevision<any>,
}

export const useCreateRevisionRequest = () => {
    const req = useMutateRequest<CreateRevisionReq>(
        `${apiHost}/constructor/revision-create`,
        {method: 'PUT'}
    );

    function createFrom(
        params: {
            scenarioId: string,
            name?: string,
            copyFromId?: string,
            revisions: KeyMap<ScenarioSchemaRevision<any>>
        }
    ) {
        const {name, copyFromId, revisions = {}} = params;

        const copy = revisions[copyFromId!];

        let newName = name;

        if (!name && copy) {
            const allNames = Object.values(revisions)
                .map((rev) => rev.name)
                .filter(Boolean) as string[];

            newName = generateCopyName(copy.name, allNames);
        }

        const schema = {};

        Object.keys(copy?.schema || {}).forEach((stageId) => {
            schema[stageId] = copy.schema[stageId].map((block) => {
                if (block.dataId.includes('fixed')) {
                    return block;
                }

                return {
                    ...block,
                    dataId: ID() + 'fixed',
                };
            });
        });

        const newRevision: ScenarioSchemaRevision<any> = {
            ...(copy || {}),
            id: ID(),
            name: newName || 'unknown',
            created: new Date(Date.now()).toString(),
            schema,
        };

        return {
            promise: req.update({
                revisionId: newRevision.id,
                scenarioId: params.scenarioId,
                data: newRevision,
            })
                .then(() => newRevision),
        };
    }

    return {
        ...req,
        createFrom,
    };
};
