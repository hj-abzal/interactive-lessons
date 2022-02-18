import {logger} from '@/utils/logger';
import _ from 'lodash';
import {useEffect, useMemo, useState} from 'react';
import {StateProducer, useImmerState} from '@/utils/use-immer-state';

export const request = (url, params) => {
    return fetch(url, {
        ...params,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(params.headers || {}),
        },
        body: params.body ? JSON.stringify(params.body) : undefined,
    })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }

            throw new Error(String(res.status));
        })
        .catch((error) => {
            logger.error('REQUEST_ERROR', error);

            throw error;
        });
};

export type GetParams = {
    method?: string,
    skip?: boolean,
}

export function useRequest<TData>(url, params: GetParams) {
    const {method, skip} = params;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [result, setResult] = useState<TData | undefined>(undefined);

    function retry() {
        setIsLoading(true);

        return request(url, {method})
            .then((result) => {
                setResult(result);
                return result;
            })
            .catch((e) => setError(e.message))
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        if (skip) {
            return;
        }

        retry();
    }, [url, method, skip]);

    return {
        isLoading,
        error,
        result,
        retry,
    };
}

export type UpdateParams = {
    method?: string,
    debounce?: number,
    throttle?: number,
}

export function useMutateRequest<TData>(url, params: UpdateParams) {
    const {method, throttle, debounce} = params;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [result, setResult] = useState<any | undefined>(undefined);

    const update = useMemo(() => {
        function updateFn(body: TData) {
            setIsLoading(true);

            return request(url, {body, method})
                .then(setResult)
                .catch((e) => setError(e.message))
                .finally(() => setIsLoading(false));
        }

        if (throttle) {
            return _.throttle(updateFn, throttle);
        }

        if (debounce) {
            return _.debounce(updateFn, debounce);
        }

        return updateFn;
    }, [method, url]);

    return {
        isLoading,
        error,
        result,
        update: update as (body: TData) => Promise<void>,
    };
}

export type SyncRequestOptions = {
    fetchUrl: string,
    updateUrl: string,
    updateMethod: string,
    throttle?: number,
    debounce?: number,
    skip?: boolean,
    disableUpdate?: boolean,
    fetchBeforeUpdate?: boolean,
}

type SyncState<TData> = {
    data: TData | undefined,
    shouldSync: boolean,
}

export function useSyncRequest<TData>({
    fetchUrl,
    updateUrl,
    updateMethod,
    debounce,
    skip,
    disableUpdate,
}: SyncRequestOptions) {
    const [syncLoading, setSyncLoading] = useState(false);
    const [mergeError, setMergeError] = useState<string | undefined>();

    const [state, produceState] = useImmerState<SyncState<TData>>(
        {
            data: undefined,
            shouldSync: true,
        });

    const updateReq = useMutateRequest<TData>(
        updateUrl,
        {method: updateMethod}
    );

    const update = useMemo(() => {
        function updateFn(data: TData) {
            setSyncLoading(true);

            return updateReq.update(data as TData)
                // .then((data) => {
                //     produceState((draft) => {
                //         draft.data = fetchReq.result;
                //         draft.shouldSync = false;
                //     });
                // })
                .catch((e) => setMergeError(e))
                .finally(() => {
                    setSyncLoading(false);
                });
        }

        return _.debounce(updateFn, debounce);
    }, [fetchUrl]);

    const produce: StateProducer<TData> = (cb) => {
        if (!state.data) {
            return;
        }

        // @ts-ignore
        produceState((draft) => {
            cb(draft.data!);
        });
    };

    function retry() {
        setSyncLoading(true);

        return request(fetchUrl, {method: 'GET'})
            .then((result) => {
                produceState((draft) => {
                    draft.data = result;
                    draft.shouldSync = false;
                });

                return result;
            })
            .catch((e) => setMergeError(e.message))
            .finally(() => setSyncLoading(false));
    }

    // function retry() {
    //     produceState((draft) => {
    //         draft.shouldSync = true;
    //     });
    //
    //     fetchReq.retry().then((data) => {
    //         produceState((draft) => {
    //             draft.data = fetchReq.result;
    //             draft.shouldSync = false;
    //         });
    //     });
    // }

    useEffect(function syncEff() {
        if (!state.data || disableUpdate) {
            return;
        }

        update(state.data);
    }, [state.data]);

    useEffect(function fetch() {
        if (!skip && fetchUrl) {
            retry();
        }
    }, [fetchUrl, skip]);

    return {
        isLoading: updateReq.isLoading || syncLoading,
        result: state.data,
        error: updateReq.error || mergeError,
        produce,
        retry,
    };
}
