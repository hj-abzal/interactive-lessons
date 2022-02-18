import url from 'url';
import {useHistory, useLocation} from 'react-router-dom';
import {useCallback, useMemo} from 'react';

type Routes = {
    [key: string]: {
        path: string,
        exact?: boolean,
        defaultParams?: RouteParams,
        title?: string,
        queryParams?: RouteParams,
        defaultQueryParams?: RouteParams,
    }
}

export type Router<TRoutes extends Routes, TRoutesId extends keyof TRoutes> = {
    ids: {
        [key in TRoutesId]: TRoutesId;
    },
    routes: TRoutes,
    /**
     * @name build
     *
     * build route url by routeId and inject params to route template path
     *
     * /kek/:a/:b/kek + {a: 1, b: 2} => /kek/1/2/kek
     */
    build: (routeId: TRoutesId, params?: RouteParams, query?: RouteParams) => string,
    parse: (urlToParse: string) => RouteMatchResult<TRoutes> | undefined,
    idsArr: TRoutesId[],
}

type RouteParams = {
    [key: string]: string | number,
}

type RouteMatchResult<TRoutes extends Routes> = {
    routeId: keyof TRoutes;
    path: string;
    params?: RouteParams;
    is: (id: keyof TRoutes) => boolean,
};

export function createRoutes<TRoutes extends Routes>(routes: TRoutes): Router<TRoutes, keyof TRoutes> {
    type RoutesIds = {
        [key in keyof TRoutes]: keyof TRoutes;
    }

    Object.keys(routes).forEach((id) => {
        if (routes[id].path[0] !== '/') {
            throw new Error(`route ${id} should start with leading slash, current: ${routes[id].path}`);
        }
    });

    const ids: RoutesIds = Object.keys(routes).reduce((acc, id) => {
        acc[id] = id;
        return acc;
    }, {}) as RoutesIds;

    const router: Omit<Router<TRoutes, keyof TRoutes>, 'useHook'> = {
        ids,
        routes: routes,
        build: buildRouteFactory<TRoutes, keyof TRoutes>(routes),
        parse: parseRouteFactory<TRoutes>(routes),
        idsArr: Object.values(ids),
    };

    return router;
}

export function buildRouteFactory<TRoutes extends Routes, RouteId extends keyof TRoutes>(routes: TRoutes) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (routeId: RouteId, params?: RouteParams, query: RouteParams = {}) => {
        const routeObj = routes[routeId];

        if (!routeObj || !routeObj.path) {
            throw new Error(`route ${routeId} not found`);
        }

        const {defaultParams = {}, defaultQueryParams = {}, queryParams} = routeObj;
        const paramsOrDefaults = Object.assign({}, defaultParams || {}, params || {});

        const paramsKeys = Object.keys(paramsOrDefaults);

        let result = routeObj.path;

        if (paramsKeys.length > 0) {
            for (const paramKey of paramsKeys) {
                const paramRegexp = new RegExp(`:${paramKey}`, 'g');

                result = result.replace(paramRegexp, String(paramsOrDefaults[paramKey]) + '');
            }
        }

        if (queryParams) {
            const filteredQueryParams = Object.keys(queryParams).reduce((acc, key) => {
                if (typeof query[key] !== 'undefined') {
                    acc[key] = query[key];
                } else {
                    acc[key] = defaultQueryParams[key];
                }

                return acc;
            }, {});

            const queryString = buildQueryParams(filteredQueryParams);

            result += `?${queryString}`;
        }

        return result;
    };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function parseRouteFactory<TRoutes extends Routes>(routes: TRoutes) {
    const routesIds = Object.keys(routes);

    return (urlToParse: string): RouteMatchResult<TRoutes> | undefined => {
        const currentPath = url.parse(urlToParse).pathname;

        if (!currentPath) {
            throw new Error('current path is not exist');
        }

        for (const routeId of routesIds) {
            const routeCandidate = routes[routeId];

            const routeWithParamsPattern = routeCandidate.path.replace(
                /:([a-zA-Z-_0-9-]+)/g,
                '(?<$1>[a-zA-Z-_0-9-]+)'
            );

            const routeRegexp = new RegExp(`^${routeWithParamsPattern}$`);

            const match = currentPath.match(routeRegexp);

            if (match) {
                return {
                    routeId: String(routeId),
                    path: routeCandidate.path,
                    params: match.groups,
                    is: (id) => id === String(routeId),
                };
            }
        }

        return undefined;
    };
}

function buildQueryParams(queryParams: RouteParams) {
    return Object.keys(queryParams).reduce((acc, key) => {
        if (!queryParams[key]) {
            return acc;
        }

        const separator = acc.length !== 0 ? '&' : '';

        acc += `${separator}${key}=${queryParams[key]}`;

        return acc;
    }, '');
}

export function useRouterState<
    TRoutes extends Routes,
    TRoutesId extends keyof TRoutes,
>(router: Router<TRoutes, TRoutesId>) {
    const history = useHistory();
    const location = useLocation();

    const match = useMemo(() => router.parse(location.pathname), [location]);

    const toRoute = useCallback((params: {
            id: TRoutesId,
            params?: any,
            query?: any,
            reload?: boolean,
            replace?: boolean
        }) => {
        const route = router.build(params.id, params.params, params.query);

        if (!route) {
            throw new Error(`${params.id} with ${JSON.stringify(params)} does not exist on router`);
        }

        if (params.replace) {
            history.replace(route);
        } else {
            history.push(route);
        }

        if (params.reload) {
            window.location.reload();
        }
    }, [router, history]);

    const queryParams: URLSearchParams = new URLSearchParams(location.search);

    const setQueryParams = useCallback(({query}: {query: {[key: string]: string}}) => {
        history.push(`${location.pathname}?${new URLSearchParams(query).toString()}`);
    }, [history]);

    return {
        toRoute,
        build: router.build,
        parse: router.parse,
        ids: router.ids,
        routes: router.routes,
        match: match,
        idsArr: router.idsArr,
        queryParams,
        setQueryParams,
    };
}
