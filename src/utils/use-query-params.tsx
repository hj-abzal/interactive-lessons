// A custom hook that builds on useLocation to parse
// the query string for you.
import {useLocation} from 'react-router-dom';

export function useQueryParams() {
    return new URLSearchParams(useLocation().search);
}
