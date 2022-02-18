import {ConstructorScenarioSchema} from '@/components/constructor/types';

type DateString = string;

export type KeyMap<T> = {
    [key: string]: T
}

export type SberPackage = {
    id: string,
    name: string,
    meta: string,
    namespaceId?: string,
    scenarioId?: string,
    lessonPath?: string,
}

export type ScenarioSchemaRevision<R extends string> = {
    id: R,
    name: string,
    schema: ConstructorScenarioSchema,
    created: DateString,
};

export type Namespace<NS extends string, S extends string> = {
    id: NS,
    slug: string,
    name: string,
    scenariosIds: S[],
}

export type Scenario<S extends string, R extends string> = {
    id: S,
    name: string,
    slug: string,
    publishedRevisionId?: R,
    revisionIds: R[],
}

// DEPRECATED ONLY FOR MIGRATION TYPES
export type ScenarioStorageResponse<S extends string, R extends string, NS extends string> = {
    __version?: number,

    namespaces: {
        [id in NS]: Namespace<NS, S>
    },
    scenarios: {
        [name in S]: Scenario<S, R>
    },
    revisions: {
        [id in R]: ScenarioSchemaRevision<R>
    },
}

export type ScenarioStorageConfig = {
    __version: number,
    packages: {
        [id: string]: SberPackage,
    }
    namespaces: {
        [id: string]: Namespace<any, any>
    },
    scenarios: {
        [id: string]: Scenario<any, any>
    },
};

export type ScenarioStorageRevisions = {
    [id: string]: ScenarioSchemaRevision<string>
}
