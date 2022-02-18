import {useHistory, useLocation} from 'react-router-dom';

export function useLocationSearchParams<TParams>(): [URLSearchParams, (p: TParams) => void] {
    const history = useHistory();
    const location = useLocation();
    const locationParams: URLSearchParams = new URLSearchParams(location.search);
    const setSearchParams = (locationParamsObj) =>
        history.push(`${location.pathname}?${new URLSearchParams({
            // @ts-ignore
            ...Object.fromEntries(locationParams),
            ...locationParamsObj,
        }).toString()}`);
    return [locationParams, setSearchParams];
}
