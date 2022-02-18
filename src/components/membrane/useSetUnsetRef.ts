import {MutableRefObject, useEffect} from 'react';

export function useSetUnsetRef(
    ref: MutableRefObject<HTMLElement | null>,
    setRef: (id: string, ref: HTMLElement) => void,
    unsetRef: (id: string) => void,
    id: string
) {
    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        setRef(id, element);

        return () => {
            unsetRef(id);
        };
    }, [setRef, unsetRef, id, ref.current]);
}
