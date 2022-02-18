import {RefObject, useEffect, useRef, useState} from 'react';

export function useSizeChange<T extends HTMLElement>(deps) {
    const id = 'duplicate';
    const ref = useRef<T>(null);
    const [height, setHeight] = useState<number>(0);
    const [width, setWidth] = useState<number>(0);

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
        // @ts-ignore
        clone.style.width = 'auto';
        document.body.append(clone);
        const cloneEl = (document.getElementById(id) as T) || undefined;
        setHeight(cloneEl.clientHeight);
        setWidth(cloneEl.clientWidth);
        cloneEl.remove();
    }, [deps]);

    return {ref, height, width} as {
        ref: RefObject<T>;
        height: number;
        width: number;
    };
}
