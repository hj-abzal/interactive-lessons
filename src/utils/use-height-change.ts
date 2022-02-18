import {RefObject, useEffect, useRef, useState} from 'react';

export function useHeightChange<T extends HTMLElement>(deps) {
    const id = 'duplicate';
    const ref = useRef<T>(null);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }
        const clone = element.cloneNode(true);
        // @ts-ignore
        clone.id = id;
        // @ts-ignore
        clone.style.height = 'auto';
        document.body.append(clone);
        const cloneEl = (document.getElementById(id) as T) || undefined;
        setHeight(cloneEl.clientHeight);
        cloneEl.remove();
    }, [deps]);

    return [ref, height] as [RefObject<T>, number];
}
